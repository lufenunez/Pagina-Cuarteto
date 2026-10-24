import Link from "next/link";
import { adminHref } from "@/lib/admin-path";
import { saveSong } from "@/app/admin/actions";
import type { Song } from "@/db/schema";
import { CATEGORY_ORDER } from "@/lib/repertoire";

const unique = (values: (string | null)[]) => [...new Set(values.filter(Boolean) as string[])].sort();

export function SongForm({ song, allSongs }: { song?: Song; allSongs: Song[] }) {
  const categories = unique([...CATEGORY_ORDER, ...allSongs.map((s) => s.category)]);

  return (
    <form action={saveSong} className="grid gap-5 sm:grid-cols-2">
      {song && <input type="hidden" name="id" value={song.id} />}

      <div>
        <label htmlFor="title" className="label">
          Canción *
        </label>
        <input id="title" name="title" required defaultValue={song?.title} placeholder="Bohemian Rhapsody" className="field" />
      </div>
      <div>
        <label htmlFor="artist" className="label">
          Artista / compositor
        </label>
        <input id="artist" name="artist" list="artists" defaultValue={song?.artist ?? ""} placeholder="Queen" className="field" />
      </div>
      <div>
        <label htmlFor="work" className="label">
          Aparece bajo *
        </label>
        <input
          id="work"
          name="work"
          list="works"
          required
          defaultValue={song?.work}
          placeholder="Queen, Gladiator, Zelda…"
          className="field"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="label">
            Categoría *
          </label>
          <input
            id="category"
            name="category"
            list="categories"
            required
            defaultValue={song?.category ?? "Artistas"}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="section" className="label">
            Subsección
          </label>
          <input
            id="section"
            name="section"
            list="sections"
            defaultValue={song?.section ?? ""}
            placeholder="Studio Ghibli"
            className="field"
          />
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm sm:col-span-2">
        <input type="checkbox" name="active" defaultChecked={song?.active ?? true} className="size-4 accent-gold" />
        En repertorio (desmarca para ocultarla sin borrarla)
      </label>

      <div className="flex items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn">
          {song ? "Guardar" : "Agregar canción"}
        </button>
        {song && (
          <Link href={adminHref("/repertorio")} className="btn-ghost">
            Cancelar
          </Link>
        )}
      </div>

      <datalist id="artists">
        {unique(allSongs.map((s) => s.artist)).map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
      <datalist id="works">
        {unique(allSongs.map((s) => s.work)).map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
      <datalist id="categories">
        {categories.map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
      <datalist id="sections">
        {unique(allSongs.map((s) => s.section)).map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
    </form>
  );
}
