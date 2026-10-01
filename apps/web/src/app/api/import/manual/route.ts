import { manualToCanonicalRow, type ManualReservationInput } from "@/lib/import/manual-to-canonical";
import { importCanonicalRows } from "@/lib/import/run-import";
import { validateCanonicalFields } from "@/lib/import/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as ManualReservationInput;
  const raw = manualToCanonicalRow(body);
  const validated = validateCanonicalFields(raw);
  if (!validated.ok) {
    return Response.json({ error: validated.message }, { status: 400 });
  }
  const result = importCanonicalRows([raw], "manual");
  if (result.failed > 0) {
    return Response.json(
      { error: result.errors[0]?.message ?? "登録に失敗しました" },
      { status: 400 },
    );
  }
  return Response.json({
    importBatchId: result.importBatchId,
    created: result.created,
    updated: result.updated,
  });
}
