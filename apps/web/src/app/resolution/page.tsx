import Link from "next/link";
import { listUnresolvedReservations } from "@/lib/repositories/reservations";

export default function ResolutionListPage() {
  const unresolved = listUnresolvedReservations();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/" className="text-sm text-blue-700 underline">
        ← Today's Brief
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">Guest Resolution</h1>
      <p className="mt-2 text-sm text-zinc-600">
        未紐付けの予約を既存 Guest に link するか、新規 Guest を作成します（人の確認必須）。
      </p>
      {unresolved.length === 0 ? (
        <p className="mt-8 text-zinc-500">
          未解決の予約はありません。{" "}
          <Link href="/import" className="underline">取り込み</Link>
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {unresolved.map((r) => (
            <li key={r.id} className="px-4 py-3">
              <Link
                href={`/resolution/${r.id}`}
                className="font-medium text-blue-800 hover:underline"
              >
                {r.bookerName}
              </Link>
              <p className="mt-1 text-xs text-zinc-500">
                {r.checkInDate} – {r.checkOutDate} · {r.externalReservationId}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
