import { n as createServerFn } from "./ssr.mjs";
import { a as string, r as object } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Dd842mWe.js
var getCurrentUserFn_createServerFn_handler = createServerRpc({
	id: "e3fe404ee0b8e721efa01daf601517ee9e623b866309fd4b561c2a1b8684aa3a",
	name: "getCurrentUserFn",
	filename: "src/server/functions/auth.ts"
}, (opts) => getCurrentUserFn.__executeServer(opts));
var getCurrentUserFn = createServerFn({ method: "GET" }).handler(getCurrentUserFn_createServerFn_handler, async () => {
	const { getRequestHeader, setResponseHeader } = await import("./ssr.mjs").then((n) => n.a).then((n) => n.t);
	const { getSessionUserId, readSessionToken, clearedSessionCookie } = await import("./session-BNaH1BWr.mjs").then((n) => n.n);
	const cookieHeader = getRequestHeader("cookie");
	const token = readSessionToken(cookieHeader);
	const userId = await getSessionUserId(cookieHeader);
	if (!userId) {
		if (token) setResponseHeader("Set-Cookie", clearedSessionCookie());
		return { user: null };
	}
	const { getFullUserProfile } = await import("./authService-C0nlf_rX.mjs").then((n) => n.t);
	const user = await getFullUserProfile(userId);
	if (!user) {
		setResponseHeader("Set-Cookie", clearedSessionCookie());
		return { user: null };
	}
	return { user };
});
var loginFn_createServerFn_handler = createServerRpc({
	id: "400d0ebda25e268fae04a488ac1560b98c4d67527f9bd9e0f94da9940683d0e0",
	name: "loginFn",
	filename: "src/server/functions/auth.ts"
}, (opts) => loginFn.__executeServer(opts));
var loginFn = createServerFn({ method: "POST" }).validator(object({
	email: string().trim().email(),
	password: string().min(1)
})).handler(loginFn_createServerFn_handler, async ({ data }) => {
	const { setResponseHeader } = await import("./ssr.mjs").then((n) => n.a).then((n) => n.t);
	const { authenticateUser, getFullUserProfile } = await import("./authService-C0nlf_rX.mjs").then((n) => n.t);
	const { createAuthSession, sessionCookie } = await import("./session-BNaH1BWr.mjs").then((n) => n.n);
	const user = await authenticateUser(data.email, data.password);
	if (!user) return {
		success: false,
		user: null
	};
	setResponseHeader("Set-Cookie", sessionCookie(await createAuthSession(user.id)));
	return {
		success: true,
		user: await getFullUserProfile(user.id)
	};
});
var logoutFn_createServerFn_handler = createServerRpc({
	id: "afe1d2a803886564f98daff63e8424e1b53fe830e93496792cdbbf97ce1b93e3",
	name: "logoutFn",
	filename: "src/server/functions/auth.ts"
}, (opts) => logoutFn.__executeServer(opts));
var logoutFn = createServerFn({ method: "POST" }).handler(logoutFn_createServerFn_handler, async () => {
	const { getRequestHeader, setResponseHeader } = await import("./ssr.mjs").then((n) => n.a).then((n) => n.t);
	const { destroyAuthSession, readSessionToken, clearedSessionCookie } = await import("./session-BNaH1BWr.mjs").then((n) => n.n);
	await destroyAuthSession(readSessionToken(getRequestHeader("cookie")));
	setResponseHeader("Set-Cookie", clearedSessionCookie());
	return { success: true };
});
//#endregion
export { getCurrentUserFn_createServerFn_handler, loginFn_createServerFn_handler, logoutFn_createServerFn_handler };
