import { kv } from "@vercel/kv";
import { getSessionUser, isAdminEmail } from "../_lib/auth.js";

export default async function handler(req, res) {
  const session = getSessionUser(req);
  if (!session) return res.status(200).json({ user: null });

  const user = await kv.get(`user:${session.email}`);
  if (!user) return res.status(200).json({ user: null });

  const owned = (await kv.get(`access:${user.email}`)) || [];

  return res.status(200).json({
    user: {
      email: user.email,
      firstName: user.firstName,
      credits: user.credits ?? 0,
      isAdmin: isAdminEmail(user.email),
      ownedFormations: Array.isArray(owned) ? owned : [],
    },
  });
}
