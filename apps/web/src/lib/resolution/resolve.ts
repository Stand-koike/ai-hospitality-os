import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { reservations } from "@/db/schema";
import { createGuest, getGuestById } from "@/lib/repositories/guests";
import {
  getReservationById,
} from "@/lib/repositories/reservations";
import { createStay, getStayByReservationId } from "@/lib/repositories/stays";

export class ResolutionError extends Error {
  constructor(
    message: string,
    readonly code: "not_found" | "already_linked" | "invalid",
  ) {
    super(message);
  }
}

function ensureStayForReservation(
  reservationId: string,
  guestId: string,
  checkIn: string,
  checkOut: string,
) {
  const existing = getStayByReservationId(reservationId);
  if (existing) return existing;
  return createStay({
    guestId,
    reservationId,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    status: "planned",
  });
}

function markReservationLinked(reservationId: string, guestId: string) {
  const db = getDb();
  db.update(reservations)
    .set({
      guestId,
      guestResolutionStatus: "linked",
    })
    .where(eq(reservations.id, reservationId))
    .run();
}

export function resolveToExistingGuest(reservationId: string, guestId: string) {
  const reservation = getReservationById(reservationId);
  if (!reservation) {
    throw new ResolutionError("予約が見つかりません", "not_found");
  }
  if (reservation.guestResolutionStatus === "linked") {
    throw new ResolutionError("すでに紐付け済みです", "already_linked");
  }
  const guest = getGuestById(guestId);
  if (!guest) {
    throw new ResolutionError("Guest が見つかりません", "not_found");
  }

  markReservationLinked(reservationId, guestId);
  const stay = ensureStayForReservation(
    reservationId,
    guestId,
    reservation.checkInDate,
    reservation.checkOutDate,
  );

  return { guestId, stayId: stay.id };
}

export function resolveWithNewGuest(reservationId: string) {
  const reservation = getReservationById(reservationId);
  if (!reservation) {
    throw new ResolutionError("予約が見つかりません", "not_found");
  }
  if (reservation.guestResolutionStatus === "linked") {
    throw new ResolutionError("すでに紐付け済みです", "already_linked");
  }

  const guest = createGuest({
    displayName: reservation.bookerName,
    contactEmail: reservation.contactEmail,
    contactPhone: reservation.contactPhone,
  });

  markReservationLinked(reservationId, guest.id);
  const stay = ensureStayForReservation(
    reservationId,
    guest.id,
    reservation.checkInDate,
    reservation.checkOutDate,
  );

  return { guestId: guest.id, stayId: stay.id };
}
