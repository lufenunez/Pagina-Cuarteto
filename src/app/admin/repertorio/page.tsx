import Link from "next/link";
import { adminHref } from "@/lib/admin-path";
import { SongForm } from "@/components/song-form";
import { getSongs } from "@/lib/queries";
import { artistLabel, groupSongs } from "@/lib/repertoire";

export default async function AdminRepertoirePage({ searchParams }: { searchParams: Promise<{ agregada?: string }> }) {
  const { agregada } = await searchParams;
  const songs = await getSongs({ includeInactive: true });
  const groups = groupSongs(songs);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{songs.filter((s) => s.active).length} obras activas</p>
          <h1 className="mt-2 font-serif text-4xl">Repertorio</h1>
        </div>
        <a href="/repertorio/descargar" download className="btn-ghost">
          Descargar PDF
        </a>
      </div>

      <section className="mt-8 border border-line bg-ink-2 p-5 sm:p-6">
        <h2 className="mb-5 font-serif text-2xl">Agregar canción</h2>
        {agregada && <p className="mb-4 text-sm text-gold-bright">Canción agregada.</p>}
        <SongForm allSongs={songs} />
      </section>

      {groups.map((g) => (
        <section key={g.category} className="mt-12">
          <h2 className="border-b border-line pb-2 font-serif text-3xl">
            {g.category} <span className="text-base text-muted">({g.count})</span>
          </h2>
          {g.sections.map((s) => (
            <div key={s.section ?? ""}>
              {s.section && <h3 className="mt-6 font-serif text-xl text-muted">{s.section}</h3>}
              {s.works.map((w) => (
                <div key={w.work} className="mt-5">
                  <h3 className="font-serif text-xl text-gold-bright italic">{w.work}</h3>
                  <ul>
                    {w.songs.map((song) => (
                      <li key={song.id}>
                        <Link
                          href={adminHref(`/repertorio/${song.id}`)}
                          className={`flex justify-between gap-4 border-b border-line/50 px-1 py-1.5 text-sm hover:bg-ink-2 ${song.active ? "" : "text-muted/50 line-through"}`}
                        >
                          <span>{song.title}</span>
                          <span className="text-muted">{artistLabel(song, w.work)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
