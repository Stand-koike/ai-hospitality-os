import { listUnresolvedReservations } from "@/lib/repositories/reservations";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = listUnresolvedReservations().map((r) => ({
    id: r.id,
    externalReservationId: r.externalReservationId,
    bookerName: r.bookerName,
    checkInDate: r.checkInDate,
    checkOutDate: r.checkOutDate,
    contactEmail: r.contactEmail,
    contactPhone: r.contactPhone,
    roomLabel: r.roomLabel,
  }));
  return Response.json({ reservations: rows });
}
