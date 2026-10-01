import { listGuestsWithStats } from "@/lib/guests/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ guests: listGuestsWithStats() });
}
