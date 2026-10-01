import Link from "next/link";
import { ImportPanel } from "./import-panel";

export default function ImportPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
      <header>
        <Link href="/" className="text-sm text-blue-700 underline">
          ← Today's Brief
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          予約の取り込み
        </h1>
        <p className="mt-2 text-zinc-600">
          標準 CSV・手動登録・表データ（JSON）は同一パイプラインで取り込みます。
        </p>
      </header>
      <ImportPanel />
    </main>
  );
}
