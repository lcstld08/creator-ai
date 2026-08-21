import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: "Missing code" });

  const raw = await kv.get(`code:${code.trim().toUpperCase()}`);
  if (!raw) return res.status(404).json({ error: "Code invalide" });

  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  return res.status(200).json({
    formationId: data.formationId,
    formationTitle: data.formationTitle,
    email: data.email,
  });
}
