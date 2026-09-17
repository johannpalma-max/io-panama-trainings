import { NextResponse } from "next/server";
import { verifyMagicToken, createMemberSession, memberCookieOptions } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const email = verifyMagicToken(token);

  if (!email) {
    // Enlace inválido o caducado → volver a la página de acceso con aviso
    return NextResponse.redirect(new URL("/acceso?error=expirado", url.origin));
  }

  const session = createMemberSession(email);
  const res = NextResponse.redirect(new URL("/mis-trainings", url.origin));
  res.cookies.set({ ...memberCookieOptions, value: session });
  return res;
}
