import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/guard";
import { getTopics, saveTopics } from "@/lib/db";

export const dynamic = "force-dynamic";

function slugify(s) {
  const accents = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ñ: "n", ü: "u" };
  return String(s)
    .toLowerCase()
    .replace(/[áéíóúñü]/g, (c) => accents[c] || c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  return NextResponse.json({ topics: await getTopics() });
}

export async function PUT(req) {
  if (!isAdmin()) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { topics } = await req.json();
  if (!Array.isArray(topics)) {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }
  // Asegurar id y slug
  const cleaned = topics.map((t, i) => ({
    id: t.id || "t_" + Math.random().toString(36).slice(2, 8),
    slug: t.slug || slugify(t.title || `tema-${i + 1}`),
    title: t.title || "",
    category: t.category || "",
    speaker: t.speaker || "",
    speakerBio: t.speakerBio || "",
    summary: t.summary || "",
    description: t.description || "",
    durationMin: Number(t.durationMin) || 90,
    imageUrl: t.imageUrl || "",
    active: t.active !== false,
  }));
  await saveTopics(cleaned);
  return NextResponse.json({ ok: true, topics: cleaned });
}
