"use server";

import { eq } from "drizzle-orm";
import { adminHref } from "@/lib/admin-path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { concerts, songs } from "@/db/schema";
import { endSession, requireAuth } from "@/lib/auth";
import { syncFever } from "@/lib/fever";

function text(form: FormData, key: string): string | null {
  const value = String(form.get(key) ?? "").trim();
  return value || null;
}

function required(form: FormData, key: string): string {
  const value = text(form, key);
  if (!value) throw new Error(`Falta el campo "${key}"`);
  return value;
}

function id(form: FormData): number | null {
  const value = Number(form.get("id"));
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function saveConcert(form: FormData) {
  await requireAuth();

  const date = required(form, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Fecha inválida");
  const ticketUrl = text(form, "ticketUrl");
  if (ticketUrl && !/^https?:\/\//.test(ticketUrl)) throw new Error("El link de entradas debe empezar con https://");

  const values = {
    title: required(form, "title"),
    organizer: text(form, "organizer"),
    date,
    time: text(form, "time"),
    venue: required(form, "venue"),
    city: required(form, "city"),
    ticketUrl,
    isPublic: form.get("isPublic") === "on",
    notes: text(form, "notes"),
  };

  const concertId = id(form);
  if (concertId) await db.update(concerts).set(values).where(eq(concerts.id, concertId));
  else await db.insert(concerts).values(values);

  revalidatePath("/", "layout");
  redirect(adminHref());
}

export async function deleteConcert(form: FormData) {
  await requireAuth();
  const concertId = id(form);
  if (concertId) await db.delete(concerts).where(eq(concerts.id, concertId));
  revalidatePath("/", "layout");
  redirect(adminHref());
}

export async function saveSong(form: FormData) {
  await requireAuth();

  const values = {
    title: required(form, "title"),
    artist: text(form, "artist"),
    work: required(form, "work"),
    category: required(form, "category"),
    section: text(form, "section"),
    active: form.get("active") === "on",
  };

  const songId = id(form);
  if (songId) await db.update(songs).set(values).where(eq(songs.id, songId));
  else await db.insert(songs).values(values);

  revalidatePath("/", "layout");
  redirect(adminHref(songId ? "/repertorio" : "/repertorio?agregada=1"));
}

export async function deleteSong(form: FormData) {
  await requireAuth();
  const songId = id(form);
  if (songId) await db.delete(songs).where(eq(songs.id, songId));
  revalidatePath("/", "layout");
  redirect(adminHref("/repertorio"));
}

export async function syncFeverNow() {
  await requireAuth();
  const { added, updated, errors } = await syncFever();
  revalidatePath("/", "layout");
  redirect(adminHref(`?fever=${added.length}-${updated.length}-${errors.length}`));
}

export async function logout() {
  await endSession();
  redirect(adminHref("/login"));
}
