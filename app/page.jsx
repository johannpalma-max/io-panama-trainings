import Link from "next/link";
import { getSettings, getTopics } from "@/lib/db";
import { getMemberSession } from "@/lib/guard";
import { Header, Footer } from "./components";

export const dynamic = "force-dynamic";
// Force rebuild

export default async function HomePage() {
  const [settings, topics] = await Promise.all([getSettings(), getTopics()]);
  const member = getMemberSession();
  const active = topics.filter((t) => t.active);

  return (
    <>
      <Header settings={settings} member={member} />

      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="container">
          <div className="eyebrow">{settings.tagline}</div>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">{settings.aboutTitle}</h2>
          <p className="section-sub">{settings.aboutText}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">Temas disponibles</h2>
          <p className="section-sub">
            Toca un tema para ver la descripción completa, conocer al facilitador
            y reservar la sesión para tu foro.
          </p>

          {active.length === 0 ? (
            <p className="section-sub">Aún no hay temas publicados.</p>
          ) : (
            <div className="grid">
              {active.map((t) => (
                <Link key={t.id} href={`/topics/${t.slug}`} className="card">
                  {t.imageUrl ? (
                    <img className="card-img" src={t.imageUrl} alt={t.title} />
                  ) : (
                    <div className="card-img">{t.title}</div>
                  )}
                  <div className="card-body">
                    <span className="tag">{t.category}</span>
                    <h3>{t.title}</h3>
                    <p className="summary">{t.summary}</p>
                    <div className="meta">
                      <span>🎤 {t.speaker}</span>
                      <span>⏱ {t.durationMin} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
