import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <header>
        <p className="text-sm font-medium text-zinc-500">藍 ai · Phase 1</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Today&apos;s Brief
        </h1>
        <p className="mt-2 text-zinc-600">
          Step 1 完了: 永続化の土台を用意しました。Brief / Import / Resolution
          UI は Step 2 以降で追加します。
        </p>
      </header>
      <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <h2 className="font-medium">開発</h2>
        <ul className="mt-2 list-inside list-disc text-zinc-600">
          <li>
            <Link className="text-blue-700 underline" href="/api/health">
              /api/health
            </Link>
            — DB 接続確認
          </li>
        </ul>
      </section>
    </main>
  );
}
