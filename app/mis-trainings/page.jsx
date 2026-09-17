import Link from "next/link";
import { redirect } from "next/navigation";
import { getSettings, getMember, getBookingsByEmail } from "@/lib/db";
import { getMemberSession } from "@/lib/guard";
import { Header, Footer } from "../components";
import MemberLogout from "./MemberLogout";

export const dynamic = "force-dynamic";

const GROUPS = [
  { key: "pending", title: "Pendientes de confirmar", badge: "badge-pending", empty: "No tienes solicitudes pendientes." },
  { key: "confirmed", title: "Confirmados (próximos)", badge: "badge-confirmed", empty: "No tienes trainings confirmados." },
  { key: "done", title: "Ya tomados", badge: "badge-done", empty: "Aún no has tomado ningún training." },
  { key: "cancelled", title: "Cancelados", badge: "badge-cancelled", empty: null },
];

const STATUS_LABEL = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  done: "Tomado",
  cancelled: "Cancelado",
};

export default async function MisTrainingsPage() {
  const session = getMemberSession();
  if (!session) redirect("/acceso");

  const [settings, member, bookings] = await Promise.all([
    getSettings(),
    getMember(session.email),
    getBookingsByEmail(session.email),
  ]);

  const name = (member && member.name) || session.email;

  return (
    <>
      <Header settings={settings} member={session} />

      <section className="detail-hero" style={{ paddingBottom: 28 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="back-link" style={{ marginBottom: 6 }}>Mis Trainings</div>
              <h1 style={{ margin: 0, fontSize: 30 }}>Hola, {name}</h1>
              <p style={{ margin: "6px 0 0", opacity: 0.85 }}>{session.email}</p>
            </div>
            <MemberLogout />
          </div>
        </div>
      </section>

      <div className="container section" style={{ paddingTop: 32 }}>
        <Link href="/" className="btn btn-primary" style={{ marginBottom: 28 }}>
          + Reservar un nuevo training
        </Link>

        {GROUPS.map((g) => {
          const items = bookings.filter((b) => b.status === g.key);
          if (items.length === 0 && g.empty === null) return null;
          return (
            <div key={g.key} style={{ marginBottom: 32 }}>
              <h2 className="section-title" style={{ fontSize: 22, marginBottom: 16 }}>
                {g.title}{" "}
                <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 16 }}>
                  ({items.length})
                </span>
              </h2>
              {items.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>{g.empty}</p>
              ) : (
                <div className="grid">
                  {items.map((b) => (
                    <div className="card" key={b.id}>
                      <div className="card-body">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className={`badge ${g.badge}`}>{STATUS_LABEL[b.status]}</span>
                          <span style={{ color: "var(--muted)", fontSize: 13 }}>{b.forumName}</span>
                        </div>
                        <h3 style={{ marginTop: 6 }}>{b.topicTitle}</h3>
                        <div className="meta">
                          <span>📅 {b.date}</span>
                          <span>🕐 {b.time}</span>
                        </div>
                        <div style={{ color: "var(--muted)", fontSize: 13 }}>🎤 {b.speaker}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Footer settings={settings} />
    </>
  );
}
