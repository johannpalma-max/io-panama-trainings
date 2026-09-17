"use client";

import { useState } from "react";

export default function AccessForm({ initialError }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(
    initialError === "expirado"
      ? "Ese enlace caducó o no es válido. Pide uno nuevo."
      : ""
  );

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "sent") {
    return (
      <div className="panel login-card">
        <h2 style={{ marginTop: 0 }}>Revisa tu correo</h2>
        <div className="notice notice-ok">
          Te enviamos un enlace de acceso a <strong>{email}</strong>. Ábrelo
          para entrar (caduca en 30 minutos).
        </div>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          ¿No llegó? Revisa spam o{" "}
          <button
            className="btn btn-ghost"
            style={{ padding: "2px 8px", fontSize: 14 }}
            onClick={() => setStatus("idle")}
          >
            inténtalo de nuevo
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="panel login-card">
      <h2 style={{ marginTop: 0 }}>Acceso para miembros</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>
        Escribe tu correo y te enviamos un enlace para entrar. Sin contraseñas.
      </p>
      <form onSubmit={submit}>
        {error && <div className="notice notice-err">{error}</div>}
        <div className="field">
          <label>Nombre</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre y apellido"
          />
        </div>
        <div className="field">
          <label>Correo</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>
        <button className="btn btn-primary btn-block" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : "Enviar enlace de acceso"}
        </button>
      </form>
    </div>
  );
}
