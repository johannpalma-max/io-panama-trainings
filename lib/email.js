// Envío de correos vía Resend (REST). Si no hay RESEND_API_KEY configurada,
// solo registra en consola para no romper el flujo en desarrollo.

const API_KEY = process.env.RESEND_API_KEY;
// Mientras no verifiques tu dominio en Resend, usa el remitente de pruebas.
const FROM = process.env.EMAIL_FROM || "EO Panamá <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, replyTo, attachments }) {
  if (!API_KEY) {
    console.log("[email:mock] Para:", to, "Asunto:", subject);
    return { mock: true };
  }
  const body = {
    from: FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };
  if (replyTo) body.reply_to = replyTo;
  if (attachments && attachments.length) body.attachments = attachments;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[email] Error Resend:", res.status, text);
    throw new Error(`Resend ${res.status}: ${text}`);
  }
  return res.json();
}

// Plantilla simple y consistente con la marca.
export function emailLayout(inner, accent = "#0B1F3A") {
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f7f5f0;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
      <div style="background:${accent};color:#fff;padding:20px 24px;font-size:18px;font-weight:600;">EO Panamá · Trainings</div>
      <div style="padding:24px;color:#1a1a1a;font-size:15px;line-height:1.6;">${inner}</div>
      <div style="padding:16px 24px;color:#888;font-size:12px;border-top:1px solid #eee;">Este es un correo automático del sistema de reservas de trainings.</div>
    </div>
  </div>`;
}
