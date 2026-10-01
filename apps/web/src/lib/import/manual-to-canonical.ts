import type { CanonicalHeader } from "./canonical";

export type ManualReservationInput = {
  externalReservationId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  email?: string;
  phone?: string;
  guestNameKana?: string;
  guestCount?: string;
  room?: string;
  source?: string;
  bookedAt?: string;
  notes?: string;
};

export function manualToCanonicalRow(
  input: ManualReservationInput,
): Record<CanonicalHeader, string> {
  return {
    external_reservation_id: input.externalReservationId,
    guest_name: input.guestName,
    check_in: input.checkIn,
    check_out: input.checkOut,
    email: input.email ?? "",
    phone: input.phone ?? "",
    guest_name_kana: input.guestNameKana ?? "",
    guest_count: input.guestCount ?? "",
    room: input.room ?? "",
    source: input.source ?? "",
    booked_at: input.bookedAt ?? "",
    notes: input.notes ?? "",
  };
}
