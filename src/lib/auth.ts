import { timingSafeEqual } from "node:crypto";
import { adminHref } from "@/lib/admin-path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_DAYS, signSessionToken, verifySessionToken } from "./session-token";

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Falta ADMIN_PASSWORD en las variables de entorno");
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function startSession() {
  (await cookies()).set(SESSION_COOKIE, await signSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isLoggedIn() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Toda acción que modifica datos la llama, aunque el middleware ya proteja el área interna. */
export async function requireAuth() {
  if (!(await isLoggedIn())) redirect(adminHref("/login"));
}
