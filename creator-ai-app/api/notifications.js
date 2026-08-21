import { kv } from "@vercel/kv";
import { getSessionUser } from "../_lib/auth.js";

export default async function handler(req, res) {
  const session = getSessionUser(req);
  if (!session) return res.status(401).json({ error: "Non connecté" });
  const key = `notifications:${session.email}`;

  if (req.method === "GET") {
    const list = (await kv.get(key)) || [];
    return res.status(200).json({ notifications: list });
  }

  if (req.method === "POST") {
    const list = (await kv.get(key)) || [];
    const updated = list.map((n) => ({ ...n, read: true }));
    await kv.set(key, updated);
    return res.status(200).json({ notifications: updated });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
