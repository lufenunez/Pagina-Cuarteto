import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_BASE } from "@/lib/admin-path";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

const INTERNAL = "/admin";

const isUnder = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Con una ruta secreta configurada, /admin no existe para quien lo pruebe directamente.
  if (ADMIN_BASE !== INTERNAL && isUnder(pathname, INTERNAL)) {
    return NextResponse.rewrite(new URL("/no-encontrado", request.url));
  }
  if (!isUnder(pathname, ADMIN_BASE)) return NextResponse.next();

  const internalPath = INTERNAL + pathname.slice(ADMIN_BASE.length);
  const loggedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (internalPath !== `${INTERNAL}/login` && !loggedIn) {
    return NextResponse.redirect(new URL(`${ADMIN_BASE}/login`, request.url));
  }

  return ADMIN_BASE === INTERNAL
    ? NextResponse.next()
    : NextResponse.rewrite(new URL(internalPath + search, request.url));
}

// Todo menos archivos estáticos, fotos y la ruta del cron (que tiene su propia clave).
export const config = { matcher: ["/((?!_next/|fotos/|api/|favicon.ico).*)"] };
