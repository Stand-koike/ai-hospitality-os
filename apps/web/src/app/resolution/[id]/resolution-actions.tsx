"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props =
  | { reservationId: string; mode: "link"; guestId: string }
  | { reservationId: string; mode: "create" };

export function ResolutionActions(props: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setLoading(true);
    setError(null);
    const body =
      props.mode === "create"
        ? { action: "create" }
        : { action: "link", guestId: props.guestId };
    const res = await fetch(`/api/reservations/${props.reservationId}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "失敗しました");
      return;
    }
    router.push(`/guests/${data.guestId}`);
    router.refresh();
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={loading}
        onClick={confirm}
        className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white disabled:opacity-40"
      >
        {props.mode === "create" ? "新規作成して紐付け" : "この Guest に紐付け"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
