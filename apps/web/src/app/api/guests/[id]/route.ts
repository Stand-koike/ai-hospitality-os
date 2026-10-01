import { getGuestById } from "@/lib/repositories/guests";
import { listReservations } from "@/lib/repositories/reservations";
import { listStaysForGuest } from "@/lib/repositories/stays";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const guest = getGuestById(id);
  if (!guest) {
    return Response.json({ error: "Guest が見つかりません" }, { status: 404 });
  }
  const reservations = listReservations().filter((r) => r.guestId === id);
  const stays = listStaysForGuest(id);
  return Response.json({ guest, reservations, stays });
}
