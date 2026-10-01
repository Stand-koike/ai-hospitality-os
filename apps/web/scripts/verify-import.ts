import fs from "node:fs";
import path from "node:path";
import { closeDb } from "../src/db/client";
import { importCsvText } from "../src/lib/import/import-csv";
import { getReservationByExternalId } from "../src/lib/repositories/reservations";

const templatePath = path.join(
  process.cwd(),
  "../../templates/standard-reservation-import.csv",
);

function main() {
  const template = fs.readFileSync(templatePath, "utf8");
  const extId = `BK-VERIFY-${Date.now()}`;
  const csv = template.replace("BK-2026-0042", extId);
  const first = importCsvText(csv, "csv_import");
  if ("error" in first) {
    throw new Error(first.error);
  }
  if (first.created !== 1 || first.failed !== 0) {
    throw new Error(`first import unexpected: ${JSON.stringify(first)}`);
  }
  const row = getReservationByExternalId(extId);
  if (!row) throw new Error("reservation not found");

  const modified = csv.replace("2026-10-03", "2026-10-04");
  const second = importCsvText(modified, "csv_import");
  if ("error" in second) {
    throw new Error(second.error);
  }
  if (second.updated !== 1 || second.created !== 0) {
    throw new Error(`upsert unexpected: ${JSON.stringify(second)}`);
  }
  const updated = getReservationByExternalId(extId);
  if (updated?.checkOutDate !== "2026-10-04") {
    throw new Error("check_out not updated");
  }
  if (updated.guestResolutionStatus !== row.guestResolutionStatus) {
    throw new Error("resolution status changed on upsert");
  }

  const bad = importCsvText(
    `${template.split("\n")[0]}\nBAD-1,名前,2026-10-01,2026-10-03,,,`,
    "csv_import",
  );
  if ("error" in bad) throw new Error(bad.error);
  if (bad.failed !== 1) throw new Error("expected contact validation failure");

  console.log("verify-import: ok");
  closeDb();
}

main();
