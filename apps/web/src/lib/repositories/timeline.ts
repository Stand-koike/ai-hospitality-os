import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { timelineEntries } from "@/db/schema";
import { newId } from "@/lib/ids";
import { nowIso } from "@/lib/time";

export type NewTimelineEntryInput = {
  guestId: string;
  body: string;
  occurredAt?: string;
  createdBy?: string | null;
  relatedReservationId?: string | null;
};

const DEFAULT_STAFF_LABEL = "スタッフ";

export function createTimelineEntry(input: NewTimelineEntryInput) {
  const db = getDb();
  const recordedAt = nowIso();
  const row = {
    id: newId(),
    guestId: input.guestId,
    occurredAt: input.occurredAt ?? recordedAt,
    recordedAt,
    entryType: "staff_note" as const,
    body: input.body,
    createdBy: input.createdBy ?? DEFAULT_STAFF_LABEL,
    relatedReservationId: input.relatedReservationId ?? null,
  };
  db.insert(timelineEntries).values(row).run();
  return row;
}

export function listTimelineForGuest(guestId: string) {
  const db = getDb();
  return db
    .select()
    .from(timelineEntries)
    .where(eq(timelineEntries.guestId, guestId))
    .all();
}
