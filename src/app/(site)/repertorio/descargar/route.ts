import { renderToBuffer } from "@react-pdf/renderer";
import { RepertoirePdf } from "@/components/repertoire-pdf";
import { longDate, todayISO } from "@/lib/dates";
import { registerPdfFonts } from "@/lib/pdf-fonts";
import { getSongs } from "@/lib/queries";
import { groupSongs } from "@/lib/repertoire";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

// Genera el PDF del repertorio con los datos actuales y lo entrega como descarga.
export async function GET() {
  const songs = await getSongs();
  const japanese = await registerPdfFonts(songs.flatMap((s) => [s.title, s.work]));

  const pdf = await renderToBuffer(
    RepertoirePdf({
      groups: groupSongs(songs),
      total: songs.length,
      updated: longDate(todayISO()),
      name: site.name,
      footer: [site.name, site.city, site.email ?? `instagram.com/${site.instagramHandle.slice(1)}`].join(" · "),
      japanese,
    }),
  );

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Repertorio ${site.name} ${todayISO()}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
