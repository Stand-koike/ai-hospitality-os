import Link from "next/link";
import { listGuestsWithStats } from "@/lib/guests/stats";

export default function GuestsPage() {
  const guests = listGuestsWithStats();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/" className="text-sm text-blue-700 underline">
        ← Today's Brief
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">Guest 一覧</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Phase 1 Step 3 — 紐付け済み Guest の一覧（{guests.length} 件）
      </p>
      {guests.length === 0 ? (
        <p className="mt-8 text-zinc-500">
          まだ Guest がありません。{" "}
          <Link href="/resolution" className="underline">
            Guest Resolution
          </Link>
          で新規作成してください。
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
          {guests.map((g) => (
            <li key={g.id} className="px-4 py-3">
              <Link
                href={`/guests/${g.id}`}
                className="font-medium text-blue-800 hover:underline"
              >
                {g.displayName}
              </Link>
              <p className="mt-1 text-xs text-zinc-500">
                予約 {g.linkedReservationCount} · 完了滞在 {g.completedStayCount}
                {g.contactEmail ? ` · ${g.contactEmail}` : ""}
                {g.contactPhone ? ` · ${g.contactPhone}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
