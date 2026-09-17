import { NextResponse } from "next/server";
import { addBooking, getSettings, getTopicBySlug, getMember } from "@/lib/db";
import { getMemberSession } from "@/lib/guard";
import { sendEmail, emailLayout } from "@/lib/email";

export const dynamic = "force-dynamic";

function id() {
  return "b_" + Math.random().toString(36).slice(2, 10);
}

export async function POST(req) {
  try {
    // Reservar requiere sesión de miembro (magic link)
    const session = getMemberSession();
    if (!session) {
      return NextResponse.json(
        { error: "Inicia sesión para reservar." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { topicSlug, forumName, date, time, message } = body;

    if (!topicSlug || !forumName || !date || !time) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    const member = await getMember(session.email);
    const requesterEmail = session.email;
    const requesterName = (member && member.name) || session.email;

    const topic = await getTopicBySlug(topicSlug);
    if (!topic) {
      return NextResponse.json({ error: "Tema no encontrado." }, { status: 404 });
    }

    const settings = await getSettings();

    const booking = {
      id: id(),
      topicSlug,
      topicTitle: topic.title,
      speaker: topic.speaker,
      requesterName,
      requesterEmail,
      forumName,
      date,
      time,
      message: message || "",
      status: "pending",
      attendees: [],
      createdAt: new Date().toISOString(),
    };

    await addBooking(booking);

    const accent = settings.brandPrimary || "#0B1F3A";

    // Correo al administrador
    const adminHtml = emailLayout(
      `<h2 style="margin-top:0">Nueva solicitud de reserva</h2>
       <p><strong>${requesterName}</strong> (${forumName}) solicitó el training:</p>
       <p style="font-size:18px;font-weight:700">${topic.title}</p>
       <table style="font-size:14px">
         <tr><td style="padding:4px 8px;color:#888">Facilitador</td><td style="padding:4px 8px">${topic.speaker}</td></tr>
         <tr><td style="padding:4px 8px;color:#888">Fecha preferida</td><td style="padding:4px 8px">${date} ${time}</td></tr>
         <tr><td style="padding:4px 8px;color:#888">Solicitante</td><td style="padding:4px 8px">${requesterName} · ${requesterEmail}</td></tr>
         <tr><td style="padding:4px 8px;color:#888">Foro</td><td style="padding:4px 8px">${forumName}</td></tr>
       </table>
       ${message ? `<p style="margin-top:12px"><strong>Mensaje:</strong><br>${message}</p>` : ""}
       <p style="margin-top:20px">Entra al panel de administración para confirmar o ajustar la fecha.</p>`,
      accent
    );

    // Confirmación al solicitante
    const userHtml = emailLayout(
      `<h2 style="margin-top:0">Recibimos tu solicitud</h2>
       <p>Hola ${requesterName}, registramos tu reserva para:</p>
       <p style="font-size:18px;font-weight:700">${topic.title}</p>
       <p>Fecha preferida: <strong>${date} ${time}</strong></p>
       <p>El administrador revisará la disponibilidad y te confirmará por este medio. ¡Gracias!</p>`,
      accent
    );

    // No bloquear la respuesta si el correo falla
    try {
      await Promise.all([
        sendEmail({
          to: settings.contactEmail,
          subject: `Nueva reserva: ${topic.title} — ${forumName}`,
          html: adminHtml,
          replyTo: requesterEmail,
        }),
        sendEmail({
          to: requesterEmail,
          subject: `Recibimos tu solicitud: ${topic.title}`,
          html: userHtml,
        }),
      ]);
    } catch (e) {
      console.error("Error enviando correos de reserva:", e);
    }

    return NextResponse.json({ ok: true, booking });
  } catch (err) {
    console.error("POST /api/bookings", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
