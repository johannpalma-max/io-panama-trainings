"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="btn btn-ghost"
      style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", width: "100%" }}
    >
      Cerrar sesión
    </button>
  );
}
