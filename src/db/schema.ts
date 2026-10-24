import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const concerts = sqliteTable("concerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  organizer: text("organizer"),
  // Fecha y hora locales de Chile, guardadas como texto: "2026-11-14" y "20:30".
  date: text("date").notNull(),
  time: text("time"),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  ticketUrl: text("ticket_url"),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
  notes: text("notes"),
  // Conciertos importados automáticamente: source = "fever", externalId = id del evento en Fever.
  source: text("source"),
  externalId: text("external_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const songs = sqliteTable("songs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artist: text("artist"),
  // Encabezado bajo el que aparece la canción: el artista ("Queen") o la obra ("Gladiator").
  work: text("work").notNull(),
  category: text("category").notNull(),
  section: text("section"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Concert = typeof concerts.$inferSelect;
export type Song = typeof songs.$inferSelect;
