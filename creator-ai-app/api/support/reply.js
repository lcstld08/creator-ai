import { kv } from "@vercel/kv";
import { getSessionUser, isAdminEmail } from "../_lib/auth.js";
import { pushNotification } from "../_lib/notify.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const session = getSessionUser(req);
  if (!session || !isAdminEmail(session.email)) return res.status(403).json({ error: "Réservé aux administrateurs." });

  const { conversationId, message } = req.body || {};
  if (!conversationId || !message?.trim()) return res.status(400).json({ error: "Champs manquants" });

  const key = `conversation:${conversationId}`;
  const conv = await kv.get(key);
  if (!conv) return res.status(404).json({ error: "Conversation introuvable" });

  conv.messages.push({ from: "admin", text: message.trim(), date: Date.now() });
  conv.updatedAt = Date.now();
  await kv.set(key, conv);

  if (conv.userEmail) {
    await pushNotification(conv.userEmail, { type: "support", message: "Tu as reçu une réponse de l'équipe dans ton assistance." });
  }

  return res.status(200).json({ conversation: conv });
}
