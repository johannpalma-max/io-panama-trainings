"use client";

import { useState } from "react";

export default function BookingForm({ topic, member }) {
  const [form, setForm] = useState({
    forumName: "",
    date: "",
    time: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, topicSlug: topic.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo enviar la solicitud");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "ok") {
    return (
      <div className="notice notice-ok">
        ¡Solicitud enviada! Quedó registrada en{" "}
        <a href="/mis-trainings" style={{ fontWeight: 700 }}>Mis Trainings</a> y
        el administrador la confirmará por correo.
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={submit}>
      {status === "error" && <div className="notice notice-err">{error}</div>}

      <div
        style={{
          fontSize: 13,
          color: "var(--muted)",
          background: "#f4f4fb",
          padding: "8px 12px",
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        Reservando como <strong>{member.name || member.email}</strong>
        {member.name ? ` · ${member.email}` : ""}
      </div>

      <div className="field">
        <label>Foro</label>
        <input
          required
          value={form.forumName}
          onChange={(e) => update("forumName", e.target.value)}
          placeholder="Nombre de tu foro"
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Fecha preferida</label>
          <input
            required
            type="date"
            min={today}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Hora</label>
          <input
            required
            type="time"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label>Mensaje (opcional)</label>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Cualquier detalle adicional para el administrador"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Enviando…" : "Enviar solicitud de reserva"}
      </button>
    </form>
  );
}
