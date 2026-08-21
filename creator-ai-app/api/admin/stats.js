import { kv } from "@vercel/kv";
import { getSessionUser, isAdminEmail } from "../_lib/auth.js";

export default async function handler(req, res) {
  const session = getSessionUser(req);
  if (!session || !isAdminEmail(session.email)) return res.status(403).json({ error: "Réservé aux administrateurs." });

  const emails = (await kv.smembers("users:index")) || [];
  const users = [];
  for (const email of emails) {
    const u = await kv.get(`user:${email}`);
    if (u) users.push({ email: u.email, firstName: u.firstName, credits: u.credits, createdAt: u.createdAt, provider: u.provider });
  }

  return res.status(200).json({ users, userCount: users.length });
}
