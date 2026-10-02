import { a as gt, i as eq, r as and } from "../_libs/drizzle-orm.mjs";
import { a as ensureDatabaseInitialized, i as db, r as authSessions, t as __exportAll } from "./init-DEOmme2k.mjs";
import { createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/session-CW2Txe2V.js
var session_exports = /* @__PURE__ */ __exportAll({
	clearedSessionCookie: () => clearedSessionCookie,
	createAuthSession: () => createAuthSession,
	destroyAuthSession: () => destroyAuthSession,
	getSessionId: () => getSessionId,
	getSessionUserId: () => getSessionUserId,
	readSessionToken: () => readSessionToken,
	sessionCookie: () => sessionCookie
});
var SESSION_COOKIE = "madrasa_session";
var SESSION_TTL_SECONDS = 604800;
function readSessionToken(cookieHeader) {
	if (!cookieHeader) return null;
	for (const part of cookieHeader.split(/;\s*/)) {
		const equalsAt = part.indexOf("=");
		if (equalsAt < 0 || part.slice(0, equalsAt) !== SESSION_COOKIE) continue;
		return decodeURIComponent(part.slice(equalsAt + 1));
	}
	return null;
}
function getSessionId(context) {
	return context.sessionId ?? null;
}
function hashToken(token) {
	return createHash("sha256").update(token).digest("hex");
}
async function createAuthSession(userId) {
	await ensureDatabaseInitialized();
	const token = randomBytes(32).toString("base64url");
	const now = /* @__PURE__ */ new Date();
	await db.insert(authSessions).values({
		tokenHash: hashToken(token),
		userId,
		expiresAt: new Date(now.getTime() + SESSION_TTL_SECONDS * 1e3),
		createdAt: now
	});
	return token;
}
async function getSessionUserId(cookieHeader) {
	const token = readSessionToken(cookieHeader);
	if (!token) return null;
	await ensureDatabaseInitialized();
	return (await db.select().from(authSessions).where(and(eq(authSessions.tokenHash, hashToken(token)), gt(authSessions.expiresAt, /* @__PURE__ */ new Date()))).then((rows) => rows[0]))?.userId ?? null;
}
async function destroyAuthSession(token) {
	if (!token) return;
	await ensureDatabaseInitialized();
	await db.delete(authSessions).where(eq(authSessions.tokenHash, hashToken(token)));
}
function sessionCookie(token) {
	return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}; Secure`;
}
function clearedSessionCookie() {
	return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`;
}
//#endregion
export { session_exports as n, getSessionId as t };
