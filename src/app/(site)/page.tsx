import Image from "next/image";
import Link from "next/link";
import { ConcertRow } from "@/components/concert-row";
import { getSongs, getUpcomingConcerts } from "@/lib/queries";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const HOME_CONCERTS = 4;

// ["Concepción", "Chillán", "Puerto Montt"] -> "Concepción, Chillán y Puerto Montt"
const listCities = (cities: string[]) => new Intl.ListFormat("es", { type: "conjunction" }).format(cities);

export default async function HomePage() {
  const [concerts, songs] = await Promise.all([getUpcomingConcerts(), getSongs()]);

  return (
    <>
      {/* Celular: foto arriba y texto debajo. Pantalla grande: texto a la izquierda, foto a la derecha. */}
      <section className="relative isolate overflow-hidden md:flex md:min-h-[100svh] md:items-center">
        <div className="hero-photo relative -z-10 mt-24 aspect-[4/5] w-full md:absolute md:inset-y-0 md:right-0 md:mt-0 md:aspect-auto md:h-full md:w-[58%]">
          <Image
            src={site.photos.hero}
            alt="Antiguas Vanguardias: Abigail, Jesús, Flavio y Luis con sus instrumentos"
            fill
            priority
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover object-[50%_15%]"
          />
        </div>
        <div className="mx-auto -mt-14 w-full max-w-6xl px-4 pb-16 sm:px-8 md:mt-0 md:pt-40 md:pb-0">
          <h1 className="max-w-xl font-serif text-[clamp(2.9rem,6.5vw,5.75rem)] leading-[0.95] font-normal text-balance">
            Canciones que conoces, <em className="text-gold-bright">como nunca</em> las escuchaste.
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Somos un cuarteto de cuerdas de Concepción. Nos puedes escuchar en los conciertos Candlelight y también
            contratarnos para tu matrimonio, empresa o celebración.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="#fechas" className="btn">
              Próximas fechas
            </Link>
            <Link href="#eventos" className="btn-ghost">
              Contrátanos
            </Link>
          </div>
        </div>
      </section>

      <section id="fechas" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-24 sm:px-8">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
          <h2 className="font-serif text-4xl sm:text-5xl">Próximas fechas</h2>
          {concerts.length > HOME_CONCERTS && (
            <Link href="/fechas" className="link shrink-0 text-sm">
              Ver todas
            </Link>
          )}
        </div>
        {concerts.length > 0 ? (
          <ul>
            {concerts.slice(0, HOME_CONCERTS).map((c) => (
              <ConcertRow key={c.id} concert={c} />
            ))}
          </ul>
        ) : null}
        {concerts.length > HOME_CONCERTS && (
          <Link href="/fechas" className="btn-ghost mt-10">
            Ver las {concerts.length} fechas
          </Link>
        )}
        {concerts.length === 0 && (
          <p className="py-12 text-muted">
            Pronto anunciaremos nuevas fechas. Síguenos en{" "}
            <a href={site.instagram} className="link" target="_blank" rel="noreferrer">
              Instagram
            </a>{" "}
            para enterarte primero.
          </p>
        )}
      </section>

      <section id="eventos" className="scroll-mt-8 border-y border-line bg-ink-2">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-8 md:grid-cols-[1fr_1.3fr] md:gap-20">
          <div>
            <h2 className="font-serif text-4xl text-balance sm:text-5xl">También en tu evento</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Muchos nos conocen por Candlelight, pero gran parte de lo que hacemos son eventos privados. Armamos el
              programa contigo, desde nuestro repertorio o con arreglos a pedido.
            </p>
            <p className="mt-5 text-sm text-muted">
              Tocamos en <span className="text-parchment">{listCities(site.cities)}</span>.
            </p>
            <Link href="#contacto" className="btn mt-8">
              Cotiza tu evento
            </Link>
          </div>
          <ul className="border-t border-line">
            {site.services.map((s) => (
              <li key={s.title} className="border-b border-line py-6">
                <h3 className="font-serif text-2xl sm:text-3xl">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="cuarteto" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-24 sm:px-8">
        <h2 className="border-b border-line pb-6 font-serif text-4xl sm:text-5xl">El cuarteto</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
          {site.members.map((m) => (
            <li key={m.name}>
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                <Image
                  src={m.photo}
                  alt={`${m.name}, ${m.instrument.toLowerCase()}`}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover object-[50%_18%] transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
              <p className="mt-4 font-serif text-2xl">{m.name}</p>
              <p className="text-sm text-muted">{m.instrument}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-ink-2">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-8 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl">Repertorio</h2>
            <p className="mt-5 leading-relaxed text-muted">
              {songs.length} obras de pop, rock, cine, anime y videojuegos, y seguimos sumando.
            </p>
            <Link href="/repertorio" className="btn-ghost mt-8">
              Ver repertorio completo
            </Link>
          </div>
          <ul className="flex flex-wrap content-start gap-x-3 gap-y-1 font-serif text-3xl leading-snug text-parchment/85 sm:text-4xl">
            {site.featured.map((work, i) => (
              <li key={work} className="whitespace-nowrap">
                {work}
                {i < site.featured.length - 1 && <span className="ml-3 text-gold">·</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="contacto"
        className="mx-auto grid max-w-6xl scroll-mt-8 items-center gap-12 px-4 py-24 sm:px-8 md:grid-cols-[1.2fr_1fr]"
      >
        <div>
          <h2 className="max-w-3xl font-serif text-4xl text-balance sm:text-5xl">¿Tienes una fecha en mente?</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">
            Cuéntanos la fecha, la ciudad y la música que te gustaría escuchar. Te respondemos con una propuesta.
          </p>
          <a
            href={site.email ? `mailto:${site.email}` : site.instagram}
            {...(site.email ? {} : { target: "_blank", rel: "noreferrer" })}
            className="mt-10 inline-block font-serif text-2xl break-all text-gold-bright underline decoration-gold/40 underline-offset-8 hover:decoration-gold-bright sm:text-3xl"
          >
            {site.email ?? site.instagramHandle}
          </a>
          {!site.email && <p className="mt-3 text-sm text-muted">Escríbenos por mensaje directo en Instagram.</p>}
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={site.photos.contact}
            alt="El cuarteto posando con sus instrumentos"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover object-[50%_20%]"
          />
        </div>
      </section>
    </>
  );
}
