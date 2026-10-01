import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { reservations, type ImportSource, type ResolutionStatus } from "@/db/schema";
import type { ParsedReservationRow } from "@/lib/import/canonical";
import type { ImportContext } from "@/lib/import/canonical";
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

function toRowFields(
  input: ParsedReservationRow,
  ctx: ImportContext,
  existing?: { guestId: string | null; guestResolutionStatus: ResolutionStatus },
) {
  return {
    externalReservationId: input.externalReservationId,
    bookerName: input.bookerName,
    checkInDate: input.checkInDate,
    checkOutDate: input.checkOutDate,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    guestNameKana: input.guestNameKana,
    guestCount: input.guestCount,
    roomLabel: input.roomLabel,
    source: input.source,
    bookedAt: input.bookedAt,
    notes: input.notes,
    importSource: ctx.importSource,
    importedAt: nowIso(),
    importBatchId: ctx.importBatchId,
    guestResolutionStatus: existing?.guestResolutionStatus ?? "unresolved",
    guestId: existing?.guestId ?? null,
  };
}

export function upsertReservationFromImport(
  input: ParsedReservationRow,
  ctx: ImportContext,
): { action: "created" | "updated"; id: string } {
  const db = getDb();
  const existing = getReservationByExternalId(input.externalReservationId);
  if (existing) {
    const fields = toRowFields(input, ctx, {
      guestId: existing.guestId,
      guestResolutionStatus: existing.guestResolutionStatus as ResolutionStatus,
    });
    db.update(reservations)
      .set({
        bookerName: fields.bookerName,
        checkInDate: fields.checkInDate,
        checkOutDate: fields.checkOutDate,
        contactEmail: fields.contactEmail,
        contactPhone: fields.contactPhone,
        guestNameKana: fields.guestNameKana,
        guestCount: fields.guestCount,
        roomLabel: fields.roomLabel,
        source: fields.source,
        bookedAt: fields.bookedAt,
        notes: fields.notes,
        importSource: fields.importSource,
        importedAt: fields.importedAt,
        importBatchId: fields.importBatchId,
      })
      .where(eq(reservations.id, existing.id))
      .run();
    return { action: "updated", id: existing.id };
  }
  const fields = toRowFields(input, ctx);
  const row = { id: newId(), ...fields };
  db.insert(reservations).values(row).run();
  return { action: "created", id: row.id };
}

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

export function listUnresolvedReservations() {
  const db = getDb();
  return db
    .select()
    .from(reservations)
    .all()
    .filter((r) => r.guestResolutionStatus === "unresolved")
    .sort((a, b) => a.checkInDate.localeCompare(b.checkInDate));
}

export function countUnresolvedReservations(): number {
  return listUnresolvedReservations().length;
}
