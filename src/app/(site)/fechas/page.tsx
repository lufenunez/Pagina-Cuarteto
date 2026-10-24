import type { Metadata } from "next";
import { ConcertRow } from "@/components/concert-row";
import type { Concert } from "@/db/schema";
import { monthKey, monthTitle } from "@/lib/dates";
import { getUpcomingConcerts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Fechas" };

export default async function FechasPage() {
  const concerts = await getUpcomingConcerts();

  const byMonth = new Map<string, Concert[]>();
  for (const c of concerts) byMonth.set(monthKey(c.date), [...(byMonth.get(monthKey(c.date)) ?? []), c]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-8">
      <h1 className="font-serif text-5xl sm:text-7xl">Próximas fechas</h1>

      {concerts.length === 0 && <p className="mt-12 text-muted">Pronto anunciaremos nuevas fechas.</p>}

      {[...byMonth].map(([key, list]) => (
        <section key={key} className="mt-16">
          <h2 className="border-b border-line pb-4 font-serif text-2xl text-gold-bright capitalize italic">
            {monthTitle(list[0].date)}
          </h2>
          <ul>
            {list.map((c) => (
              <ConcertRow key={c.id} concert={c} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
