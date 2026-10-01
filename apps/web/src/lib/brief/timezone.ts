/** Facility-local calendar date as YYYY-MM-DD (pilot default: Asia/Tokyo). */
export function getFacilityToday(now = new Date()): string {
  const tz = process.env.FACILITY_TIMEZONE ?? "Asia/Tokyo";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
