import type { reservations } from "@/db/schema";
import { getGuestById } from "@/lib/repositories/guests";
import { listReservations } from "@/lib/repositories/reservations";
import { listStaysForGuest } from "@/lib/repositories/stays";
import { refreshCompletedStays } from "./stay-status";
import { getFacilityToday } from "./timezone";

type Reservation = typeof reservations.$inferSelect;

export type BriefRow = {
  reservationId: string;
  displayName: string;
  checkInDate: string;
  checkOutDate: string;
  roomLabel: string | null;
  guestResolutionStatus: "unresolved" | "linked";
  isRepeatGuest: boolean;
  guestId: string | null;
  primaryHref: string;
};

export type TodaysBrief = {
  date: string;
  unresolvedCount: number;
  arrivals: BriefRow[];
  departures: BriefRow[];
};

function isRepeatGuest(guestId: string): boolean {
  return listStaysForGuest(guestId).some((s) => s.status === "completed");
}

function toBriefRow(r: Reservation): BriefRow {
  const linked = r.guestResolutionStatus === "linked" && r.guestId;
  const guest = linked ? getGuestById(r.guestId!) : null;
  const displayName = guest?.displayName ?? r.bookerName;
  const guestId = linked ? r.guestId : null;
  const isRepeat = guestId ? isRepeatGuest(guestId) : false;

  return {
    reservationId: r.id,
    displayName,
    checkInDate: r.checkInDate,
    checkOutDate: r.checkOutDate,
    roomLabel: r.roomLabel,
    guestResolutionStatus: r.guestResolutionStatus as "unresolved" | "linked",
    isRepeatGuest: isRepeat,
    guestId,
    primaryHref: guestId ? `/guests/${guestId}` : `/resolution/${r.id}`,
  };
}

function sortByName(rows: BriefRow[]): BriefRow[] {
  return [...rows].sort((a, b) =>
    a.displayName.localeCompare(b.displayName, "ja"),
  );
}

export function buildTodaysBrief(today = getFacilityToday()): TodaysBrief {
  refreshCompletedStays(today);

  const all = listReservations();
  const arrivals = sortByName(
    all.filter((r) => r.checkInDate === today).map(toBriefRow),
  );
  const departures = sortByName(
    all.filter((r) => r.checkOutDate === today).map(toBriefRow),
  );
  const unresolvedCount = all.filter(
    (r) => r.guestResolutionStatus === "unresolved",
  ).length;

  return {
    date: today,
    unresolvedCount,
    arrivals,
    departures,
  };
}
