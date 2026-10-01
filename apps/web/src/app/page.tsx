import Link from "next/link";
import { BriefSections } from "./brief-section";
import { buildTodaysBrief } from "@/lib/brief/today";

export default function HomePage() {
  const brief = buildTodaysBrief();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10">
      <header>
        <p className="text-sm font-medium text-zinc-500">藍 ai · Phase 1</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Today&apos;s Brief
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{brief.date}</p>
      </header>

      <BriefSections brief={brief} />

      <nav className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <h2 className="font-medium text-zinc-700">その他</h2>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <li>
            <Link className="text-blue-700 underline" href="/import">
              取り込み
            </Link>
          </li>
          <li>
            <Link className="text-blue-700 underline" href="/resolution">
              Resolution
            </Link>
          </li>
          <li>
            <Link className="text-blue-700 underline" href="/guests">
              Guest
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
