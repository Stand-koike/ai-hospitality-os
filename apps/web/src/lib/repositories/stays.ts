import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { stays, type StayStatus } from "@/db/schema";
import { newId } from "@/lib/ids";
import { nowIso } from "@/lib/time";

export type NewStayInput = {
  guestId: string;
  reservationId: string;
  checkInDate: string;
  checkOutDate: string;
  status?: StayStatus;
};

export function createStay(input: NewStayInput) {
  const db = getDb();
  const ts = nowIso();
  const row = {
    id: newId(),
    guestId: input.guestId,
    reservationId: input.reservationId,
    checkInDate: input.checkInDate,
    checkOutDate: input.checkOutDate,
    status: input.status ?? "planned",
    createdAt: ts,
    updatedAt: ts,
  };
  db.insert(stays).values(row).run();
  return row;
}

export function listStaysForGuest(guestId: string) {
  const db = getDb();
  return db.select().from(stays).where(eq(stays.guestId, guestId)).all();
}

export function getStayByReservationId(reservationId: string) {
  const db = getDb();
  return db
    .select()
    .from(stays)
    .where(eq(stays.reservationId, reservationId))
    .get();
}
