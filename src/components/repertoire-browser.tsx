"use client";

import { useMemo, useState } from "react";
import type { Song } from "@/db/schema";
import { artistLabel, filterSongs, groupSongs, slugify } from "@/lib/repertoire";

export function RepertoireBrowser({ songs }: { songs: Song[] }) {
  const [query, setQuery] = useState("");
  const allGroups = useMemo(() => groupSongs(songs), [songs]);
  const groups = useMemo(() => groupSongs(filterSongs(songs, query)), [songs, query]);

  return (
    <div className="mt-14 grid gap-12 md:grid-cols-[13rem_1fr]">
      <aside className="md:sticky md:top-8 md:self-start">
        <label htmlFor="buscar" className="label">
          Buscar
        </label>
        <input
          id="buscar"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Canción, artista, película…"
          className="field"
        />
        <nav className="mt-8 hidden flex-col gap-3 text-sm md:flex">
          {allGroups.map((g) => (
            <a key={g.category} href={`#${slugify(g.category)}`} className="flex justify-between text-muted hover:text-gold-bright">
              <span>{g.category}</span>
              <span className="text-muted/50 tabular-nums">{g.count}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div>
        {groups.length === 0 && <p className="text-muted">No encontramos nada con “{query}”.</p>}
        {groups.map((g) => (
          <section key={g.category} id={slugify(g.category)} className="mb-20 scroll-mt-8">
            <h2 className="border-b border-line pb-4 font-serif text-4xl">{g.category}</h2>
            {g.sections.map((s) => (
              <div key={s.section ?? ""} className="mt-8">
                {s.section && <h3 className="mb-1 font-serif text-xl text-muted">{s.section}</h3>}
                <div className="gap-x-12 sm:columns-2">
                  {s.works.map((w) => (
                    <div key={w.work} className="break-inside-avoid pt-6">
                      <h3 className="font-serif text-2xl text-gold-bright italic">{w.work}</h3>
                      <ul className="mt-2">
                        {w.songs.map((song) => (
                          <li key={song.id} className="flex items-baseline justify-between gap-4 border-b border-line/60 py-1.5 text-[0.95rem]">
                            <span>{song.title}</span>
                            {artistLabel(song, w.work) && (
                              <span className="shrink-0 text-xs text-muted">{artistLabel(song, w.work)}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
