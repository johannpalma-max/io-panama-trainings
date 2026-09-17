// Autenticación simple del administrador mediante cookie firmada (HMAC).
// Credenciales tomadas de variables de entorno; valores por defecto solo
// para el primer arranque (cámbialos en Vercel antes de usar en serio).

import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "cambia-este-secreto-en-vercel";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "johannpalma";

export const COOKIE_NAME = "io_admin";
const MAX_AGE = 60 * 60 * 8; // 8 horas

function sign(data) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function checkCredentials(user, password) {
  return user === ADMIN_USER && password === ADMIN_PASSWORD;
}

export function createSessionToken(user) {
  const payload = JSON.stringify({ u: user, exp: Date.now() + MAX_AGE * 1000 });
  const data = Buffer.from(payload).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifySessionToken(token) {
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

export const cookieOptions = {
  name: COOKIE_NAME,
  httpOnly: true,
  sameSite: "lax",
  secure: true,
  path: "/",
  maxAge: MAX_AGE,
};
