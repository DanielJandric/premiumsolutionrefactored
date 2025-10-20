import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "ps-collaborator-session";

function getPortalSecret() {
  const secret = process.env.COLLAB_PORTAL_PASSWORD;
  if (!secret) {
    throw new Error(
      "COLLAB_PORTAL_PASSWORD n'est pas défini. Ajoutez-le à votre fichier .env pour activer l'espace collaborateurs.",
    );
  }
  return secret;
}

function deriveSessionSignature() {
  const secret = getPortalSecret();
  return createHash("sha256").update(secret).digest("hex");
}

export async function isCollaboratorAuthenticated() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) {
    return false;
  }

  try {
    const expected = Buffer.from(deriveSessionSignature(), "hex");
    const received = Buffer.from(cookie.value, "hex");
    return (
      expected.length === received.length &&
      timingSafeEqual(expected, received)
    );
  } catch {
    return false;
  }
}

export async function createCollaboratorSession(password: string) {
  const expectedSignature = deriveSessionSignature();
  const providedSignature = createHash("sha256")
    .update(password)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const providedBuffer = Buffer.from(providedSignature, "hex");

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, expectedSignature, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 heures
  });

  return true;
}

export async function clearCollaboratorSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
