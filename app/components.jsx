import Link from "next/link";

export function Header({ settings, member }) {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">
            {settings.logoUrl ? (
              <>
                <img src={settings.logoUrl} alt={settings.orgName} />
                <span className="brand-title">Panamá</span>
              </>
            ) : (
              <>
                <span className="dot">EO</span>
                <span>{settings.orgName}</span>
              </>
            )}
          </Link>
          <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {member ? (
              <Link href="/mis-trainings" className="nav-link">
                Mis Trainings
              </Link>
            ) : (
              <Link href="/acceso" className="nav-link">
                Acceso miembros
              </Link>
            )}
            <Link href="/admin" className="nav-link" style={{ opacity: 0.55 }}>
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <div className="eo-spectrum" />
    </>
  );
}

export function Footer({ settings }) {
  return (
    <footer className="site-footer">
      <div className="container">{settings.footerText}</div>
    </footer>
  );
}

export function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
