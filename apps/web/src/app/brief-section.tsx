import Link from "next/link";
import type { BriefRow, TodaysBrief } from "@/lib/brief/today";

function BriefList({
  title,
  rows,
  emptyMessage,
}: {
  title: string;
  rows: BriefRow[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <h2 className="border-b border-zinc-100 px-4 py-3 font-medium">{title}</h2>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-zinc-500">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <li key={row.reservationId} className="px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={row.primaryHref}
                  className="font-medium text-blue-800 hover:underline"
                >
                  {row.displayName}
                </Link>
                {row.guestResolutionStatus === "unresolved" && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-900">
                    未 Resolution
                  </span>
                )}
                {row.isRepeatGuest && (
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-xs text-sky-900">
                    リピート
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {row.checkInDate} – {row.checkOutDate}
                {row.roomLabel ? ` · ${row.roomLabel}` : ""}
              </p>
              {row.guestId && (
                <Link
                  href={`/guests/${row.guestId}`}
                  className="mt-1 inline-block text-xs text-blue-700 underline"
                >
                  Guest Summary
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function BriefSections({ brief }: { brief: TodaysBrief }) {
  return (
    <div className="flex flex-col gap-6">
      {brief.unresolvedCount > 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          未 Resolution の予約: <strong>{brief.unresolvedCount}</strong> 件 —{" "}
          <Link href="/resolution" className="font-medium underline">
            Guest Resolution
          </Link>
        </p>
      )}
      <BriefList
        title={`到着（${brief.arrivals.length}）`}
        rows={brief.arrivals}
        emptyMessage="本日の到着はありません。"
      />
      <BriefList
        title={`出発（${brief.departures.length}）`}
        rows={brief.departures}
        emptyMessage="本日の出発はありません。"
      />
      {brief.arrivals.length === 0 && brief.departures.length === 0 && (
        <p className="text-center text-sm text-zinc-600">
          <Link href="/import" className="underline">予約を取り込む</Link>
        </p>
      )}
    </div>
  );
}
