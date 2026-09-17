import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/guard";
import { getSettings, saveSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  if (!isAdmin()) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const patch = await req.json();
  const current = await getSettings();
  const merged = { ...current, ...patch };
  await saveSettings(merged);
  return NextResponse.json({ ok: true, settings: merged });
}
