import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/guard";
import { getSettings, updateBooking } from "@/lib/db";
import { sendEmail, emailLayout } from "@/lib/email";
import { googleCalLink } from "@/lib/ics";

export const dynamic = "force-dynamic";

const ALLOWED = ["pending", "confirmed", "done", "cancelled"];

export async function PATCH(req, { params }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const patch = await req.json();
  const next = {};
  if (patch.status && ALLOWED.includes(patch.status)) next.status = patch.status;
  if (patch.date) next.date = patch.date;
  if (patch.time) next.time = patch.time;

  const updated = await updateBooking(params.id, next);
  if (!updated) {
    return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
  }

  // Al confirmar, avisar al solicitante con enlace de calendario
  if (next.status === "confirmed") {
    const settings = await getSettings();
    const gcal = googleCalLink({
      title: updated.topicTitle,
      description: `Training con ${updated.speaker} · Foro ${updated.forumName}`,
      date: updated.date,
      time: updated.time,
      durationMin: 90,
    });
    try {
      await sendEmail({
        to: updated.requesterEmail,
        subject: `Confirmada: ${updated.topicTitle}`,
        html: emailLayout(
          `<h2 style="margin-top:0">¡Tu sesión está confirmada!</h2>
           <p><strong>${updated.topicTitle}</strong></p>
           <p>Fecha: <strong>${updated.date} ${updated.time}</strong></p>
           <p>Facilitador: ${updated.speaker}</p>
           <p style="margin-top:20px"><a href="${gcal}" style="background:${settings.brandAccent};color:${settings.brandPrimary};padding:12px 20px;border-radius:8px;font-weight:600;text-decoration:none;display:inline-block">Agregar a Google Calendar</a></p>`,
          settings.brandPrimary
        ),
      });
    } catch (e) {
      console.error("Error enviando confirmación:", e);
    }
  }

  return NextResponse.json({ ok: true, booking: updated });
}
