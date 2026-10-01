import { findCandidates, reasonLabel } from "@/lib/resolution/candidates";
import { getReservationById } from "@/lib/repositories/reservations";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const reservation = getReservationById(id);
  if (!reservation) {
    return Response.json({ error: "予約が見つかりません" }, { status: 404 });
  }
  if (reservation.guestResolutionStatus === "linked") {
    return Response.json({ error: "すでに紐付け済みです" }, { status: 400 });
  }
  const candidates = findCandidates(reservation).map((c) => ({
    ...c,
    reasonLabels: c.reasons.map(reasonLabel),
  }));
  return Response.json({ candidates });
}
