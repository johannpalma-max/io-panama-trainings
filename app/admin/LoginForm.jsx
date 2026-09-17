"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Error");
      }
      router.push("/admin/reservas");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="panel login-card">
      <h2 style={{ marginTop: 0 }}>Administración</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>
        Ingresa con tu usuario y clave.
      </p>
      <form onSubmit={submit}>
        {error && <div className="notice notice-err">{error}</div>}
        <div className="field">
          <label>Usuario</label>
          <input value={user} onChange={(e) => setUser(e.target.value)} required />
        </div>
        <div className="field">
          <label>Clave</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-dark btn-block" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
