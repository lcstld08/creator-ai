import Stripe from "stripe";
import { getSessionUser } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = getSessionUser(req);
  if (!session) return res.status(401).json({ error: "Connecte-toi pour acheter cette formation." });

  const { formationId, formationTitle, priceEUR } = req.body || {};
  if (!formationId || !formationTitle || !priceEUR) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: "Server misconfigured: STRIPE_SECRET_KEY is not set" });

  const stripe = new Stripe(secretKey);
  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: formationTitle },
            unit_amount: Math.round(Number(priceEUR) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { type: "formation", formationId, formationTitle, email: session.email },
      success_url: `${origin}/?checkout=success&formation=${encodeURIComponent(formationId)}`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    return res.status(500).json({ error: "Could not create checkout session", detail: String(err) });
  }
}
