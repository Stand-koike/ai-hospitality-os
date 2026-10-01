import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { reservations, type ImportSource, type ResolutionStatus } from "@/db/schema";
import { newId } from "@/lib/ids";
import { nowIso } from "@/lib/time";

export type NewReservationInput = {
  externalReservationId: string;
  bookerName: string;
  checkInDate: string;
  checkOutDate: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  guestNameKana?: string | null;
  guestCount?: number | null;
  roomLabel?: string | null;
  source?: string | null;
  bookedAt?: string | null;
  notes?: string | null;
  importSource: ImportSource;
  importBatchId?: string | null;
  guestResolutionStatus?: ResolutionStatus;
  guestId?: string | null;
};

export function createReservation(input: NewReservationInput) {
  const db = getDb();
  const row = {
    id: newId(),
    externalReservationId: input.externalReservationId,
    bookerName: input.bookerName,
    checkInDate: input.checkInDate,
    checkOutDate: input.checkOutDate,
    contactEmail: input.contactEmail ?? null,
    contactPhone: input.contactPhone ?? null,
    guestNameKana: input.guestNameKana ?? null,
    guestCount: input.guestCount ?? null,
    roomLabel: input.roomLabel ?? null,
    source: input.source ?? null,
    bookedAt: input.bookedAt ?? null,
    notes: input.notes ?? null,
    importSource: input.importSource,
    importedAt: nowIso(),
    importBatchId: input.importBatchId ?? null,
    guestResolutionStatus: input.guestResolutionStatus ?? "unresolved",
    guestId: input.guestId ?? null,
  };
  db.insert(reservations).values(row).run();
  return row;
}

export function getReservationById(id: string) {
  const db = getDb();
  return db.select().from(reservations).where(eq(reservations.id, id)).get();
}

export function getReservationByExternalId(externalReservationId: string) {
  const db = getDb();
  return db
    .select()
    .from(reservations)
    .where(eq(reservations.externalReservationId, externalReservationId))
    .get();
}

export function listReservations() {
  const db = getDb();
  return db.select().from(reservations).all();
}
