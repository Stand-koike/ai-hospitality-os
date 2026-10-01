import type { ImportSource } from "@/db/schema";
import { assertCanonicalHeaders, parseCsv, rowToCanonical } from "./parse-csv";
import { importCanonicalRows, type ImportResult } from "./run-import";

export function importCsvText(
  text: string,
  importSource: ImportSource = "csv_import",
): ImportResult | { error: string } {
  const { headers, rows } = parseCsv(text);
  if (headers.length === 0) {
    return { error: "CSV が空です" };
  }
  const headerError = assertCanonicalHeaders(headers);
  if (headerError) {
    return { error: headerError };
  }
  const canonicalRows = rows.map((row) => rowToCanonical(row));
  return importCanonicalRows(canonicalRows, importSource);
}
