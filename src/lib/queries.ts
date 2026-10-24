import { and, asc, desc, eq, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import { concerts, songs } from "@/db/schema";
import { todayISO } from "./dates";

/** Conciertos de hoy en adelante. Los pasados no se borran: solo dejan de aparecer aquí. */
export async function getUpcomingConcerts({ includePrivate = false } = {}) {
  const upcoming = gte(concerts.date, todayISO());
  return db
    .select()
    .from(concerts)
    .where(includePrivate ? upcoming : and(upcoming, eq(concerts.isPublic, true)))
    .orderBy(asc(concerts.date), asc(concerts.time));
}

export async function getPastConcerts() {
  return db
    .select()
    .from(concerts)
    .where(lt(concerts.date, todayISO()))
    .orderBy(desc(concerts.date), desc(concerts.time));
}

export async function getConcert(id: number) {
  const [row] = await db.select().from(concerts).where(eq(concerts.id, id));
  return row;
}

export async function getSongs({ includeInactive = false } = {}) {
  const query = db.select().from(songs);
  return includeInactive ? query : query.where(eq(songs.active, true));
}

export async function getSong(id: number) {
  const [row] = await db.select().from(songs).where(eq(songs.id, id));
  return row;
}
