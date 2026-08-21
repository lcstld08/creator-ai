import { kv } from "@vercel/kv";
import { getSessionUser, isAdminEmail } from "../_lib/auth.js";

export default async function handler(req, res) {
  const session = getSessionUser(req);
  if (!session || !isAdminEmail(session.email)) return res.status(403).json({ error: "Réservé aux administrateurs." });

  const ids = (await kv.smembers("conversations:index")) || [];
  const conversations = [];
  for (const id of ids) {
    const conv = await kv.get(`conversation:${id}`);
    if (conv) {
      const last = conv.messages[conv.messages.length - 1];
      conversations.push({
        id: conv.id,
        userEmail: conv.userEmail,
        status: conv.status,
        updatedAt: conv.updatedAt,
        lastMessage: last ? last.text.slice(0, 80) : "",
        lastFrom: last ? last.from : "",
      });
    }
  }
  conversations.sort((a, b) => b.updatedAt - a.updatedAt);

  return res.status(200).json({ conversations });
}
