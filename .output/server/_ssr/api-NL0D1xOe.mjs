import { t as __exportAll } from "./init-3ToIrUem.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { a as string, i as record, n as any, r as object, t as _enum } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-NL0D1xOe.js
var OperationRegistry = class {
	constructor() {
		this.routes = [];
	}
	get(path, handler) {
		this.register("GET", path, handler);
	}
	post(path, handler) {
		this.register("POST", path, handler);
	}
	put(path, handler) {
		this.register("PUT", path, handler);
	}
	delete(path, handler) {
		this.register("DELETE", path, handler);
	}
	route(prefix, router) {
		for (const route of router.routes) this.routes.push({
			...route,
			path: joinPath(prefix, route.path)
		});
	}
	register(method, path, handler) {
		this.routes.push({
			method,
			path: normalizePath(path),
			handler
		});
	}
	async dispatch(input) {
		const path = normalizePath(input.path);
		for (const route of this.routes) {
			if (route.method !== input.method.toUpperCase()) continue;
			const params = matchPath(route.path, path);
			if (!params) continue;
			const responseHeaders = {};
			const context = {
				req: {
					raw: new Request(`http://start.local${path}`),
					param: (name) => params[name],
					query: (name) => input.query?.[name],
					header: (name) => name.toLowerCase() === "cookie" ? input.cookieHeader : void 0,
					json: async () => input.body ?? {},
					parseBody: async () => input.body ?? {}
				},
				sessionId: input.sessionId ?? null,
				header: (name, value) => {
					responseHeaders[name] = value;
				},
				json: (body, status = 200) => envelope(status, body, responseHeaders),
				body: (body, status = 200) => envelope(status, Buffer.isBuffer(body) ? Buffer.from(body).toString("base64") : body, responseHeaders, Buffer.isBuffer(body) ? "base64" : void 0)
			};
			try {
				const result = await route.handler(context);
				if (isEnvelope(result)) return {
					...result,
					headers: {
						...responseHeaders,
						...result.headers
					}
				};
				return envelope(200, result, responseHeaders);
			} catch (error) {
				console.error("[SERVER FUNCTION OPERATION ERROR]", error);
				return envelope(500, { error: error instanceof Error ? error.message : "Internal Server Error" }, responseHeaders);
			}
		}
		return envelope(404, { error: "Not found" }, {});
	}
};
function envelope(status, body, headers, bodyEncoding) {
	return {
		__apiEnvelope: true,
		status,
		body,
		headers: { ...headers },
		...bodyEncoding ? { bodyEncoding } : {}
	};
}
function isEnvelope(value) {
	return !!value && typeof value === "object" && value.__apiEnvelope === true;
}
function normalizePath(path) {
	return `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}
function joinPath(prefix, path) {
	return normalizePath(`${prefix}/${path === "/" ? "" : path}`);
}
function matchPath(pattern, actual) {
	const expected = normalizePath(pattern).split("/").filter(Boolean);
	const received = normalizePath(actual).split("/").filter(Boolean);
	if (expected.length !== received.length) return null;
	const params = {};
	for (let index = 0; index < expected.length; index++) {
		const part = expected[index];
		if (part.startsWith(":")) try {
			params[part.slice(1)] = decodeURIComponent(received[index]);
		} catch {
			return null;
		}
		else if (part !== received[index]) return null;
	}
	return params;
}
var api_exports = /* @__PURE__ */ __exportAll({ apiRequestFn_createServerFn_handler: () => apiRequestFn_createServerFn_handler });
var requestSchema = object({
	method: _enum([
		"GET",
		"POST",
		"PUT",
		"DELETE"
	]),
	path: string().startsWith("/api/"),
	query: record(string(), string()).optional(),
	body: any().optional()
});
function isPublicRequest(path) {
	return path === "/api/prayer-times" || path === "/api/quran/surahs";
}
async function inlineStorageUrls(value) {
	if (value instanceof Date) return value;
	if (typeof value === "string") {
		const match = value.match(/^\/api\/storage\/([^?]+)(?:\?.*)?$/);
		if (!match) return value;
		const { getStorageDataUrl } = await import("./storage-CfgDWbZW.mjs");
		return getStorageDataUrl(decodeURIComponent(match[1]));
	}
	if (Array.isArray(value)) return Promise.all(value.map(inlineStorageUrls));
	if (value && typeof value === "object") {
		const entries = await Promise.all(Object.entries(value).map(async ([key, nested]) => [key, await inlineStorageUrls(nested)]));
		return Object.fromEntries(entries);
	}
	return value;
}
var apiRequestFn_createServerFn_handler = createServerRpc({
	id: "34a078b9ab06754cb1314ccee2a0b7029ae93c7a80283a8624ba47ae43695a9c",
	name: "apiRequestFn",
	filename: "src/server/functions/api.ts"
}, (opts) => apiRequestFn.__executeServer(opts));
var apiRequestFn = createServerFn({ method: "POST" }).validator(requestSchema).handler(apiRequestFn_createServerFn_handler, async ({ data }) => {
	const { getRequestHeader, setResponseHeader } = await import("./ssr.mjs").then((n) => n.a).then((n) => n.t);
	const { getSessionUserId } = await import("./session-BNaH1BWr.mjs").then((n) => n.n);
	const cookieHeader = getRequestHeader("cookie");
	const sessionId = await getSessionUserId(cookieHeader);
	if (!isPublicRequest(data.path) && !sessionId) return envelope(401, { error: "غير مصرح بالدخول، يرجى تسجيل الدخول أولاً" }, {});
	const { apiRouter } = await import("./operations-Ccjh6F9d.mjs");
	const result = await apiRouter.dispatch({
		method: data.method,
		path: data.path,
		query: data.query,
		body: data.body,
		cookieHeader,
		sessionId
	});
	for (const [name, value] of Object.entries(result.headers)) setResponseHeader(name, value);
	if (result.status < 400) result.body = await inlineStorageUrls(result.body);
	return result;
});
//#endregion
export { OperationRegistry as n, api_exports as t };
