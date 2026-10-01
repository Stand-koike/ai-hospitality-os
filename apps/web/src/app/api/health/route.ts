import { sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { guests } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const guestCount = db.select({ count: sql<number>`count(*)` }).from(guests).get();
  return Response.json({
    ok: true,
    phase: 1,
    step: 1,
    guests: guestCount?.count ?? 0,
  });
}
