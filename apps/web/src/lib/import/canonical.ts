import type { ImportSource } from "@/db/schema";

/** Canonical Import Schema column names (CSV header). */
export const CANONICAL_HEADERS = [
  "external_reservation_id",
  "guest_name",
  "check_in",
  "check_out",
  "email",
  "phone",
  "guest_name_kana",
  "guest_count",
  "room",
  "source",
  "booked_at",
  "notes",
] as const;

export type CanonicalHeader = (typeof CANONICAL_HEADERS)[number];

export type CanonicalRow = Record<CanonicalHeader, string>;

export type ParsedReservationRow = {
  externalReservationId: string;
  bookerName: string;
  checkInDate: string;
  checkOutDate: string;
  contactEmail: string | null;
  contactPhone: string | null;
  guestNameKana: string | null;
  guestCount: number | null;
  roomLabel: string | null;
  source: string | null;
  bookedAt: string | null;
  notes: string | null;
};

export type ImportContext = {
  importSource: ImportSource;
  importBatchId: string;
};
