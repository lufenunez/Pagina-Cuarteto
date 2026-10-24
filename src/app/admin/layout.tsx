import type { Metadata } from "next";
import { adminHref } from "@/lib/admin-path";
import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";
import { site } from "@/lib/site";
import { logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isLoggedIn())) return children;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-ink-2">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link href={adminHref()} className="font-serif text-lg">
            {site.name} <span className="text-muted">· interno</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-5 text-[0.7rem] font-medium tracking-[0.18em] text-muted uppercase">
            <Link href={adminHref()} className="hover:text-gold-bright">
              Conciertos
            </Link>
            <Link href={adminHref("/repertorio")} className="hover:text-gold-bright">
              Repertorio
            </Link>
            <Link href="/" target="_blank" className="hover:text-gold-bright">
              Ver sitio ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="tracking-[0.18em] uppercase hover:text-gold-bright">
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
