import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-serif text-lg text-parchment">{site.name}</p>
          <p>Cuarteto de cuerdas · {site.city}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {site.email && (
            <a href={`mailto:${site.email}`} className="hover:text-gold-bright">
              {site.email}
            </a>
          )}
          <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-gold-bright">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
