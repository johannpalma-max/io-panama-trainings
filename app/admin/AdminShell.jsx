import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminShell({ active, children }) {
  const links = [
    { href: "/admin/reservas", label: "Reservas", key: "reservas" },
    { href: "/admin/temas", label: "Temas", key: "temas" },
    { href: "/admin/ajustes", label: "Ajustes y marca", key: "ajustes" },
  ];
  return (
    <div className="admin-wrap">
      <aside className="admin-side">
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
          EO Panamá · Admin
        </div>
        {links.map((l) => (
          <Link
            key={l.key}
            href={l.href}
            className={active === l.key ? "active" : ""}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" className="" style={{ marginTop: 12, display: "block" }}>
          ← Ver sitio
        </Link>
        <div style={{ marginTop: 20 }}>
          <LogoutButton />
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
