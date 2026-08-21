import { OAuth2Client } from "google-auth-library";
import { kv } from "@vercel/kv";
import { signSession, setSessionCookie } from "../_lib/auth.js";
import { pushNotification } from "../_lib/notify.js";

const STARTER_CREDITS = 10;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { credential } = req.body || {};
  if (!credential) return res.status(400).json({ error: "Jeton Google manquant" });
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: "Server misconfigured: GOOGLE_CLIENT_ID is not set" });
  }

  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: "Jeton Google invalide" });
  }
  if (!payload?.email) return res.status(401).json({ error: "Impossible de récupérer l'email Google" });

  const email = payload.email.toLowerCase();
  const key = `user:${email}`;
  let user = await kv.get(key);
  if (!user) {
    user = {
      firstName: payload.given_name || payload.name || "Utilisateur",
      email,
      credits: STARTER_CREDITS,
      createdAt: Date.now(),
      provider: "google",
    };
    await kv.set(key, user);
    await kv.sadd("users:index", email);
    await pushNotification(email, {
      type: "welcome",
      message: `Bienvenue sur Creator AI ! Tu as reçu ${STARTER_CREDITS} crédits IA offerts pour démarrer.`,
    });
  }

  const token = signSession({ email: user.email, firstName: user.firstName });
  setSessionCookie(res, token);
  return res.status(200).json({ email: user.email, firstName: user.firstName, credits: user.credits ?? 0 });
}
