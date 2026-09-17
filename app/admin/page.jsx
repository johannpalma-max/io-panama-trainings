import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/guard";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function AdminHome() {
  if (isAdmin()) redirect("/admin/reservas");
  return (
    <div className="container">
      <LoginForm />
    </div>
  );
}
