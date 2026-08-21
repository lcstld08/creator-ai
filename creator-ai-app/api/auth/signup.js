import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";
import { signSession, setSessionCookie } from "../_lib/auth.js";
import { pushNotification } from "../_lib/notify.js";

const STARTER_CREDITS = 10;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { firstName, email, password } = req.body || {};
  if (!firstName || !email || !password) return res.status(400).json({ error: "Champs manquants" });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Email invalide" });
  if (password.length < 6) return res.status(400).json({ error: "Mot de passe trop court (6 caractères minimum)" });

  const normalizedEmail = email.toLowerCase();
  const key = `user:${normalizedEmail}`;
  const existing = await kv.get(key);
  if (existing) return res.status(409).json({ error: "Un compte existe déjà avec cet email — connecte-toi plutôt." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    firstName,
    email: normalizedEmail,
    passwordHash,
    credits: STARTER_CREDITS,
    createdAt: Date.now(),
    provider: "password",
  };
  await kv.set(key, user);
  await kv.sadd("users:index", normalizedEmail);
  await pushNotification(normalizedEmail, {
    type: "welcome",
    message: `Bienvenue sur Creator AI ! Tu as reçu ${STARTER_CREDITS} crédits IA offerts pour démarrer.`,
  });

  const token = signSession({ email: normalizedEmail, firstName });
  setSessionCookie(res, token);
  return res.status(200).json({ email: normalizedEmail, firstName, credits: STARTER_CREDITS });
}
