import { importCanonicalRows } from "@/lib/import/run-import";
import { rowToCanonical } from "@/lib/import/parse-csv";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { rows?: Record<string, string>[] };
  if (!body.rows?.length) {
    return Response.json({ error: "rows が必要です" }, { status: 400 });
  }
  const canonicalRows = body.rows.map((row) => rowToCanonical(row));
  const result = importCanonicalRows(canonicalRows, "table_import");
  return Response.json(result);
}
