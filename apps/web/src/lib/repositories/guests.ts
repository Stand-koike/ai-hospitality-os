import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { guests } from "@/db/schema";
import { newId } from "@/lib/ids";
import { nowIso } from "@/lib/time";

export type NewGuestInput = {
  displayName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

export function createGuest(input: NewGuestInput) {
  const db = getDb();
  const ts = nowIso();
  const row = {
    id: newId(),
    displayName: input.displayName,
    contactEmail: input.contactEmail ?? null,
    contactPhone: input.contactPhone ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  db.insert(guests).values(row).run();
  return row;
}

export function getGuestById(id: string) {
  const db = getDb();
  return db.select().from(guests).where(eq(guests.id, id)).get();
}

export function listGuests() {
  const db = getDb();
  return db.select().from(guests).all();
}

export function updateGuest(
  id: string,
  patch: Partial<Pick<NewGuestInput, "displayName" | "contactEmail" | "contactPhone">>,
) {
  const db = getDb();
  db.update(guests)
    .set({
      ...patch,
      contactEmail: patch.contactEmail ?? undefined,
      contactPhone: patch.contactPhone ?? undefined,
      updatedAt: nowIso(),
    })
    .where(eq(guests.id, id))
    .run();
  return getGuestById(id);
}
