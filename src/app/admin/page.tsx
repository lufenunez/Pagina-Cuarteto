import Link from "next/link";
import { adminHref } from "@/lib/admin-path";
import type { Concert } from "@/db/schema";
import { longDate } from "@/lib/dates";
import { getPastConcerts, getUpcomingConcerts } from "@/lib/queries";
import { syncFeverNow } from "./actions";

function ConcertTable({ list }: { list: Concert[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {list.map((c) => (
        <li key={c.id}>
          <Link
            href={adminHref(`/conciertos/${c.id}`)}
            className="grid gap-1 px-2 py-4 transition-colors hover:bg-ink-2 sm:grid-cols-[17rem_1fr_auto] sm:items-center sm:gap-6"
          >
            <span className="text-sm text-gold-bright first-letter:uppercase">
              {longDate(c.date)}
              {c.time && <span className="text-muted"> · {c.time}</span>}
            </span>
            <span>
              <span className="font-serif text-xl">{c.title}</span>
              <span className="block text-sm text-muted">
                {c.venue} · {c.city}
                {c.organizer && <> · {c.organizer}</>}
              </span>
            </span>
            <span className="text-[0.65rem] tracking-[0.18em] text-muted uppercase">
              {c.source === "fever" && <span className="text-gold">Fever · </span>}
              {c.isPublic ? (c.ticketUrl ? "Público · entradas" : "Público") : "Privado"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FeverMessage({ code }: { code: string }) {
  const [added, updated, errors] = code.split("-").map(Number);
  const parts = [
    added ? `${added} concierto${added === 1 ? "" : "s"} nuevo${added === 1 ? "" : "s"}` : null,
    updated ? `${updated} actualizado${updated === 1 ? "" : "s"}` : null,
  ].filter(Boolean);

  return (
    <p className={`mt-6 border px-4 py-3 text-sm ${errors ? "border-danger/50 text-danger" : "border-gold/40 text-gold-bright"}`}>
      {parts.length ? `Fever: ${parts.join(" y ")}.` : "Fever: todo estaba al día."}
      {errors > 0 && ` Hubo ${errors} error${errors === 1 ? "" : "es"} al leer Fever; puede que hayan cambiado su página.`}
    </p>
  );
}

export default async function AdminConcertsPage({ searchParams }: { searchParams: Promise<{ fever?: string }> }) {
  const { fever } = await searchParams;
  const [upcoming, past] = await Promise.all([getUpcomingConcerts({ includePrivate: true }), getPastConcerts()]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Próximos conciertos</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <form action={syncFeverNow}>
            <button type="submit" className="btn-ghost">
              Traer fechas de Fever
            </button>
          </form>
          <Link href={adminHref("/conciertos/nuevo")} className="btn">
            + Nuevo concierto
          </Link>
        </div>
      </div>
      {fever && /^\d+-\d+-\d+$/.test(fever) && <FeverMessage code={fever} />}
      <p className="mt-4 text-sm text-muted">
        Los Candlelight de Concepción, Chillán y Puerto Montt se traen solos desde Fever una vez al día.
      </p>

      <div className="mt-8">
        {upcoming.length > 0 ? (
          <ConcertTable list={upcoming} />
        ) : (
          <p className="text-muted">No hay conciertos agendados.</p>
        )}
      </div>

      <details className="mt-14 group">
        <summary className="cursor-pointer list-none font-serif text-2xl text-muted hover:text-parchment">
          <span className="inline-block transition-transform group-open:rotate-90">›</span> Conciertos pasados ({past.length})
        </summary>
        <p className="mt-2 mb-4 text-sm text-muted">
          Ya no aparecen en la página pública, pero quedan guardados aquí.
        </p>
        <ConcertTable list={past} />
      </details>
    </>
  );
}
