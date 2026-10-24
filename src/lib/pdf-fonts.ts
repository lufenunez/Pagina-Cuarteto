// Fuentes para el PDF del repertorio, descargadas desde Google Fonts como TTF (el formato que usa @react-pdf).
// La fuente japonesa se pide recortada solo a los caracteres que aparecen en el repertorio,
// así pesa unos pocos KB en vez de varios MB, y siempre incluye los kanji de canciones nuevas.
import { Font } from "@react-pdf/renderer";

export const CJK = /[　-ヿ㐀-鿿＀-￯]+/g;

type FontFace = { src: string; fontWeight: number; fontStyle: "normal" | "italic" };

async function fontFaces(cssUrl: string): Promise<FontFace[]> {
  const res = await fetch(cssUrl, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Google Fonts respondió ${res.status}`);
  const css = await res.text();
  return [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, block]) => ({
    src: block.match(/src: url\(([^)]+)\) format\('truetype'\)/)![1],
    fontWeight: Number(block.match(/font-weight: (\d+)/)?.[1] ?? 400),
    fontStyle: block.includes("font-style: italic") ? "italic" : "normal",
  }));
}

let baseFonts: Promise<void> | null = null;

function registerBaseFonts() {
  baseFonts ??= (async () => {
    Font.register({
      family: "Cormorant",
      fonts: await fontFaces("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,600"),
    });
    Font.register({
      family: "Hanken",
      fonts: await fontFaces("https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500"),
    });
    // Sin esto, @react-pdf corta las palabras con guiones a la inglesa.
    Font.registerHyphenationCallback((word) => [word]);
  })().catch((e) => {
    baseFonts = null;
    throw e;
  });
  return baseFonts;
}

const japaneseFamilies = new Map<string, string>();

/** Registra las fuentes y devuelve el nombre de la familia japonesa para estos textos (o null si no hay japonés). */
export async function registerPdfFonts(texts: string[]): Promise<string | null> {
  await registerBaseFonts();

  const chars = [...new Set(texts.join("").match(CJK)?.join("") ?? "")].sort().join("");
  if (!chars) return null;

  let family = japaneseFamilies.get(chars);
  if (!family) {
    const [face] = await fontFaces(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP&text=${encodeURIComponent(chars)}`,
    );
    family = `NotoSansJP-${japaneseFamilies.size + 1}`;
    Font.register({ family, src: face.src });
    japaneseFamilies.set(chars, family);
  }
  return family;
}
