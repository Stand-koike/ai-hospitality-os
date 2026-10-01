import { importCanonicalRows } from "../src/lib/import/run-import";
import { validateCanonicalFields } from "../src/lib/import/validate";
import { closeDb } from "../src/db/client";
import { findCandidates } from "../src/lib/resolution/candidates";
import { resolveToExistingGuest, resolveWithNewGuest } from "../src/lib/resolution/resolve";
import { getGuestById } from "../src/lib/repositories/guests";
import { getReservationByExternalId } from "../src/lib/repositories/reservations";
import { getStayByReservationId } from "../src/lib/repositories/stays";

function main() {
  const ext = `BK-RES-${Date.now()}`;
  const raw = {
    external_reservation_id: ext,
    guest_name: "佐藤 花子",
    check_in: "2026-11-01",
    check_out: "2026-11-03",
    email: "sato@example.com",
    phone: "080-1111-2222",
    guest_name_kana: "",
    guest_count: "",
    room: "",
    source: "",
    booked_at: "",
    notes: "",
  };
  const v = validateCanonicalFields(raw);
  if (!v.ok) throw new Error(v.message);
  importCanonicalRows([raw], "manual");
  const reservation = getReservationByExternalId(ext);
  if (!reservation) throw new Error("reservation missing");

  const created = resolveWithNewGuest(reservation.id);
  const guest = getGuestById(created.guestId);
  if (!guest) throw new Error("guest missing");
  const stay = getStayByReservationId(reservation.id);
  if (!stay || stay.guestId !== guest.id) throw new Error("stay missing");

  const ext2 = `BK-RES2-${Date.now()}`;
  const raw2 = { ...raw, external_reservation_id: ext2 };
  importCanonicalRows([raw2], "manual");
  const reservation2 = getReservationByExternalId(ext2);
  if (!reservation2) throw new Error("reservation2 missing");
  const candidates = findCandidates(reservation2);
  if (!candidates.some((c) => c.guestId === guest.id)) {
    throw new Error("expected email match candidate");
  }
  resolveToExistingGuest(reservation2.id, guest.id);
  const linked = getReservationByExternalId(ext2);
  if (linked?.guestResolutionStatus !== "linked" || linked.guestId !== guest.id) {
    throw new Error("link failed");
  }

  console.log("verify-resolution: ok");
  closeDb();
}

main();
