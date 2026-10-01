import type { ImportSource } from "@/db/schema";
import { newId } from "@/lib/ids";
import { upsertReservationFromImport } from "@/lib/repositories/reservations";
import type { ImportContext } from "./canonical";
import { validateCanonicalFields } from "./validate";

export type ImportRowError = {
  row: number;
  externalReservationId?: string;
  message: string;
};

export type ImportResult = {
  importBatchId: string;
  created: number;
  updated: number;
  failed: number;
  errors: ImportRowError[];
};

export function importCanonicalRows(
  rows: Record<string, string>[],
  importSource: ImportSource,
): ImportResult {
  const importBatchId = newId();
  const ctx: ImportContext = { importSource, importBatchId };
  const result: ImportResult = {
    importBatchId,
    created: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  rows.forEach((raw, index) => {
    const rowNumber = index + 2; // 1-based + header
    const validated = validateCanonicalFields(raw);
    if (!validated.ok) {
      result.failed += 1;
      result.errors.push({
        row: rowNumber,
        externalReservationId: raw.external_reservation_id?.trim() || undefined,
        message: validated.message,
      });
      return;
    }
    const outcome = upsertReservationFromImport(validated.data, ctx);
    if (outcome.action === "created") result.created += 1;
    else result.updated += 1;
  });

  return result;
}
