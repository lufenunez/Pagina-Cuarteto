import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/fechas", label: "Fechas" },
  { href: "/#eventos", label: "Eventos" },
  { href: "/#cuarteto", label: "Cuarteto" },
  { href: "/repertorio", label: "Repertorio" },
  // En celular no cabe: ahí se llega a contacto desde los botones de la portada.
  { href: "/#contacto", label: "Contacto", desktopOnly: true },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-6 sm:px-8">
        <Link href="/" className="font-serif text-xl tracking-[0.08em] text-parchment">
          {site.name}
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[0.65rem] font-medium tracking-[0.16em] text-muted uppercase sm:gap-6 sm:text-[0.7rem] sm:tracking-[0.22em]">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-gold-bright ${"desktopOnly" in item ? "hidden sm:inline" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
