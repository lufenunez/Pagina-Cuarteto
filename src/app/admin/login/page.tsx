import type { Metadata } from "next";
import { adminHref } from "@/lib/admin-path";
import { redirect } from "next/navigation";
import { passwordMatches, startSession } from "@/lib/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Acceso cuarteto" };

async function login(form: FormData) {
  "use server";
  if (!passwordMatches(String(form.get("password") ?? ""))) redirect(adminHref("/login?error=1"));
  await startSession();
  redirect(adminHref());
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form action={login} className="w-full max-w-sm">
        <p className="font-serif text-xl text-muted">{site.name}</p>
        <h1 className="mt-3 mb-8 font-serif text-4xl">Acceso cuarteto</h1>
        <label htmlFor="password" className="label">
          Contraseña
        </label>
        <input id="password" name="password" type="password" required autoFocus className="field" />
        {error && <p className="mt-3 text-sm text-danger">Contraseña incorrecta.</p>}
        <button type="submit" className="btn mt-6 w-full">
          Entrar
        </button>
      </form>
    </div>
  );
}
