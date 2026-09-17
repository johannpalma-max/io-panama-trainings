// Genera un archivo de calendario (.ics) y un enlace a Google Calendar
// para una reserva confirmada.

function toICSDate(date, time) {
  // date: YYYY-MM-DD, time: HH:MM -> YYYYMMDDTHHMMSS (hora local, sin Z)
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

function addMinutes(date, time, minutes) {
  const dt = new Date(`${date}T${time}:00`);
  dt.setMinutes(dt.getMinutes() + (minutes || 60));
  const p = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}${p(dt.getMonth() + 1)}${p(dt.getDate())}T${p(
    dt.getHours()
  )}${p(dt.getMinutes())}00`;
}

export function buildICS({ title, description, date, time, durationMin, organizerEmail }) {
  const start = toICSDate(date, time);
  const end = addMinutes(date, time, durationMin);
  const uid = `${Date.now()}@io-panama`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EO Panama//Trainings//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description || "")}`,
    organizerEmail ? `ORGANIZER:mailto:${organizerEmail}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function escapeICS(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

export function googleCalLink({ title, description, date, time, durationMin }) {
  const start = toICSDate(date, time);
  const end = addMinutes(date, time, durationMin);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description || "",
    dates: `${start}/${end}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
