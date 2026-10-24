import { jwtVerify, SignJWT } from "jose";

// Sin imports de Next para que también funcione en el middleware.
export const SESSION_COOKIE = "av_session";
export const SESSION_DAYS = 30;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("Falta SESSION_SECRET en las variables de entorno");
  return new TextEncoder().encode(value);
}

export function signSessionToken() {
  return new SignJWT({ role: "cuarteto" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}
