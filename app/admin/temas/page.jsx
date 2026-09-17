import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/guard";
import { getTopics } from "@/lib/db";
import AdminShell from "../AdminShell";
import TopicsEditor from "./TopicsEditor";

export const dynamic = "force-dynamic";

export default async function TemasPage() {
  if (!isAdmin()) redirect("/admin");
  const topics = await getTopics();
  return (
    <AdminShell active="temas">
      <h1 style={{ marginTop: 0 }}>Temas</h1>
      <p style={{ color: "var(--muted)" }}>
        Crea, edita u oculta los temas que ven los foros. Recuerda guardar.
      </p>
      <TopicsEditor initialTopics={topics} />
    </AdminShell>
  );
}
