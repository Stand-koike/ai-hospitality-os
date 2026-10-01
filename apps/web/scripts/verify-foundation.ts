import { closeDb } from "../src/db/client";
import { createGuest } from "../src/lib/repositories/guests";
import { createReservation } from "../src/lib/repositories/reservations";
import { createStay } from "../src/lib/repositories/stays";
import { createTimelineEntry } from "../src/lib/repositories/timeline";

async function main() {
  const guest = createGuest({
    displayName: "山田 太郎",
    contactEmail: "guest@example.com",
  });
  const reservation = createReservation({
    externalReservationId: `verify-${Date.now()}`,
    bookerName: "山田 太郎",
    checkInDate: "2026-10-01",
    checkOutDate: "2026-10-03",
    contactEmail: "guest@example.com",
    importSource: "manual",
    guestResolutionStatus: "linked",
    guestId: guest.id,
  });
  const stay = createStay({
    guestId: guest.id,
    reservationId: reservation.id,
    checkInDate: reservation.checkInDate,
    checkOutDate: reservation.checkOutDate,
  });
  const entry = createTimelineEntry({
    guestId: guest.id,
    body: "Foundation verify: 短文メモ",
    relatedReservationId: reservation.id,
  });
  console.log(
    JSON.stringify({ guest: guest.id, reservation: reservation.id, stay: stay.id, entry: entry.id }),
  );
  closeDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
