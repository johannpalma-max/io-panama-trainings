import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/guard";
import { getBookings } from "@/lib/db";
import AdminShell from "../AdminShell";
import BookingsManager from "./BookingsManager";

export const dynamic = "force-dynamic";

export default async function ReservasPage() {
  if (!isAdmin()) redirect("/admin");
  const bookings = await getBookings();
  return (
    <AdminShell active="reservas">
      <h1 style={{ marginTop: 0 }}>Reservas</h1>
      <p style={{ color: "var(--muted)" }}>
        Solicitudes de los foros: pendientes, confirmadas y ya impartidas.
      </p>
      <BookingsManager initialBookings={bookings} />
    </AdminShell>
  );
}
