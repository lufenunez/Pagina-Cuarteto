// Importa los conciertos Candlelight publicados en Fever para las ciudades del cuarteto.
// Todo lo que sale en estas páginas lo toca Antiguas Vanguardias.
//
// Cómo se leen los datos (si Fever cambia su página, es aquí donde hay que ajustar):
// - Página de la ciudad: bloque JSON-LD "ItemList" con los links de cada evento (https://feverup.com/m/<id>).
// - Página del evento: <title> con el nombre, "defaultSession.startsAtIso" con fecha y hora,
//   y "places":[{"address", "name"}] con el lugar.
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { concerts } from "@/db/schema";
import { todayISO } from "./dates";

export const FEVER_CITIES = [
  { city: "Concepción", url: "https://feverup.com/es/concepcion/candlelight" },
  { city: "Chillán", url: "https://feverup.com/es/chillan-chile/candlelight" },
  { city: "Puerto Montt", url: "https://feverup.com/es/puerto-montt-chile/candlelight" },
];

const LIST_READS = 3;

type FeverEvent ={ id: string; url: string; title: string; date: string; time: string; venue: string };

export type SyncResult = { added: string[]; updated: string[]; errors: string[] };

async function get(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "AntiguasVanguardias-sync/1.0", "Accept-Language": "es-CL,es" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${url} respondió ${res.status}`);
  return res.text();
}

function eventUrls(html: string): string[] {
  const urls = new Set<string>();
  for (const [, json] of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json);
      if (data["@type"] !== "ItemList") continue;
      for (const item of data.itemListElement ?? []) {
        if (typeof item.url === "string" && /^https:\/\/feverup\.com\/m\/\d+$/.test(item.url)) urls.add(item.url);
      }
    } catch {
      // bloque que no es JSON válido: se ignora
    }
  }
  return [...urls];
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function parseEvent(url: string, html: string): FeverEvent | null {
  // "Candlelight: Lo Mejor de Hans Zimmer - Concepción | Fever"
  const fullTitle = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").replace(/ - [^-|]+\| Fever$/, "").trim();
  const start = html.match(/"startsAtIso":"(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  const venue = html.match(/"places":\[\{"address":"[^"]*",[\s\S]{0,800}?"name":"([^"]+)"/)?.[1];

  // Deja fuera tarjetas de regalo y otros productos que no son un concierto.
  if (!fullTitle.startsWith("Candlelight:") || !start || !venue) return null;

  return {
    id: url.split("/").pop()!,
    url,
    title: fullTitle.replace(/^Candlelight:\s*/, ""),
    date: start[1],
    time: start[2],
    venue: JSON.parse(`"${venue}"`),
  };
}

/**
 * Agrega los conciertos nuevos y actualiza fecha, hora, lugar y link de los que ya estaban.
 * No toca el título, "público/privado" ni las notas internas, por si el cuarteto los editó a mano.
 */
export async function syncFever(): Promise<SyncResult> {
  const result: SyncResult = { added: [], updated: [], errors: [] };
  const today = todayISO();

  for (const { city, url } of FEVER_CITIES) {
    // Fever a veces omite un evento al azar en su lista, así que se lee 3 veces y se juntan los resultados.
    const found = new Set<string>();
    for (let attempt = 0; attempt < LIST_READS; attempt++) {
      try {
        for (const u of eventUrls(await get(url))) found.add(u);
      } catch (e) {
        if (attempt === LIST_READS - 1 && found.size === 0) result.errors.push(`${city}: ${(e as Error).message}`);
      }
    }
    const urls = [...found];

    for (const eventUrl of urls) {
      try {
        const event = parseEvent(eventUrl, await get(eventUrl));
        if (!event || event.date < today) continue;

        const label = `${event.title} (${city}, ${event.date})`;
        const [existing] = await db
          .select()
          .from(concerts)
          .where(and(eq(concerts.source, "fever"), eq(concerts.externalId, event.id)));

        const fromFever = { date: event.date, time: event.time, venue: event.venue, city, ticketUrl: event.url };
        if (!existing) {
          await db.insert(concerts).values({
            ...fromFever,
            title: event.title,
            organizer: "Candlelight",
            isPublic: true,
            source: "fever",
            externalId: event.id,
          });
          result.added.push(label);
        } else if (Object.entries(fromFever).some(([k, v]) => existing[k as keyof typeof fromFever] !== v)) {
          await db.update(concerts).set(fromFever).where(eq(concerts.id, existing.id));
          result.updated.push(label);
        }
      } catch (e) {
        result.errors.push(`${eventUrl}: ${(e as Error).message}`);
      }
    }
  }

  return result;
}
