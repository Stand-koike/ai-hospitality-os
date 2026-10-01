import { getReservationById } from "@/lib/repositories/reservations";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const r = getReservationById(id);
  if (!r) {
    return Response.json({ error: "予約が見つかりません" }, { status: 404 });
  }
  return Response.json({ reservation: r });
}
