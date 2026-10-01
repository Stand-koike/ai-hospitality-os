import {
  ResolutionError,
  resolveToExistingGuest,
  resolveWithNewGuest,
} from "@/lib/resolution/resolve";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = (await request.json()) as {
    action?: "link" | "create";
    guestId?: string;
  };

  try {
    if (body.action === "create") {
      const result = resolveWithNewGuest(id);
      return Response.json(result);
    }
    if (body.action === "link" && body.guestId) {
      const result = resolveToExistingGuest(id, body.guestId);
      return Response.json(result);
    }
    return Response.json({ error: "action と guestId が必要です" }, { status: 400 });
  } catch (err) {
    if (err instanceof ResolutionError) {
      const status =
        err.code === "not_found" ? 404 : err.code === "already_linked" ? 409 : 400;
      return Response.json({ error: err.message }, { status });
    }
    throw err;
  }
}
