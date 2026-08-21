// Stripe calls this URL directly (server-to-server) once a payment succeeds.
// This is the ONLY place that should ever grant access or credits — never
// trust the browser alone.

import Stripe from "stripe";
import { kv } from "@vercel/kv";
import { pushNotification } from "./_lib/notify.js";

export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${out.slice(0, 5)}-${out.slice(5)}`;
}

async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";
  if (!apiKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: `Creator AI <${from}>`, to, subject, html }),
  });
}

async function handleFormationPurchase(session) {
  const { formationId, formationTitle, email } = session.metadata || {};
  if (!formationId || !email) return;

  const code = generateCode();
  await kv.set(`code:${code}`, { email, formationId, formationTitle, createdAt: Date.now(), stripeSessionId: session.id });

  // Grant access directly to the account tied to this email — the code is a
  // backup for restoring access on another device, not the only way in.
  const existing = (await kv.get(`access:${email}`)) || [];
  const list = Array.isArray(existing) ? existing : [];
  if (!list.includes(formationId)) list.push(formationId);
  await kv.set(`access:${email}`, list);

  await pushNotification(email, {
    type: "purchase",
    message: `Paiement confirmé pour "${formationTitle}". Ton accès est débloqué.`,
  });

  await sendEmail({
    to: email,
    subject: `Ton accès à "${formationTitle}" est prêt`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Paiement confirmé 🎉</h2>
        <p>Merci pour ton achat de <strong>${formationTitle}</strong>. Ton accès est déjà débloqué sur ton compte — reconnecte-toi simplement avec ${email}.</p>
        <p>Si tu utilises un autre appareil, voici ton code d'accès de secours :</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 2px; background: #f4f4f5; padding: 16px; border-radius: 8px; text-align: center;">${code}</p>
      </div>
    `,
  });
}

async function handleCreditsPurchase(session) {
  const { email, creditAmount } = session.metadata || {};
  const amount = parseInt(creditAmount, 10);
  if (!email || !amount) return;

  const key = `user:${email}`;
  const user = await kv.get(key);
  if (!user) return;
  user.credits = (user.credits || 0) + amount;
  await kv.set(key, user);

  await pushNotification(email, {
    type: "credits",
    message: `${amount} crédits ajoutés à ton compte. Solde : ${user.credits}.`,
  });

  await sendEmail({
    to: email,
    subject: `${amount} crédits ajoutés à ton compte Creator AI`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Paiement confirmé 🎉</h2>
        <p>${amount} crédits ont été ajoutés à ton compte. Ton nouveau solde : <strong>${user.credits}</strong>.</p>
      </div>
    `,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!webhookSecret || !secretKey) {
    return res.status(500).json({ error: "Server misconfigured: Stripe env vars missing" });
  }

  const stripe = new Stripe(secretKey);
  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.metadata?.type === "credits") {
      await handleCreditsPurchase(session);
    } else {
      await handleFormationPurchase(session);
    }
  }

  return res.status(200).json({ received: true });
}
