import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "./auth";
import { MEMBER_COOKIE, verifyMemberSession } from "./member-auth";

// Devuelve el payload de sesión si el usuario es admin válido, o null.
export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function isAdmin() {
  return Boolean(getSession());
}

// Sesión del miembro (magic link). Devuelve { email } o null.
export function getMemberSession() {
  const token = cookies().get(MEMBER_COOKIE)?.value;
  return verifyMemberSession(token);
}
