import type { Song } from "@/db/schema";

// Orden en que aparecen las categorías; las que no estén aquí van al final, en orden alfabético.
export const CATEGORY_ORDER = ["Artistas", "Películas / Anime", "Televisión", "Videojuegos"];

export type WorkGroup = { work: string; songs: Song[] };
export type SectionGroup = { section: string | null; works: WorkGroup[] };
export type CategoryGroup = { category: string; count: number; sections: SectionGroup[] };

const compare = (a: string, b: string) => a.localeCompare(b, "es", { sensitivity: "base" });

const rank = (category: string) => {
  const i = CATEGORY_ORDER.indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
};

export function groupSongs(list: Song[]): CategoryGroup[] {
  const tree = new Map<string, Map<string, Map<string, Song[]>>>();
  for (const song of list) {
    const sections = tree.get(song.category) ?? new Map();
    tree.set(song.category, sections);
    const works = sections.get(song.section ?? "") ?? new Map();
    sections.set(song.section ?? "", works);
    works.set(song.work, [...(works.get(song.work) ?? []), song]);
  }

  return [...tree]
    .sort(([a], [b]) => rank(a) - rank(b) || compare(a, b))
    .map(([category, sections]) => ({
      category,
      count: [...sections.values()].reduce(
        (n, works) => n + [...works.values()].reduce((m, s) => m + s.length, 0),
        0,
      ),
      sections: [...sections]
        .sort(([a], [b]) => (a === "" ? -1 : b === "" ? 1 : compare(a, b)))
        .map(([section, works]) => ({
          section: section || null,
          works: [...works]
            .sort(([a], [b]) => compare(a, b))
            .map(([work, songs]) => ({ work, songs: songs.sort((x, y) => compare(x.title, y.title)) })),
        })),
    }));
}

/** El artista solo se muestra cuando aporta algo (en "Queen" no hace falta repetir "Queen"). */
export function artistLabel(song: Song, work: string): string | null {
  return song.artist && song.artist !== work ? song.artist : null;
}

export function slugify(text: string): string {
  return normalize(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function filterSongs(list: Song[], query: string): Song[] {
  const q = normalize(query.trim());
  if (!q) return list;
  return list.filter((s) =>
    [s.title, s.artist ?? "", s.work, s.section ?? ""].some((field) => normalize(field).includes(q)),
  );
}
