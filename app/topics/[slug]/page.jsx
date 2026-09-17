import Link from "next/link";
import { notFound } from "next/navigation";
import { getSettings, getTopicBySlug, getMember } from "@/lib/db";
import { getMemberSession } from "@/lib/guard";
import { Header, Footer, initials } from "../../components";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

export default async function TopicPage({ params }) {
  const [settings, topic] = await Promise.all([
    getSettings(),
    getTopicBySlug(params.slug),
  ]);

  if (!topic) notFound();

  const session = getMemberSession();
  const member = session ? await getMember(session.email) : null;

  return (
    <>
      <Header settings={settings} member={session} />

      <section className="detail-hero">
        <div className="container">
          <Link href="/" className="back-link">
            ← Volver a los temas
          </Link>
          <span className="tag" style={{ marginLeft: 0, marginTop: 16, display: "inline-block" }}>
            {topic.category}
          </span>
          <h1 style={{ margin: "12px 0 0", fontSize: 34 }}>{topic.title}</h1>
        </div>
      </section>

      <div className="container">
        <div className="detail-grid">
          {/* Columna izquierda: descripción */}
          <div>
            <div className="panel">
              <h2 style={{ marginTop: 0 }}>De qué se trata</h2>
              <p style={{ color: "var(--muted)" }}>{topic.description}</p>

              <div className="speaker">
                <div className="avatar">{initials(topic.speaker)}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{topic.speaker}</div>
                  <div style={{ color: "var(--muted)", fontSize: 14 }}>
                    {topic.speakerBio}
                  </div>
                </div>
              </div>

              <div className="meta" style={{ marginTop: 8 }}>
                <span>⏱ Duración: {topic.durationMin} min</span>
              </div>
            </div>
          </div>

          {/* Columna derecha: reserva */}
          <div>
            <div className="panel">
              <h2 style={{ marginTop: 0 }}>Reservar esta sesión</h2>
              {session ? (
                <>
                  <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>
                    Elige la fecha y hora preferida para tu foro. El
                    administrador revisará la solicitud y la confirmará por
                    correo.
                  </p>
                  <BookingForm
                    topic={topic}
                    member={{
                      email: session.email,
                      name: (member && member.name) || "",
                    }}
                  />
                </>
              ) : (
                <>
                  <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>
                    Para reservar necesitas identificarte como miembro. Es
                    rápido: te enviamos un enlace de acceso por correo, sin
                    contraseñas.
                  </p>
                  <Link href="/acceso" className="btn btn-primary btn-block">
                    Iniciar sesión para reservar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} />
    </>
  );
}
