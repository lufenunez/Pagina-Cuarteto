import { Document, type DocumentProps, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { CategoryGroup } from "@/lib/repertoire";
import { artistLabel } from "@/lib/repertoire";
import { CJK } from "@/lib/pdf-fonts";

const INK = "#1f1a15";
const MUTED = "#6b6157";
const GOLD = "#9a7642";
const RULE = "#d9cfc0";

const s = StyleSheet.create({
  page: { paddingTop: 46, paddingBottom: 56, paddingHorizontal: 50, fontFamily: "Hanken", fontSize: 9, color: INK },
  name: { fontFamily: "Cormorant", fontWeight: 600, fontSize: 12, color: GOLD },
  title: { fontFamily: "Cormorant", fontWeight: 500, fontSize: 34, marginTop: 2 },
  meta: { fontSize: 8.5, color: MUTED, marginTop: 4 },
  headerRule: { borderBottomWidth: 1.5, borderBottomColor: GOLD, marginTop: 14, marginBottom: 6 },
  category: {
    fontFamily: "Cormorant",
    fontWeight: 600,
    fontSize: 18,
    marginTop: 18,
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  section: { fontFamily: "Cormorant", fontWeight: 600, fontStyle: "italic", fontSize: 12, color: MUTED, marginTop: 10 },
  work: { fontFamily: "Cormorant", fontWeight: 600, fontStyle: "italic", fontSize: 12.5, marginTop: 9, marginBottom: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 1.6 },
  song: { flex: 1, paddingRight: 12 },
  artist: { width: "38%", color: "#8a5a2b" },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: MUTED,
  },
});

/** Escribe los tramos en japonés con la fuente japonesa y el resto con la normal. */
function Mixed({ text, japanese }: { text: string; japanese: string | null }) {
  if (!japanese) return <>{text}</>;
  const parts = text.split(new RegExp(`(${CJK.source})`)).filter(Boolean);
  const isJapanese = new RegExp(`^${CJK.source}$`);
  return (
    <>
      {parts.map((part, i) =>
        isJapanese.test(part) ? (
          <Text key={i} style={{ fontFamily: japanese }}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </>
  );
}

// Devuelve directamente el <Document>, que es lo que espera renderToBuffer.
export function RepertoirePdf({
  groups,
  total,
  updated,
  name,
  footer,
  japanese,
}: {
  groups: CategoryGroup[];
  total: number;
  updated: string;
  name: string;
  footer: string;
  japanese: string | null;
}): ReactElement<DocumentProps> {
  return (
    <Document title={`Repertorio ${name}`} author={name} language="es">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{name}</Text>
        <Text style={s.title}>Repertorio</Text>
        <Text style={s.meta}>
          {total} obras · actualizado el {updated}
        </Text>
        <View style={s.headerRule} />

        {groups.map((g) => (
          <View key={g.category}>
            <Text style={s.category} minPresenceAhead={60}>
              {g.category}
            </Text>
            {g.sections.map((sec) => (
              <View key={sec.section ?? ""}>
                {sec.section && (
                  <Text style={s.section} minPresenceAhead={40}>
                    {sec.section}
                  </Text>
                )}
                {sec.works.map((w) => (
                  // wrap={false}: el nombre de la obra nunca queda solo al final de una página
                  <View key={w.work} wrap={false}>
                    <Text style={s.work}>
                      <Mixed text={w.work} japanese={japanese} />
                    </Text>
                    {w.songs.map((song) => (
                      <View key={song.id} style={s.row}>
                        <Text style={s.song}>
                          <Mixed text={song.title} japanese={japanese} />
                        </Text>
                        <Text style={s.artist}>{artistLabel(song, w.work) ?? ""}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text>{footer}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
