import { kv } from "@vercel/kv";
import { getSessionUser } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = getSessionUser(req);
  if (!session) return res.status(401).json({ error: "Connecte-toi pour utiliser les outils IA." });

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "Missing prompt" });
  if (prompt.length > 4000) return res.status(400).json({ error: "Prompt too long" });

  const userKey = `user:${session.email}`;
  const user = await kv.get(userKey);
  if (!user) return res.status(401).json({ error: "Compte introuvable, reconnecte-toi." });
  if ((user.credits ?? 0) <= 0) {
    return res.status(402).json({ error: "Plus de crédits disponibles.", credits: 0 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server misconfigured: ANTHROPIC_API_KEY is not set" });

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      return res.status(anthropicRes.status).json({ error: "Anthropic API error", detail: errBody });
    }

    const data = await anthropicRes.json();
    const text = (data.content || []).map((b) => b.text || "").join("\n");

    // Only spend the credit once we know the generation actually succeeded.
    user.credits = (user.credits || 0) - 1;
    await kv.set(userKey, user);

    return res.status(200).json({ text, credits: user.credits });
  } catch (err) {
    return res.status(500).json({ error: "Generation failed", detail: String(err) });
  }
}
