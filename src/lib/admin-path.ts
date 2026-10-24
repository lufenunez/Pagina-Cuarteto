// Dirección pública del área interna. El código vive en src/app/admin, pero desde afuera solo se entra por
// ADMIN_PATH (por ejemplo "/camerino-x7k2"); "/admin" responde "no encontrado" (ver src/middleware.ts).
// Sin ADMIN_PATH, el área interna queda en "/admin", como en desarrollo.
export const ADMIN_BASE = `/${(process.env.ADMIN_PATH ?? "admin").replace(/^\/+|\/+$/g, "") || "admin"}`;

/** adminHref("/repertorio") -> "/camerino-x7k2/repertorio" */
export const adminHref = (path = "") => `${ADMIN_BASE}${path}`;
