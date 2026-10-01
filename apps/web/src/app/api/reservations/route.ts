import { listReservations } from "@/lib/repositories/reservations";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = listReservations().map((r) => ({
    id: r.id,
    externalReservationId: r.externalReservationId,
    bookerName: r.bookerName,
    checkInDate: r.checkInDate,
    checkOutDate: r.checkOutDate,
    guestResolutionStatus: r.guestResolutionStatus,
    importSource: r.importSource,
    importedAt: r.importedAt,
  }));
  return Response.json({ reservations: rows });
}
