import type { Metadata } from "next";
import { RepertoireBrowser } from "@/components/repertoire-browser";
import { getSongs } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Repertorio" };

export default async function RepertorioPage() {
  const songs = await getSongs();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-serif text-5xl sm:text-7xl">Repertorio</h1>
        <a href="/repertorio/descargar" download className="btn-ghost">
          Descargar PDF
        </a>
      </div>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted">
        {songs.length} obras y contando. Si buscas una canción que no está en la lista, escríbenos: hacemos
        arreglos a pedido.
      </p>
      <RepertoireBrowser songs={songs} />
    </div>
  );
}
