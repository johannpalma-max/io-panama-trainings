"use client";

import { useState } from "react";

function blankTopic() {
  return {
    id: "",
    slug: "",
    title: "",
    category: "",
    speaker: "",
    speakerBio: "",
    summary: "",
    description: "",
    durationMin: 90,
    imageUrl: "",
    active: true,
  };
}

export default function TopicsEditor({ initialTopics }) {
  const [topics, setTopics] = useState(initialTopics);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function updateTopic(i, key, value) {
    setTopics((ts) =>
      ts.map((t, idx) => (idx === i ? { ...t, [key]: value } : t))
    );
  }
  function addTopic() {
    setTopics((ts) => [...ts, blankTopic()]);
  }
  function removeTopic(i) {
    if (!confirm("¿Eliminar este tema?")) return;
    setTopics((ts) => ts.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    setNotice("");
    try {
      const res = await fetch("/api/admin/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setTopics(data.topics);
      setNotice("Guardado correctamente.");
    } catch (err) {
      setNotice("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", gap: 10, margin: "16px 0" }}>
        <button className="btn btn-ghost" onClick={addTopic}>
          + Agregar tema
        </button>
        <button className="btn btn-primary" disabled={saving} onClick={save}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
      {notice && (
        <div className={`notice ${notice.startsWith("Error") ? "notice-err" : "notice-ok"}`}>
          {notice}
        </div>
      )}

      {topics.map((t, i) => (
        <div className="panel" key={i} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{t.title || "Nuevo tema"}</strong>
            <label style={{ fontSize: 14, display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={t.active}
                onChange={(e) => updateTopic(i, "active", e.target.checked)}
                style={{ width: "auto" }}
              />
              Visible
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <div className="field" style={{ flex: 2 }}>
              <label>Título</label>
              <input value={t.title} onChange={(e) => updateTopic(i, "title", e.target.value)} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Categoría</label>
              <input value={t.category} onChange={(e) => updateTopic(i, "category", e.target.value)} />
            </div>
            <div className="field" style={{ width: 110 }}>
              <label>Duración (min)</label>
              <input
                type="number"
                value={t.durationMin}
                onChange={(e) => updateTopic(i, "durationMin", e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Facilitador</label>
              <input value={t.speaker} onChange={(e) => updateTopic(i, "speaker", e.target.value)} />
            </div>
            <div className="field" style={{ flex: 2 }}>
              <label>Bio del facilitador</label>
              <input value={t.speakerBio} onChange={(e) => updateTopic(i, "speakerBio", e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Resumen (se muestra en la tarjeta)</label>
            <input value={t.summary} onChange={(e) => updateTopic(i, "summary", e.target.value)} />
          </div>

          <div className="field">
            <label>Descripción completa</label>
            <textarea value={t.description} onChange={(e) => updateTopic(i, "description", e.target.value)} />
          </div>

          <div className="field">
            <label>URL de imagen (opcional)</label>
            <input
              value={t.imageUrl}
              onChange={(e) => updateTopic(i, "imageUrl", e.target.value)}
              placeholder="https://…"
            />
            <div className="hint">
              Pega el enlace de una imagen. Si lo dejas vacío, se usa un fondo con el título.
            </div>
          </div>

          <button
            className="btn btn-ghost"
            style={{ color: "#9b2226" }}
            onClick={() => removeTopic(i)}
          >
            Eliminar tema
          </button>
        </div>
      ))}
    </>
  );
}
