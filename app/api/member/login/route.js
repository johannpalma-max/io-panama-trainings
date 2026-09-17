import { NextResponse } from "next/server";
import { createMagicToken } from "@/lib/member-auth";
import { saveMember, getSettings } from "@/lib/db";
import { sendEmail, emailLayout } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Correo inválido." }, { status: 400 });
    }
    const clean = email.trim().toLowerCase();

    // Guardar/actualizar el miembro
    await saveMember({ email: clean, name: (name || "").trim() });

    // Crear magic link
    const token = createMagicToken(clean);
    const origin = new URL(req.url).origin;
    const link = `${origin}/api/member/verify?token=${encodeURIComponent(token)}`;

    const settings = await getSettings();
    await sendEmail({
      to: clean,
      subject: "Tu acceso a EO Panamá · Trainings",
      html: emailLayout(
        `<h2 style="margin-top:0">Tu enlace de acceso</h2>
         <p>Haz clic en el botón para entrar a tu área de trainings. El enlace caduca en 30 minutos.</p>
         <p style="margin:24px 0"><a href="${link}" style="background:${settings.brandPrimary};color:#fff;padding:12px 22px;border-radius:8px;font-weight:700;text-decoration:none;display:inline-block">Entrar a Mis Trainings</a></p>
         <p style="font-size:13px;color:#888">Si no solicitaste este acceso, puedes ignorar este correo.</p>`,
        settings.brandPrimary
      ),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/member/login", err);
    return NextResponse.json({ error: "No se pudo enviar el enlace." }, { status: 500 });
  }
}
