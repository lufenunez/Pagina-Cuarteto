import { notFound } from "next/navigation";
import { deleteSong } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/confirm-button";
import { SongForm } from "@/components/song-form";
import { getSong, getSongs } from "@/lib/queries";

export default async function EditSongPage({ params }: { params: Promise<{ id: string }> }) {
  const [song, allSongs] = await Promise.all([getSong(Number((await params).id)), getSongs({ includeInactive: true })]);
  if (!song) notFound();

  return (
    <>
      <h1 className="mb-8 font-serif text-4xl">Editar canción</h1>
      <SongForm song={song} allSongs={allSongs} />
      <form action={deleteSong} className="mt-16 border-t border-line pt-6">
        <input type="hidden" name="id" value={song.id} />
        <ConfirmButton message={`¿Eliminar "${song.title}" del repertorio?`}>Eliminar canción</ConfirmButton>
      </form>
    </>
  );
}
