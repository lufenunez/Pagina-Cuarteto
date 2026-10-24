import type { Concert } from "@/db/schema";
import { dayNumber, monthShort, weekdayShort } from "@/lib/dates";

export function ConcertRow({ concert }: { concert: Concert }) {
  const place = [concert.venue, concert.city].join(" · ");

  return (
    <li className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-4 border-b border-line py-7 sm:grid-cols-[6rem_1fr_auto] sm:gap-x-8">
      <time dateTime={concert.date} className="text-center">
        <span className="block font-serif text-5xl leading-none lining-nums sm:text-6xl">{dayNumber(concert.date)}</span>
        <span className="mt-1.5 block text-[0.65rem] font-medium tracking-[0.22em] text-gold uppercase">
          {monthShort(concert.date)}
        </span>
        <span className="block text-[0.6rem] tracking-[0.22em] text-muted uppercase">{weekdayShort(concert.date)}</span>
      </time>

      <div className="min-w-0">
        <h3 className="font-serif text-2xl leading-tight text-balance sm:text-3xl">{concert.title}</h3>
        <p className="mt-1.5 text-sm text-muted">
          {concert.organizer && <span className="text-gold-bright">{concert.organizer} · </span>}
          {place}
          {concert.time && <> · {concert.time} h</>}
        </p>
      </div>

      {concert.ticketUrl && (
        <a
          href={concert.ticketUrl}
          target="_blank"
          rel="noreferrer"
          className="btn col-start-2 justify-self-start sm:col-start-3 sm:justify-self-end"
        >
          Entradas
        </a>
      )}
    </li>
  );
}
