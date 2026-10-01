import { closeDb } from "../src/db/client";
import { buildTodaysBrief } from "../src/lib/brief/today";
import { getFacilityToday } from "../src/lib/brief/timezone";
import { importCanonicalRows } from "../src/lib/import/run-import";
import { validateCanonicalFields } from "../src/lib/import/validate";
import { resolveWithNewGuest } from "../src/lib/resolution/resolve";
import { getReservationByExternalId } from "../src/lib/repositories/reservations";

function main() {
  const today = getFacilityToday();
  const ext = `BK-BRIEF-${Date.now()}`;
  const raw = {
    external_reservation_id: ext,
    guest_name: "Brief テスト",
    check_in: today,
    check_out: today.replace(/(\d+)$/, (d) => String(Number(d) + 2).padStart(2, "0")),
    email: `brief-${Date.now()}@example.com`,
    phone: "",
    guest_name_kana: "",
    guest_count: "",
    room: "101",
    source: "",
    booked_at: "",
    notes: "",
  };
  const v = validateCanonicalFields(raw);
  if (!v.ok) throw new Error(v.message);
  importCanonicalRows([raw], "manual");
  const reservation = getReservationByExternalId(ext);
  if (!reservation) throw new Error("no reservation");

  let brief = buildTodaysBrief(today);
  const foundUnresolved = brief.arrivals.some(
    (a) => a.reservationId === reservation.id,
  );
  if (!foundUnresolved) throw new Error("arrival not on brief");

  resolveWithNewGuest(reservation.id);
  brief = buildTodaysBrief(today);
  const foundLinked = brief.arrivals.find((a) => a.reservationId === reservation.id);
  if (!foundLinked?.guestId) throw new Error("linked arrival missing guest");
  if (foundLinked.guestResolutionStatus !== "linked") {
    throw new Error("should be linked");
  }

  console.log("verify-brief: ok");
  closeDb();
}

main();
