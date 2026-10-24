import { notFound } from "next/navigation";
import { deleteConcert } from "@/app/admin/actions";
import { ConcertForm } from "@/components/concert-form";
import { ConfirmButton } from "@/components/confirm-button";
import { getConcert } from "@/lib/queries";

export default async function EditConcertPage({ params }: { params: Promise<{ id: string }> }) {
  const concert = await getConcert(Number((await params).id));
  if (!concert) notFound();

  return (
    <>
      <h1 className="mb-8 font-serif text-4xl">Editar concierto</h1>
      <ConcertForm concert={concert} />
      <form action={deleteConcert} className="mt-16 border-t border-line pt-6">
        <input type="hidden" name="id" value={concert.id} />
        <ConfirmButton message={`¿Eliminar "${concert.title}" para siempre?`}>Eliminar concierto</ConfirmButton>
      </form>
    </>
  );
}
