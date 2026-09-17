import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/guard";
import { getBookings, getSettings, updateBooking } from "@/lib/db";
import { sendEmail, emailLayout } from "@/lib/email";
import { buildICS, googleCalLink } from "@/lib/ics";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { bookingId, emails } = await req.json();
  const list = (emails || "")
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter((e) => e.includes("@"));

  if (!list.length) {
    return NextResponse.json({ error: "Agrega al menos un correo válido." }, { status: 400 });
  }

  const bookings = await getBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
  }

  const settings = await getSettings();
  const ics = buildICS({
    title: booking.topicTitle,
    description: `Training con ${booking.speaker} · Foro ${booking.forumName}`,
    date: booking.date,
    time: booking.time,
    durationMin: 90,
    organizerEmail: settings.contactEmail,
  });
  const gcal = googleCalLink({
    title: booking.topicTitle,
    description: `Training con ${booking.speaker} · Foro ${booking.forumName}`,
    date: booking.date,
    time: booking.time,
    durationMin: 90,
  });

  const icsB64 = Buffer.from(ics).toString("base64");

  try {
    await Promise.all(
      list.map((to) =>
        sendEmail({
          to,
          subject: `Invitación: ${booking.topicTitle}`,
          html: emailLayout(
            `<h2 style="margin-top:0">Estás invitado a un training</h2>
             <p><strong>${booking.topicTitle}</strong></p>
             <p>Fecha: <strong>${booking.date} ${booking.time}</strong></p>
             <p>Facilitador: ${booking.speaker} · Foro ${booking.forumName}</p>
             <p style="margin-top:20px"><a href="${gcal}" style="background:${settings.brandAccent};color:${settings.brandPrimary};padding:12px 20px;border-radius:8px;font-weight:600;text-decoration:none;display:inline-block">Agregar a mi calendario</a></p>
             <p style="font-size:13px;color:#888">También adjuntamos el archivo de calendario (.ics).</p>`,
            settings.brandPrimary
          ),
          attachments: [
            { filename: "invitacion.ics", content: icsB64 },
          ],
        })
      )
    );
  } catch (e) {
    console.error("Error enviando invitaciones:", e);
    return NextResponse.json({ error: "No se pudieron enviar todas las invitaciones." }, { status: 500 });
  }

  const merged = Array.from(new Set([...(booking.attendees || []), ...list]));
  const updated = await updateBooking(bookingId, { attendees: merged });

  return NextResponse.json({ ok: true, booking: updated });
}
