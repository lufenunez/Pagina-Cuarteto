const TIME_ZONE = "America/Santiago";

/** Fecha de hoy en Chile como "YYYY-MM-DD", para comparar con concerts.date. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// Las fechas se guardan sin zona horaria; se formatean en UTC a mediodía para que no se corran de día.
function parse(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

function format(date: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("es-CL", { timeZone: "UTC", ...options })
    .format(parse(date))
    .replace(".", "");
}

export const dayNumber = (date: string) => format(date, { day: "numeric" });
export const monthShort = (date: string) => format(date, { month: "short" });
export const weekdayShort = (date: string) => format(date, { weekday: "short" });
export const monthKey = (date: string) => date.slice(0, 7);
export const monthTitle = (date: string) => format(date, { month: "long", year: "numeric" }).replace(" de ", " ");
export const longDate = (date: string) =>
  format(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
