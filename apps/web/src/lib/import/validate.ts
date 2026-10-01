import type { ParsedReservationRow } from "./canonical";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function trimOrNull(value: string | undefined): string | null {
  const t = (value ?? "").trim();
  return t.length > 0 ? t : null;
}

export type RowValidationResult =
  | { ok: true; data: ParsedReservationRow }
  | { ok: false; message: string };

export function validateCanonicalFields(
  raw: Record<string, string>,
): RowValidationResult {
  const externalReservationId = (raw.external_reservation_id ?? "").trim();
  const bookerName = (raw.guest_name ?? "").trim();
  const checkInDate = (raw.check_in ?? "").trim();
  const checkOutDate = (raw.check_out ?? "").trim();
  const contactEmail = trimOrNull(raw.email);
  const contactPhone = trimOrNull(raw.phone);

  if (!externalReservationId) {
    return { ok: false, message: "external_reservation_id は必須です" };
  }
  if (!bookerName) {
    return { ok: false, message: "guest_name は必須です" };
  }
  if (!checkInDate || !DATE_RE.test(checkInDate)) {
    return { ok: false, message: "check_in は YYYY-MM-DD 形式で必須です" };
  }
  if (!checkOutDate || !DATE_RE.test(checkOutDate)) {
    return { ok: false, message: "check_out は YYYY-MM-DD 形式で必須です" };
  }
  if (checkOutDate <= checkInDate) {
    return { ok: false, message: "check_out は check_in より後の日付にしてください" };
  }
  if (!contactEmail && !contactPhone) {
    return {
      ok: false,
      message: "email と phone の少なくとも一方は必須です",
    };
  }

  let guestCount: number | null = null;
  const guestCountRaw = (raw.guest_count ?? "").trim();
  if (guestCountRaw) {
    const n = Number.parseInt(guestCountRaw, 10);
    if (Number.isNaN(n) || n < 1) {
      return { ok: false, message: "guest_count は正の整数です" };
    }
    guestCount = n;
  }

  return {
    ok: true,
    data: {
      externalReservationId,
      bookerName,
      checkInDate,
      checkOutDate,
      contactEmail,
      contactPhone,
      guestNameKana: trimOrNull(raw.guest_name_kana),
      guestCount,
      roomLabel: trimOrNull(raw.room),
      source: trimOrNull(raw.source),
      bookedAt: trimOrNull(raw.booked_at),
      notes: trimOrNull(raw.notes),
    },
  };
}
