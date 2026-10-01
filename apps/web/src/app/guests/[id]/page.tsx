import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuestById } from "@/lib/repositories/guests";
import { listReservations } from "@/lib/repositories/reservations";
import { listStaysForGuest } from "@/lib/repositories/stays";

type Props = { params: Promise<{ id: string }> };

export default async function GuestDetailPage({ params }: Props) {
  const { id } = await params;
  const guest = getGuestById(id);
  if (!guest) notFound();

  const reservations = listReservations().filter((r) => r.guestId === id);
  const stays = listStaysForGuest(id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/guests" className="text-sm text-blue-700 underline">
        ← Guest 一覧
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">{guest.displayName}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Guest Summary の詳細 UI は Step 6 で拡張します。
      </p>
      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <h2 className="font-medium">連絡先</h2>
        <p className="mt-2 text-zinc-600">
          {guest.contactEmail ?? "—"} / {guest.contactPhone ?? "—"}
        </p>
      </section>
      <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <h2 className="font-medium">予約（紐付け済）</h2>
        <ul className="mt-2 list-disc pl-5 text-zinc-700">
          {reservations.map((r) => (
            <li key={r.id}>
              {r.checkInDate} – {r.checkOutDate}（{r.externalReservationId}）
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <h2 className="font-medium">Stay</h2>
        <ul className="mt-2 list-disc pl-5 text-zinc-700">
          {stays.map((s) => (
            <li key={s.id}>
              {s.checkInDate} – {s.checkOutDate}（{s.status}）
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
