import { importCsvText } from "@/lib/import/import-csv";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let csvText: string;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "file が必要です" }, { status: 400 });
    }
    csvText = await file.text();
  } else {
    const body = (await request.json()) as { csvText?: string };
    if (!body.csvText?.trim()) {
      return Response.json({ error: "csvText が必要です" }, { status: 400 });
    }
    csvText = body.csvText;
  }

  const result = importCsvText(csvText, "csv_import");
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }
  return Response.json(result);
}
