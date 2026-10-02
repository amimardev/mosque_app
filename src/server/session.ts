import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { ensureDatabaseInitialized } from '../db/init.js';

const SESSION_COOKIE = 'madrasa_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export function readSessionToken(cookieHeader?: string | null): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(/;\s*/)) {
    const equalsAt = part.indexOf('=');
    if (equalsAt < 0 || part.slice(0, equalsAt) !== SESSION_COOKIE) continue;
    return decodeURIComponent(part.slice(equalsAt + 1));
  }
  return null;
}

export function getSessionId(context: { sessionId?: string | null }) {
  return context.sessionId ?? null;
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createAuthSession(userId: string) {
  await ensureDatabaseInitialized();
  const token = randomBytes(32).toString('base64url');
  const now = new Date();
  await db.insert(schema.authSessions).values({
    tokenHash: hashToken(token),
    userId,
    expiresAt: new Date(now.getTime() + SESSION_TTL_SECONDS * 1000),
    createdAt: now,
  });
  return token;
}

export async function getSessionUserId(cookieHeader?: string | null) {
  const token = readSessionToken(cookieHeader);
  if (!token) return null;
  await ensureDatabaseInitialized();
  const session = await db.select().from(schema.authSessions).where(
    and(eq(schema.authSessions.tokenHash, hashToken(token)), gt(schema.authSessions.expiresAt, new Date())),
  ).then((rows) => rows[0]);
  return session?.userId ?? null;
}

export async function destroyAuthSession(token: string | null | undefined) {
  if (!token) return;
  await ensureDatabaseInitialized();
  await db.delete(schema.authSessions).where(eq(schema.authSessions.tokenHash, hashToken(token)));
}

export function sessionCookie(token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearedSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
