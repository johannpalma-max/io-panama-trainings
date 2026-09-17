import { NextResponse } from "next/server";
import { MEMBER_COOKIE } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: MEMBER_COOKIE, value: "", path: "/", maxAge: 0 });
  return res;
}
