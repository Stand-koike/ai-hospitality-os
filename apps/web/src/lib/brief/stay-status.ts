import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { stays } from "@/db/schema";
import { nowIso } from "@/lib/time";

/** Mark planned stays completed when checkout date is before today (lazy on Brief load). */
export function refreshCompletedStays(asOfDate: string) {
  const db = getDb();
  const planned = db.select().from(stays).where(eq(stays.status, "planned")).all();
  for (const stay of planned) {
    if (stay.checkOutDate < asOfDate) {
      db.update(stays)
        .set({ status: "completed", updatedAt: nowIso() })
        .where(eq(stays.id, stay.id))
        .run();
    }
  }
}
