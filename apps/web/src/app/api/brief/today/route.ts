import { buildTodaysBrief } from "@/lib/brief/today";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(buildTodaysBrief());
}
