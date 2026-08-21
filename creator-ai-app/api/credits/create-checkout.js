import Stripe from "stripe";
import { getSessionUser } from "../_lib/auth.js";

// Reasonable, simple pricing — adjust freely, this is just a sane starting point.
export const CREDIT_PACKS = {
  small: { credits: 30, price: 4.9, label: "30 crédits" },
  medium: { credits: 80, price: 9.9, label: "80 crédits" },
  large: { credits: 200, price: 19.9, label: "200 crédits" },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = getSessionUser(req);
  if (!session) return res.status(401).json({ error: "Connecte-toi pour acheter des crédits." });

  const { pack } = req.body || {};
  const chosen = CREDIT_PACKS[pack];
  if (!chosen) return res.status(400).json({ error: "Pack invalide" });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: "Server misconfigured: STRIPE_SECRET_KEY is not set" });

  const stripe = new Stripe(secretKey);
  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `${chosen.label} — Creator AI` },
            unit_amount: Math.round(chosen.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { type: "credits", email: session.email, creditAmount: String(chosen.credits) },
      success_url: `${origin}/?checkout=credits-success`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });
    return res.status(200).json({ url: checkout.url });
  } catch (err) {
    return res.status(500).json({ error: "Erreur Stripe", detail: String(err) });
  }
}
