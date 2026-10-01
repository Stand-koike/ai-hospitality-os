"use client";

import { useState } from "react";

type ImportResult = {
  importBatchId: string;
  created: number;
  updated: number;
  failed: number;
  errors: { row: number; externalReservationId?: string; message: string }[];
};

const emptyManual = {
  externalReservationId: "",
  guestName: "",
  checkIn: "",
  checkOut: "",
  email: "",
  phone: "",
  notes: "",
};

export function ImportPanel() {
  const [csvText, setCsvText] = useState("");
  const [manual, setManual] = useState(emptyManual);
  const [tableJson, setTableJson] = useState("[]");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runImport(
    url: string,
    init: RequestInit,
  ) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(url, init);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "取り込みに失敗しました");
        return;
      }
      if (data.errors) {
        setResult(data as ImportResult);
      } else {
        setResult({
          importBatchId: data.importBatchId,
          created: data.created,
          updated: data.updated ?? 0,
          failed: 0,
          errors: [],
        });
      }
    } catch {
      setError("通信エラー");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="font-medium">CSV ファイル</h2>
        <p className="mt-1 text-sm text-zinc-600">
          <code className="text-xs">templates/standard-reservation-import.csv</code>{" "}
          形式
        </p>
        <input
          className="mt-3 block w-full text-sm"
          type="file"
          accept=".csv,text/csv"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const form = new FormData();
            form.append("file", file);
            await runImport("/api/import/csv", { method: "POST", body: form });
          }}
        />
        <label className="mt-4 block text-sm font-medium text-zinc-700">
          または CSV を貼り付け
        </label>
        <textarea
          className="mt-1 w-full rounded-lg border border-zinc-300 p-3 font-mono text-xs"
          rows={6}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="external_reservation_id,guest_name,..."
        />
        <button
          type="button"
          disabled={loading || !csvText.trim()}
          className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-40"
          onClick={() =>
            runImport("/api/import/csv", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ csvText }),
            })
          }
        >
          CSV を取り込む
        </button>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="font-medium">手動登録</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["externalReservationId", "予約 ID（外部）"],
              ["guestName", "宿泊者名"],
              ["checkIn", "チェックイン"],
              ["checkOut", "チェックアウト"],
              ["email", "メール"],
              ["phone", "電話"],
              ["notes", "メモ"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="text-sm">
              <span className="text-zinc-600">{label}</span>
              <input
                className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5"
                value={manual[key]}
                onChange={(e) =>
                  setManual((m) => ({ ...m, [key]: e.target.value }))
                }
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          disabled={loading}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-40"
          onClick={() =>
            runImport("/api/import/manual", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(manual),
            })
          }
        >
          1 件登録
        </button>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="font-medium">表データ（JSON）</h2>
        <p className="mt-1 text-sm text-zinc-600">
          行オブジェクトの配列。キーは標準 CSV 列名。
        </p>
        <textarea
          className="mt-2 w-full rounded-lg border border-zinc-300 p-3 font-mono text-xs"
          rows={5}
          value={tableJson}
          onChange={(e) => setTableJson(e.target.value)}
        />
        <button
          type="button"
          disabled={loading}
          className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-40"
          onClick={() => {
            let rows: Record<string, string>[];
            try {
              rows = JSON.parse(tableJson) as Record<string, string>[];
            } catch {
              setError("JSON の形式が正しくありません");
              return;
            }
            runImport("/api/import/table", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rows }),
            });
          }}
        >
          表データを取り込む
        </button>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {result && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm">
          <p className="font-medium text-emerald-900">取り込み結果</p>
          <ul className="mt-2 list-inside list-disc text-emerald-800">
            <li>新規: {result.created} 件</li>
            <li>更新: {result.updated} 件</li>
            <li>エラー: {result.failed} 件</li>
          </ul>
          {result.errors.length > 0 && (
            <ul className="mt-3 space-y-1 font-mono text-xs text-red-800">
              {result.errors.map((err) => (
                <li key={`${err.row}-${err.message}`}>
                  行 {err.row}: {err.message}
                  {err.externalReservationId
                    ? ` (${err.externalReservationId})`
                    : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
