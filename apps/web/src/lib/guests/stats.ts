import { listGuests } from "@/lib/repositories/guests";
import { listReservations } from "@/lib/repositories/reservations";
import { listStaysForGuest } from "@/lib/repositories/stays";

export type GuestListItem = {
  id: string;
  displayName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
  linkedReservationCount: number;
  completedStayCount: number;
};

export function listGuestsWithStats(): GuestListItem[] {
  const guests = listGuests();
  const reservations = listReservations();

  return guests
    .map((g) => {
      const linkedReservationCount = reservations.filter(
        (r) => r.guestId === g.id,
      ).length;
      const completedStayCount = listStaysForGuest(g.id).filter(
        (s) => s.status === "completed",
      ).length;
      return {
        id: g.id,
        displayName: g.displayName,
        contactEmail: g.contactEmail,
        contactPhone: g.contactPhone,
        createdAt: g.createdAt,
        linkedReservationCount,
        completedStayCount,
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "ja"));
}
