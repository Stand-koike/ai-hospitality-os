import Link from "next/link";
import { countUnresolvedReservations } from "@/lib/repositories/reservations";

export default function HomePage() {
  const unresolved = countUnresolvedReservations();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <header>
        <p className="text-sm font-medium text-zinc-500">藍 ai · Phase 1</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Today&apos;s Brief
        </h1>
        <p className="mt-2 text-zinc-600">
          Step 2: 予約の取り込み（CSV / 手動 / 表）が利用できます。Brief 画面は
          Step 5 で拡張します。
        </p>
      </header>
      {unresolved > 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          未 Resolution の予約: <strong>{unresolved}</strong> 件（Resolution UI
          は Step 4）
        </p>
      )}
      <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <h2 className="font-medium">メニュー</h2>
        <ul className="mt-2 space-y-2">
          <li>
            <Link className="text-blue-700 underline" href="/import">
              予約の取り込み
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
