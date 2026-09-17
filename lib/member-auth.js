// Autenticación de miembros sin contraseña (magic link).
// - Magic token: corto (30 min), se envía por correo.
// - Session token: largo (30 días), cookie tras verificar el magic link.
// Ambos firmados con HMAC usando AUTH_SECRET.

import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "cambia-este-secreto-en-vercel";

export const MEMBER_COOKIE = "io_member";
const MAGIC_TTL = 30 * 60 * 1000; // 30 min
const SESSION_TTL = 30 * 24 * 60 * 60 * 1000; // 30 días

function sign(data) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

function makeToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

function readToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  if (sign(data) !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createMagicToken(email) {
  return makeToken({ t: "magic", email: email.toLowerCase(), exp: Date.now() + MAGIC_TTL });
}

export function verifyMagicToken(token) {
  const p = readToken(token);
  return p && p.t === "magic" ? p.email : null;
}

export function createMemberSession(email) {
  return makeToken({ t: "session", email: email.toLowerCase(), exp: Date.now() + SESSION_TTL });
}

export function verifyMemberSession(token) {
  const p = readToken(token);
  return p && p.t === "session" ? { email: p.email } : null;
}

export const memberCookieOptions = {
  name: MEMBER_COOKIE,
  httpOnly: true,
  sameSite: "lax",
  secure: true,
  path: "/",
  maxAge: Math.floor(SESSION_TTL / 1000),
};
