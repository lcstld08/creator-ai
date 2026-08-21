import { kv } from "@vercel/kv";

export async function pushNotification(email, notif) {
  const key = `notifications:${email}`;
  const list = (await kv.get(key)) || [];
  const next = [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, read: false, date: Date.now(), ...notif }, ...list];
  await kv.set(key, next.slice(0, 50)); // keep the last 50
}
