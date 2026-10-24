import Link from "next/link";
import { adminHref } from "@/lib/admin-path";
import { saveConcert } from "@/app/admin/actions";
import type { Concert } from "@/db/schema";
import { site } from "@/lib/site";

export function ConcertForm({ concert }: { concert?: Concert }) {
  return (
    <form action={saveConcert} className="grid gap-6 sm:grid-cols-2">
      {concert && <input type="hidden" name="id" value={concert.id} />}

      <div className="sm:col-span-2">
        <label htmlFor="title" className="label">
          Título del evento *
        </label>
        <input id="title" name="title" required defaultValue={concert?.title} placeholder="Tributo a Queen" className="field" />
      </div>
      <div>
        <label htmlFor="organizer" className="label">
          Organiza / ciclo
        </label>
        <input id="organizer" name="organizer" defaultValue={concert?.organizer ?? ""} placeholder="Candlelight" className="field" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="label">
            Fecha *
          </label>
          <input id="date" name="date" type="date" required defaultValue={concert?.date} className="field" />
        </div>
        <div>
          <label htmlFor="time" className="label">
            Hora
          </label>
          <input id="time" name="time" type="time" defaultValue={concert?.time ?? ""} className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="venue" className="label">
          Lugar *
        </label>
        <input id="venue" name="venue" required defaultValue={concert?.venue} placeholder="Teatro Biobío" className="field" />
      </div>
      <div>
        <label htmlFor="city" className="label">
          Ciudad *
        </label>
        <input
          id="city"
          name="city"
          list="cities"
          required
          defaultValue={concert?.city}
          placeholder="Concepción"
          className="field"
        />
        <datalist id="cities">
          {site.cities.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ticketUrl" className="label">
          Link de entradas
        </label>
        <input
          id="ticketUrl"
          name="ticketUrl"
          type="url"
          defaultValue={concert?.ticketUrl ?? ""}
          placeholder="https://feverup.com/…"
          className="field"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="notes" className="label">
          Notas internas (no se publican)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={concert?.notes ?? ""}
          placeholder="Hora de llamado, contacto, vestimenta, setlist…"
          className="field"
        />
      </div>
      <label className="flex items-center gap-3 text-sm sm:col-span-2">
        <input type="checkbox" name="isPublic" defaultChecked={concert?.isPublic ?? true} className="size-4 accent-gold" />
        Mostrar en la página pública
      </label>

      <div className="flex items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn">
          Guardar
        </button>
        <Link href={adminHref()} className="btn-ghost">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
