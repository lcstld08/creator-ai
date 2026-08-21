import jwt from "jsonwebtoken";

const COOKIE_NAME = "session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days — this is what keeps people logged in

export function signSession(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .filter(Boolean)
      .map((c) => {
        const idx = c.indexOf("=");
        return [c.slice(0, idx).trim(), decodeURIComponent(c.slice(idx + 1))];
      })
  );
}

export function setSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`
  );
}

export function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

/** Reads and verifies the session cookie on an incoming request. Returns the
 * decoded { email, firstName } or null if not logged in / token invalid. */
export function getSessionUser(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifySession(token);
}

export function isAdminEmail(email) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes((email || "").toLowerCase());
}
