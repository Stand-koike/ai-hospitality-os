/** Normalize phone for equality checks (digits only). */
export function normalizePhone(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}
