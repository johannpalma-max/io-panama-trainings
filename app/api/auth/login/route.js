import { NextResponse } from "next/server";
import { checkCredentials, createSessionToken, cookieOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { user, password } = await req.json();
  if (!checkCredentials(user, password)) {
    return NextResponse.json({ error: "Usuario o clave incorrectos." }, { status: 401 });
  }
  const token = createSessionToken(user);
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...cookieOptions, value: token });
  return res;
}
