import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/guard";
import { getSettings } from "@/lib/db";
import AdminShell from "../AdminShell";
import SettingsEditor from "./SettingsEditor";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  if (!isAdmin()) redirect("/admin");
  const settings = await getSettings();
  return (
    <AdminShell active="ajustes">
      <h1 style={{ marginTop: 0 }}>Ajustes y marca</h1>
      <p style={{ color: "var(--muted)" }}>
        Edita los textos de la página, los colores y el correo donde llegan las
        solicitudes.
      </p>
      <SettingsEditor initialSettings={settings} />
    </AdminShell>
  );
}
