"use client";

import { useRouter } from "next/navigation";

export default function MemberLogout() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/member/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="btn btn-ghost"
      style={{ padding: "8px 14px", fontSize: 14 }}
    >
      Cerrar sesión
    </button>
  );
}
