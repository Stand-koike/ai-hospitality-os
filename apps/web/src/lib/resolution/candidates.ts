import type { reservations } from "@/db/schema";
import { listGuests } from "@/lib/repositories/guests";
import { listStaysForGuest } from "@/lib/repositories/stays";
import { levenshtein } from "./levenshtein";
import { normalizePhone } from "./phone";

type Reservation = typeof reservations.$inferSelect;

export type CandidateReason =
  | "email_match"
  | "phone_match"
  | "name_exact"
  | "kana_exact"
  | "name_similar";

export type ResolutionCandidate = {
  guestId: string;
  displayName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  completedStayCount: number;
  lastStayCheckOut: string | null;
  score: number;
  reasons: CandidateReason[];
};

const REASON_LABELS: Record<CandidateReason, string> = {
  email_match: "メール一致",
  phone_match: "電話一致",
  name_exact: "氏名一致",
  kana_exact: "かな一致",
  name_similar: "氏名類似",
};

export function reasonLabel(reason: CandidateReason): string {
  return REASON_LABELS[reason];
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function findCandidates(
  reservation: Reservation,
  limit = 10,
): ResolutionCandidate[] {
  const allGuests = listGuests();
  const resEmail = (reservation.contactEmail ?? "").trim().toLowerCase();
  const resPhone = normalizePhone(reservation.contactPhone);
  const resName = normalizeName(reservation.bookerName);
  const resKana = normalizeName(reservation.guestNameKana ?? "");

  const scored: ResolutionCandidate[] = [];

  for (const guest of allGuests) {
    const reasons: CandidateReason[] = [];
    let score = 0;

    const gEmail = (guest.contactEmail ?? "").trim().toLowerCase();
    const gPhone = normalizePhone(guest.contactPhone);
    const gName = normalizeName(guest.displayName);

    if (resEmail && gEmail && resEmail === gEmail) {
      reasons.push("email_match");
      score += 100;
    }
    if (resPhone && gPhone && resPhone === gPhone) {
      reasons.push("phone_match");
      score += 100;
    }
    if (resName && gName && resName === gName) {
      reasons.push("name_exact");
      score += 50;
    }
    if (resKana && gName && resKana === gName) {
      reasons.push("kana_exact");
      score += 40;
    }
    if (resName && gName && resName !== gName) {
      const dist = levenshtein(resName, gName);
      if (dist > 0 && dist <= 2 && resName.length >= 2) {
        reasons.push("name_similar");
        score += 25 - dist * 5;
      }
    }

    if (score <= 0) continue;

    const stays = listStaysForGuest(guest.id);
    const completed = stays.filter((s) => s.status === "completed");
    const lastCompleted = completed
      .map((s) => s.checkOutDate)
      .sort()
      .at(-1);

    scored.push({
      guestId: guest.id,
      displayName: guest.displayName,
      contactEmail: guest.contactEmail,
      contactPhone: guest.contactPhone,
      completedStayCount: completed.length,
      lastStayCheckOut: lastCompleted ?? null,
      score,
      reasons,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
