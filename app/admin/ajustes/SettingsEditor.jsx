"use client";

import { useState } from "react";

const FIELDS = [
  { key: "orgName", label: "Nombre de la organización", type: "text" },
  { key: "tagline", label: "Tagline (sobre el título)", type: "text" },
  { key: "heroTitle", label: "Título principal", type: "text" },
  { key: "heroSubtitle", label: "Subtítulo principal", type: "textarea" },
  { key: "aboutTitle", label: "Título de la sección '¿Qué es?'", type: "text" },
  { key: "aboutText", label: "Texto de la sección '¿Qué es?'", type: "textarea" },
  { key: "contactEmail", label: "Correo donde llegan las solicitudes", type: "text" },
  { key: "logoUrl", label: "URL del logo (opcional)", type: "text" },
  { key: "footerText", label: "Texto del pie de página", type: "text" },
];

const COLORS = [
  { key: "brandPrimary", label: "Color primario" },
  { key: "brandAccent", label: "Color de acento" },
  { key: "brandBg", label: "Color de fondo" },
];

export default function SettingsEditor({ initialSettings }) {
  const [s, setS] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function update(key, value) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setNotice("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setNotice("Guardado. Recarga el sitio para ver los cambios.");
    } catch (err) {
      setNotice("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 680 }}>
      {notice && (
        <div className={`notice ${notice.startsWith("Error") ? "notice-err" : "notice-ok"}`}>
          {notice}
        </div>
      )}

      {FIELDS.map((f) => (
        <div className="field" key={f.key}>
          <label>{f.label}</label>
          {f.type === "textarea" ? (
            <textarea value={s[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} />
          ) : (
            <input value={s[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} />
          )}
        </div>
      ))}

      <h3>Colores de marca</h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {COLORS.map((c) => (
          <div className="field" key={c.key}>
            <label>{c.label}</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                value={s[c.key] || "#000000"}
                onChange={(e) => update(c.key, e.target.value)}
                style={{ width: 48, height: 40, padding: 2 }}
              />
              <input
                value={s[c.key] || ""}
                onChange={(e) => update(c.key, e.target.value)}
                style={{ width: 110 }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" disabled={saving} onClick={save} style={{ marginTop: 12 }}>
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
