"use client";

import { useState } from "react";

const STATUS_LABEL = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  done: "Impartida",
  cancelled: "Cancelada",
};
const STATUS_BADGE = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  done: "badge-done",
  cancelled: "badge-cancelled",
};

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "confirmed", label: "Confirmadas" },
  { key: "done", label: "Impartidas" },
];

export default function BookingsManager({ initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState("all");
  const [inviteFor, setInviteFor] = useState(null);
  const [busy, setBusy] = useState(null);

  async function patch(id, body) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setBookings((bs) => bs.map((b) => (b.id === id ? data.booking : b)));
      } else {
        alert(data.error || "Error");
      }
    } finally {
      setBusy(null);
    }
  }

  const visible =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <>
      <div style={{ display: "flex", gap: 8, margin: "16px 0 20px", flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`btn ${filter === f.key ? "btn-dark" : "btn-ghost"}`}
            style={{ padding: "8px 14px", fontSize: 14 }}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No hay reservas en esta vista.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tema</th>
              <th>Foro / Solicitante</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => (
              <tr key={b.id}>
                <td>
                  <strong>{b.topicTitle}</strong>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    🎤 {b.speaker}
                  </div>
                </td>
                <td>
                  {b.forumName}
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {b.requesterName} · {b.requesterEmail}
                  </div>
                </td>
                <td>
                  {b.date}
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>{b.time}</div>
                </td>
                <td>
                  <span className={`badge ${STATUS_BADGE[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    {b.status === "pending" && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: "7px 12px", fontSize: 13 }}
                        disabled={busy === b.id}
                        onClick={() => patch(b.id, { status: "confirmed" })}
                      >
                        Confirmar
                      </button>
                    )}
                    {b.status === "confirmed" && (
                      <>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: "7px 12px", fontSize: 13 }}
                          disabled={busy === b.id}
                          onClick={() => patch(b.id, { status: "done" })}
                        >
                          Marcar impartida
                        </button>
                        <button
                          className="btn btn-dark"
                          style={{ padding: "7px 12px", fontSize: 13 }}
                          onClick={() => setInviteFor(b)}
                        >
                          Invitar personas
                        </button>
                      </>
                    )}
                    {b.status !== "cancelled" && b.status !== "done" && (
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "7px 12px", fontSize: 13 }}
                        disabled={busy === b.id}
                        onClick={() => {
                          if (confirm("¿Cancelar esta reserva?"))
                            patch(b.id, { status: "cancelled" });
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                  {b.attendees && b.attendees.length > 0 && (
                    <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>
                      Invitados: {b.attendees.join(", ")}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {inviteFor && (
        <InviteModal
          booking={inviteFor}
          onClose={() => setInviteFor(null)}
          onDone={(updated) => {
            setBookings((bs) => bs.map((b) => (b.id === updated.id ? updated : b)));
            setInviteFor(null);
          }}
        />
      )}
    </>
  );
}

function InviteModal({ booking, onClose, onDone }) {
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, emails }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      onDone(data.booking);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        padding: 20,
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        className="panel"
        style={{ maxWidth: 480, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Invitar personas</h3>
        <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>
          {booking.topicTitle} · {booking.date} {booking.time}. Se enviará una
          invitación con archivo de calendario a cada correo.
        </p>
        {error && <div className="notice notice-err">{error}</div>}
        <div className="field">
          <label>Correos (separados por coma)</label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="ana@foro.com, luis@foro.com"
          />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" disabled={loading} onClick={send}>
            {loading ? "Enviando…" : "Enviar invitaciones"}
          </button>
        </div>
      </div>
    </div>
  );
}
