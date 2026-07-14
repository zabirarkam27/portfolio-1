import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

import { prisma } from "@/lib/prisma";

const sessionCookie = "portfolio_admin_session";
const sessionMaxAge = 60 * 60 * 24 * 7;

function authSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required for dashboard authentication");
  }

  return secret;
}

function shouldUseSecureCookies() {
  return process.env.NODE_ENV === "production" && process.env.VERCEL === "1";
}

function sign(value: string) {
  return createHmac("sha256", authSecret()).update(value).digest("hex");
}

function encodeSession(payload: { adminId: string; email: string; exp: number }) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeSession(value: string | undefined) {
  if (!value) return null;

  const [body, signature] = value.split(".");
  if (!body || !signature || sign(body) !== signature) return null;

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
    adminId: string;
    email: string;
    exp: number;
  };

  if (payload.exp < Date.now()) return null;
  return payload;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 210_000, 64, "sha512").toString("hex");

  return `pbkdf2$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, salt, hash] = storedHash.split("$");
  if (scheme !== "pbkdf2" || !salt || !hash) return false;

  const candidate = pbkdf2Sync(password, salt, 210_000, 64, "sha512");
  const stored = Buffer.from(hash, "hex");

  return stored.length === candidate.length && timingSafeEqual(stored, candidate);
}

export async function getOrCreateAdmin() {
  const envEmail = process.env.ADMIN_EMAIL ?? "zabirarkam27@gmail.com";
  const existing = await prisma.adminAccount.findFirst({ orderBy: { createdAt: "asc" } });

  if (existing) {
    return existing;
  }

  return prisma.adminAccount.create({
    data: {
      email: envEmail,
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "ChangeMe123!"),
    },
  });
}

export async function getSessionAdmin() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(sessionCookie)?.value);

  if (!session) return null;

  return prisma.adminAccount.findUnique({
    where: { id: session.adminId },
  });
}

export async function requireAdmin() {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/dashboard/login");
  return admin;
}

export async function requireAdminForApi() {
  const admin = await getSessionAdmin();
  if (!admin) {
    return null;
  }

  return admin;
}

export async function setAdminSession(admin: { id: string; email: string }) {
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie,
    encodeSession({
      adminId: admin.id,
      email: admin.email,
      exp: Date.now() + sessionMaxAge * 1000,
    }),
    {
      httpOnly: true,
      maxAge: sessionMaxAge,
      path: "/",
      sameSite: "lax",
      secure: shouldUseSecureCookies(),
    },
  );
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie);
}

export function verifyChangeCode(code: string) {
  const expected = process.env.ADMIN_CHANGE_CODE;

  if (!expected) {
    throw new Error("ADMIN_CHANGE_CODE is required before changing credentials");
  }

  if (code !== expected) {
    throw new Error("Invalid verification code");
  }
}
