import { kv } from "@vercel/kv";
import { getSessionUser, isAdminEmail } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: "Missing id" });

  const conv = await kv.get(`conversation:${id}`);
  if (!conv) return res.status(404).json({ error: "Conversation introuvable" });

  const session = getSessionUser(req);
  // If the conversation belongs to a logged-in account, only that account or
  // an admin may read it. Guest conversations are reachable by anyone who
  // has the id (acts like a private ticket link) — fine for this scope.
  if (conv.userEmail && !isAdminEmail(session?.email) && session?.email !== conv.userEmail) {
    return res.status(403).json({ error: "Accès refusé" });
  }

  return res.status(200).json({ conversation: conv });
}
