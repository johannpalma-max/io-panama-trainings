import { redirect } from "next/navigation";
import { getSettings } from "@/lib/db";
import { getMemberSession } from "@/lib/guard";
import { Header, Footer } from "../components";
import AccessForm from "./AccessForm";

export const dynamic = "force-dynamic";

export default async function AccesoPage({ searchParams }) {
  if (getMemberSession()) redirect("/mis-trainings");
  const settings = await getSettings();
  return (
    <>
      <Header settings={settings} />
      <div className="container" style={{ minHeight: "60vh" }}>
        <AccessForm initialError={searchParams?.error} />
      </div>
      <Footer settings={settings} />
    </>
  );
}
