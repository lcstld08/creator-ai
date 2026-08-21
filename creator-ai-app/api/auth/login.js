import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";
import { signSession, setSessionCookie } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Champs manquants" });

  const normalizedEmail = email.toLowerCase();
  const user = await kv.get(`user:${normalizedEmail}`);
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Email ou mot de passe incorrect." });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Email ou mot de passe incorrect." });

  const token = signSession({ email: user.email, firstName: user.firstName });
  setSessionCookie(res, token);
  return res.status(200).json({ email: user.email, firstName: user.firstName, credits: user.credits ?? 0 });
}
