import Link from "next/link";
import { notFound } from "next/navigation";
import { findCandidates, reasonLabel } from "@/lib/resolution/candidates";
import { getReservationById } from "@/lib/repositories/reservations";
import { ResolutionActions } from "./resolution-actions";

type Props = { params: Promise<{ id: string }> };

export default async function ResolutionDetailPage({ params }: Props) {
  const { id } = await params;
  const reservation = getReservationById(id);
  if (!reservation) notFound();

  if (reservation.guestResolutionStatus === "linked" && reservation.guestId) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-sm text-zinc-600">この予約は紐付け済みです。</p>
        <Link
          href={`/guests/${reservation.guestId}`}
          className="mt-4 inline-block text-blue-700 underline"
        >
          Guest を見る
        </Link>
      </main>
    );
  }

  const candidates = findCandidates(reservation);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/resolution" className="text-sm text-blue-700 underline">
        ← 未解決一覧
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">Resolution</h1>
      <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <h2 className="font-medium">予約</h2>
        <dl className="mt-2 grid gap-1 text-zinc-700">
          <div>
            <dt className="inline text-zinc-500">氏名: </dt>
            <dd className="inline">{reservation.bookerName}</dd>
          </div>
          <div>
            <dt className="inline text-zinc-500">日程: </dt>
            <dd className="inline">
              {reservation.checkInDate} – {reservation.checkOutDate}
            </dd>
          </div>
          <div>
            <dt className="inline text-zinc-500">連絡先: </dt>
            <dd className="inline">
              {reservation.contactEmail ?? "—"} / {reservation.contactPhone ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="inline text-zinc-500">外部 ID: </dt>
            <dd className="inline">{reservation.externalReservationId}</dd>
          </div>
        </dl>
      </section>
      <section className="mt-6">
        <h2 className="font-medium">候補 Guest（{candidates.length} 件）</h2>
        {candidates.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            候補がありません。新規 Guest を作成してください。
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {candidates.map((c) => (
              <li
                key={c.guestId}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm"
              >
                <p className="font-medium">{c.displayName}</p>
                <p className="text-xs text-zinc-500">
                  過去滞在 {c.completedStayCount} 回
                  {c.lastStayCheckOut ? ` · 最終 ${c.lastStayCheckOut}` : ""}
                </p>
                <p className="mt-1 text-xs text-amber-800">
                  {c.reasons.map(reasonLabel).join(" · ")}
                </p>
                <ResolutionActions
                  reservationId={id}
                  mode="link"
                  guestId={c.guestId}
                />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 p-4">
          <p className="text-sm font-medium">新規 Guest として登録</p>
          <p className="mt-1 text-xs text-zinc-500">
            予約名・連絡先で Guest を作成し紐付けます。
          </p>
          <ResolutionActions reservationId={id} mode="create" />
        </div>
      </section>
    </main>
  );
}
