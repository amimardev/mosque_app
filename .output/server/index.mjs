globalThis.__nitro_main__ = import.meta.url;
import { i as serve, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { i as toEventHandler, n as defineHandler, o as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import "./_libs/hookable.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs").then((n) => n.a)) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4203e-N8NzGtZeRLUOZNEwMasGhv+8wWk\"",
		"mtime": "2026-10-07T20:27:41.976Z",
		"size": 270398,
		"path": "../public/favicon.ico"
	},
	"/icon.png": {
		"type": "image/png",
		"etag": "\"5183-Vcahn8OyKJr6CNRXBJZrjBmLZBw\"",
		"mtime": "2026-10-07T20:27:41.977Z",
		"size": 20867,
		"path": "../public/icon.png"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"23f-oAmJZDpCBtWGf0bMZefbfn74pO0\"",
		"mtime": "2026-10-07T20:27:41.976Z",
		"size": 575,
		"path": "../public/manifest.webmanifest"
	},
	"/ramadan-kareem-islamic-greeting-card-design-d-dome-mosque-element-paper-cut-style-background-vector-illustration-ramadan-115639230-removebg-preview.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"10be-LAIsFpOdCNF9ebAcsZ0zzcfi1UQ\"",
		"mtime": "2026-10-07T20:27:41.977Z",
		"size": 4286,
		"path": "../public/ramadan-kareem-islamic-greeting-card-design-d-dome-mosque-element-paper-cut-style-background-vector-illustration-ramadan-115639230-removebg-preview.ico"
	},
	"/images/dashboard-groups.jpg": {
		"type": "image/jpeg",
		"etag": "\"6a8f0-j8mpPXbNuLDJP9pfRR3UQHwNkko\"",
		"mtime": "2026-10-07T20:27:41.967Z",
		"size": 436464,
		"path": "../public/images/dashboard-groups.jpg"
	},
	"/images/dashboard-teachers.jpg": {
		"type": "image/jpeg",
		"etag": "\"7ea72-3li7HcUb61d9vxexeqLOJT3T9U4\"",
		"mtime": "2026-10-07T20:27:41.967Z",
		"size": 518770,
		"path": "../public/images/dashboard-teachers.jpg"
	},
	"/onesignal/OneSignalSDKWorker.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c-xKTUbSnNdDIbOJyoF+CVXIRlsKE\"",
		"mtime": "2026-10-07T20:27:41.967Z",
		"size": 76,
		"path": "../public/onesignal/OneSignalSDKWorker.js"
	},
	"/assets/AvatarPicker-D0q-nuMm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be7-jcmrYns5hJ4pqxc9Ij3TupQgRkc\"",
		"mtime": "2026-10-07T20:27:40.530Z",
		"size": 3047,
		"path": "../public/assets/AvatarPicker-D0q-nuMm.js"
	},
	"/assets/Combination-jueLkCMC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc86-4CrfWuzzU2OkswYS6WvEUaPzx2M\"",
		"mtime": "2026-10-07T20:27:40.531Z",
		"size": 48262,
		"path": "../public/assets/Combination-jueLkCMC.js"
	},
	"/assets/GroupForm-BM5rT9Kr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53a7-iJ3rt9wlnZ/7OzAYhl8hXTOsbs4\"",
		"mtime": "2026-10-07T20:27:40.531Z",
		"size": 21415,
		"path": "../public/assets/GroupForm-BM5rT9Kr.js"
	},
	"/assets/SessionTimeDisplay-Cm2VRNzg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"268-HSYqK7quTLuv1ZQ2iIvuMY7VfCM\"",
		"mtime": "2026-10-07T20:27:40.531Z",
		"size": 616,
		"path": "../public/assets/SessionTimeDisplay-Cm2VRNzg.js"
	},
	"/images/mosque-hero.jpg": {
		"type": "image/jpeg",
		"etag": "\"6a948-cVYFZ88jsDbN1IKSwDggPe2Ly6c\"",
		"mtime": "2026-10-07T20:27:41.967Z",
		"size": 436552,
		"path": "../public/images/mosque-hero.jpg"
	},
	"/assets/SessionTimePicker-8WPBGUyx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c11-QgezSoCz9uwxyJuaOeIfMIc3zkg\"",
		"mtime": "2026-10-07T20:27:40.531Z",
		"size": 7185,
		"path": "../public/assets/SessionTimePicker-8WPBGUyx.js"
	},
	"/assets/StudentForm-BAkMN3Wh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36e4-fOp6fJTASbJyoUvfEFhCEaS+flw\"",
		"mtime": "2026-10-07T20:27:40.531Z",
		"size": 14052,
		"path": "../public/assets/StudentForm-BAkMN3Wh.js"
	},
	"/assets/TeacherCard-Bu2DNPb4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c95-f6gIO7ls4SGtDNkhJTODM+aYfDE\"",
		"mtime": "2026-10-07T20:27:40.531Z",
		"size": 3221,
		"path": "../public/assets/TeacherCard-Bu2DNPb4.js"
	},
	"/assets/TeacherForm-C9lxVj64.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e60-dwvGNpnsZccap1Ppkjbw3WZj4bE\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 7776,
		"path": "../public/assets/TeacherForm-C9lxVj64.js"
	},
	"/assets/_groupNumber-B4hQXcj4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5de5-bsgiJp9kHJ5jZfta2Y/3db4ZrG8\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 24037,
		"path": "../public/assets/_groupNumber-B4hQXcj4.js"
	},
	"/assets/_groupType-HHz1EL33.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4624-cy/2pgQFopH0mVlXbHa2iahwyKM\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 17956,
		"path": "../public/assets/_groupType-HHz1EL33.js"
	},
	"/assets/_id-BP1XejGV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85f5-zsTn5Ly+v172iQW8lZk1cZe1siI\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 34293,
		"path": "../public/assets/_id-BP1XejGV.js"
	},
	"/assets/_id-pEDf0i27.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1925-rrDcnamZf8okGwcAOpXwGR/r4UY\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 6437,
		"path": "../public/assets/_id-pEDf0i27.js"
	},
	"/assets/arrow-right-v_yrv7OS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-lrKOjhRuX46Kqf5pzuGfwXxNiR0\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 165,
		"path": "../public/assets/arrow-right-v_yrv7OS.js"
	},
	"/assets/_sessionId-DaXIU7yn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d3e-G5EiEHV8OztveTInaU1RnBgF0C8\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 27966,
		"path": "../public/assets/_sessionId-DaXIU7yn.js"
	},
	"/images/dashboard-students.jpg": {
		"type": "image/jpeg",
		"etag": "\"8f620-z7eMFzmeE7Vt5UcZna+g8Gx2Qzs\"",
		"mtime": "2026-10-07T20:27:41.967Z",
		"size": 587296,
		"path": "../public/images/dashboard-students.jpg"
	},
	"/images/sessions.jpg": {
		"type": "image/jpeg",
		"etag": "\"6853d-U/qWouW8KzL1E77pjT1NNSj25mg\"",
		"mtime": "2026-10-07T20:27:41.967Z",
		"size": 427325,
		"path": "../public/images/sessions.jpg"
	},
	"/images/islamic-wallpaper.jpg": {
		"type": "image/jpeg",
		"etag": "\"cc55d-oFkg2dc92XTQrWCd9+9sf3R5s7M\"",
		"mtime": "2026-10-07T20:27:41.977Z",
		"size": 836957,
		"path": "../public/images/islamic-wallpaper.jpg"
	},
	"/assets/attendance-KqxDmuYF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-finfb5ydbifsDCXLhqncw6vJmkI\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 151,
		"path": "../public/assets/attendance-KqxDmuYF.js"
	},
	"/assets/award-BgkeuAP3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-6KdYXMWW8MLI12Fo9/Sqtzns2kU\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 274,
		"path": "../public/assets/award-BgkeuAP3.js"
	},
	"/assets/calendar-gKN07cAN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-HmYfOnuVFIW1+uEP3XSXsa3WnRI\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 257,
		"path": "../public/assets/calendar-gKN07cAN.js"
	},
	"/assets/chevron-left-CijgOsFm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-HNip1FZof2w+6euggV79BimeeUU\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 130,
		"path": "../public/assets/chevron-left-CijgOsFm.js"
	},
	"/assets/circle-alert-BC1RHEv-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-L6cxZhHqV/Pc8sGeHxMv9147r2o\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 250,
		"path": "../public/assets/circle-alert-BC1RHEv-.js"
	},
	"/assets/clock-LK99AptF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-JYaCJYaCyFXf61lrnwg7sscG+d8\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 169,
		"path": "../public/assets/clock-LK99AptF.js"
	},
	"/assets/clsx-lE7C-4ge.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1983-5ZxOgURVePzbDvkELPUUOcjYO1I\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 6531,
		"path": "../public/assets/clsx-lE7C-4ge.js"
	},
	"/assets/createLucideIcon-5OpDD4u_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1de54-DHEAFaA7oHsseM6sLY6hwIHNoi8\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 122452,
		"path": "../public/assets/createLucideIcon-5OpDD4u_.js"
	},
	"/assets/dashboard-CEW4gceF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e21a-qKT5T4YotIxticarsGuV6zKjDOQ\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 57882,
		"path": "../public/assets/dashboard-CEW4gceF.js"
	},
	"/assets/dist-CIbzoaTI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d74-ibEvMLq8mwzzW0bZFKVkcc9mIYU\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 3444,
		"path": "../public/assets/dist-CIbzoaTI.js"
	},
	"/assets/date-picker-JeGEGBG7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27dd-yFiFwtFvQ9dr4dVnutLKglXaLmE\"",
		"mtime": "2026-10-07T20:27:40.532Z",
		"size": 10205,
		"path": "../public/assets/date-picker-JeGEGBG7.js"
	},
	"/assets/dist-CIi923aX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-qJn1nWXfPkPgApjC1V0MAdgJD90\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 418,
		"path": "../public/assets/dist-CIi923aX.js"
	},
	"/assets/dist-CXAY4zq2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1de4-Cc0H0/0aj/XdfobqXG226GHcHHU\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 7652,
		"path": "../public/assets/dist-CXAY4zq2.js"
	},
	"/assets/dist-y8Zaf0J3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d8-IVQXkfJjBQ0VzU8LpGRcGGlw9RM\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 5592,
		"path": "../public/assets/dist-y8Zaf0J3.js"
	},
	"/assets/edit-BgDUHyIp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"199f-uc4mANK7JBHDVgn0LVM6SGgO1VQ\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 6559,
		"path": "../public/assets/edit-BgDUHyIp.js"
	},
	"/assets/edit-C8l_Y2t4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f5-+NkHexV0vYQQJLuRnudaIFNT4Cw\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 1269,
		"path": "../public/assets/edit-C8l_Y2t4.js"
	},
	"/assets/edit-CZpEgwsq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"765-GUeRAwYQWrOEmNs1RSPP9+vj2FE\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 1893,
		"path": "../public/assets/edit-CZpEgwsq.js"
	},
	"/assets/edit-CwnlBy6V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"561-2CANewgfBQP1kwCXi6RgP49zvl8\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 1377,
		"path": "../public/assets/edit-CwnlBy6V.js"
	},
	"/assets/groups-z-s0vGx5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f5-fnDIWXVYZB/BS7pxVtV7vGBFLds\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 5365,
		"path": "../public/assets/groups-z-s0vGx5.js"
	},
	"/assets/form-Cb7CCLII.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"606-VCayuzPg7HqsoXiHop1B9LeOlnA\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 1542,
		"path": "../public/assets/form-Cb7CCLII.js"
	},
	"/assets/index-ZmMg9OS2.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1cc27-PBJ5w5m0jY4BSI+webN6fbgFYvE\"",
		"mtime": "2026-10-07T20:27:40.536Z",
		"size": 117799,
		"path": "../public/assets/index-ZmMg9OS2.css"
	},
	"/assets/input-oO4T6ikL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"288-bVnfcHRkfw8+wR0DYfHotZPioq4\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 648,
		"path": "../public/assets/input-oO4T6ikL.js"
	},
	"/assets/layout-grid-g4yxVnNl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ca-NUNRAfVfykHpeX7kgqxSP1XhOQE\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 714,
		"path": "../public/assets/layout-grid-g4yxVnNl.js"
	},
	"/assets/index-CE8r2Rr1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5de82-gV3XOFPPRbY4I1A2fZFQ+M/vkoE\"",
		"mtime": "2026-10-07T20:27:40.529Z",
		"size": 384642,
		"path": "../public/assets/index-CE8r2Rr1.js"
	},
	"/assets/link-CrTMuIa6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1876-sEF+DoGNR4Ca444GLF1hlhaEJ+U\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 6262,
		"path": "../public/assets/link-CrTMuIa6.js"
	},
	"/assets/map-pin-CUiBOO78.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-leUMrlLVdSHItdQcDmklnLTCb6g\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 259,
		"path": "../public/assets/map-pin-CUiBOO78.js"
	},
	"/assets/login-DLdvlm8a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1200-SQzEunsLedRHa66llEr7bJBoI20\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 4608,
		"path": "../public/assets/login-DLdvlm8a.js"
	},
	"/assets/new-B5O3ff7X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15cb-fpauzalxZsylIVkyr0pCN2zxalA\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 5579,
		"path": "../public/assets/new-B5O3ff7X.js"
	},
	"/assets/new-DJnLzL2E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-YI9YZj8AQRs+0iQuNrhrfoE7Kl4\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 716,
		"path": "../public/assets/new-DJnLzL2E.js"
	},
	"/assets/new-B_qbRu9v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542-iPemhuWunWmrZXDcbfSk4bH0+RU\"",
		"mtime": "2026-10-07T20:27:40.533Z",
		"size": 1346,
		"path": "../public/assets/new-B_qbRu9v.js"
	},
	"/assets/new-DrCGtYov.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38f-PxvlKFDoP7LnKEfZdqburIBhg5I\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 911,
		"path": "../public/assets/new-DrCGtYov.js"
	},
	"/assets/parents-DJM_pftX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ac8-BXoqwz4Gmd+u6OpAXErmwlMdOtg\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 23240,
		"path": "../public/assets/parents-DJM_pftX.js"
	},
	"/assets/phone-p_hKAJPj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-3pU9fLxXnvPCC14z9NfHNCn21N0\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 322,
		"path": "../public/assets/phone-p_hKAJPj.js"
	},
	"/assets/plus-yLSOEAYi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-76FhV3M7XP3x3GOBUy3To4prOQk\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 153,
		"path": "../public/assets/plus-yLSOEAYi.js"
	},
	"/assets/prayerTimes-EQzvoUZK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103a-ea0wI6JyKPsk78mSiwEwkbOw9xU\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 4154,
		"path": "../public/assets/prayerTimes-EQzvoUZK.js"
	},
	"/assets/quranData-Dudm9hrV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3721-7GndK4GmnL4ypzh4ieBzNwzpW6M\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 14113,
		"path": "../public/assets/quranData-Dudm9hrV.js"
	},
	"/assets/refresh-cw-CiNJAXB1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-q8z69G+18Dq0J2KwXQtYE0vggmc\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 321,
		"path": "../public/assets/refresh-cw-CiNJAXB1.js"
	},
	"/assets/save-BlXiOJHK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-9u3mj031/z4Vmq6wvPu/UsITBTk\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 327,
		"path": "../public/assets/save-BlXiOJHK.js"
	},
	"/assets/scroll-area-CQHD2Dpl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3561-4Nzdy4B6iyCpuCAU3qk2EcK/kvs\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 13665,
		"path": "../public/assets/scroll-area-CQHD2Dpl.js"
	},
	"/assets/search-7Ih_5605.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-Rb+a9ubblIp14BWzu3vdUx3VM4Q\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 174,
		"path": "../public/assets/search-7Ih_5605.js"
	},
	"/assets/select-BheZCsCR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"736d-NQ10gkIK0XK4TIre0Rq4a69VLtk\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 29549,
		"path": "../public/assets/select-BheZCsCR.js"
	},
	"/assets/sessions-zBvBkBWC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6471-lXLOFSPWAKj7KKCTHrIinq64iu8\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 25713,
		"path": "../public/assets/sessions-zBvBkBWC.js"
	},
	"/assets/shield-check-CF5UyWUu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-27d4dNFV7BjkT3GttXXWiDObRPM\"",
		"mtime": "2026-10-07T20:27:40.534Z",
		"size": 320,
		"path": "../public/assets/shield-check-CF5UyWUu.js"
	},
	"/assets/square-pen-BkNXJMhX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-krw6ysKVq2828Nq/uu+4xl9AlT0\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 320,
		"path": "../public/assets/square-pen-BkNXJMhX.js"
	},
	"/assets/students-D_1_sEas.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17e3-ELhWbczsBjxosNFoHx/v6J8BrEg\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 6115,
		"path": "../public/assets/students-D_1_sEas.js"
	},
	"/assets/sun-N588cq0A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-b/g/nFYpdlEyev1YXCQhAiq0Fcg\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 472,
		"path": "../public/assets/sun-N588cq0A.js"
	},
	"/assets/teachers-Dy1Yq5RD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f0b-ZxzOurRvJxPZBtMa7djd3wvnBY0\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 3851,
		"path": "../public/assets/teachers-Dy1Yq5RD.js"
	},
	"/assets/textarea-CTvjVdAQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22a-P2Cpmf+eEZj6nsLOkeGb5CbZOkE\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 554,
		"path": "../public/assets/textarea-CTvjVdAQ.js"
	},
	"/assets/trash-2-DzOe7B22.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-kbJKG7PAHTgHrDEBoZpBl5j62ZM\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 328,
		"path": "../public/assets/trash-2-DzOe7B22.js"
	},
	"/assets/types-Ckh7KphH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c2-Fl7jRpnOjoximMMoDGu79xKGpSI\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 1218,
		"path": "../public/assets/types-Ckh7KphH.js"
	},
	"/assets/useDebounce-CIaEPbCg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec-V1fs4KN1b11Yo4AXqBIwDDE/HRY\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 236,
		"path": "../public/assets/useDebounce-CIaEPbCg.js"
	},
	"/assets/useForm-_bSOahyW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6c1-CtsLfeWxhLR/4pot5l65JYDKOr8\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 59073,
		"path": "../public/assets/useForm-_bSOahyW.js"
	},
	"/assets/useMatch-Pbd6Q68V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-3uX6wEZYCA4pZQol6xD9++Z/Cao\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 626,
		"path": "../public/assets/useMatch-Pbd6Q68V.js"
	},
	"/assets/useNavigate-cKRKrHp2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23a7-o/q/djzEQUA7qiIzRF2mGZdm8SE\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 9127,
		"path": "../public/assets/useNavigate-cKRKrHp2.js"
	},
	"/assets/useSelector-CsJw-erN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76e-/oKuutqCU3Z8JPD3j1sPcc2pP6o\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 1902,
		"path": "../public/assets/useSelector-CsJw-erN.js"
	},
	"/assets/useStore-CYr0TDmA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5f-VYI3xi/ii9VGF1YQVtiAKMmT6y0\"",
		"mtime": "2026-10-07T20:27:40.535Z",
		"size": 95,
		"path": "../public/assets/useStore-CYr0TDmA.js"
	},
	"/assets/user-QAm-LwGg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-4TyL8DkqUkHjG/iYeabsUNX9LYc\"",
		"mtime": "2026-10-07T20:27:40.536Z",
		"size": 196,
		"path": "../public/assets/user-QAm-LwGg.js"
	},
	"/assets/user-check-DCjREjNS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3-VgAxwPm+Rjt5I+KgWkJT0rvOOx4\"",
		"mtime": "2026-10-07T20:27:40.536Z",
		"size": 243,
		"path": "../public/assets/user-check-DCjREjNS.js"
	},
	"/assets/users-BNzc7Sax.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-6ZbEpZD/1GdIaLm3mcc1yDb5Oig\"",
		"mtime": "2026-10-07T20:27:40.536Z",
		"size": 306,
		"path": "../public/assets/users-BNzc7Sax.js"
	},
	"/assets/utils-DCvbpOtd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb5-ddQe7nge4rkeuEehVJsFEDF3H9s\"",
		"mtime": "2026-10-07T20:27:40.536Z",
		"size": 3253,
		"path": "../public/assets/utils-DCvbpOtd.js"
	},
	"/assets/utils-DiLcvYCe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6aa6-aRS1QfeKkciEeahZK3xEuJSQ4VA\"",
		"mtime": "2026-10-07T20:27:40.536Z",
		"size": 27302,
		"path": "../public/assets/utils-DiLcvYCe.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_Fed_iK = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_Fed_iK
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function createNitroApp() {
	const hooks = void 0;
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		{
			const routeRules = getRouteRules(method, pathname);
			event.context.routeRules = routeRules?.routeRules;
			if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		}
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	for (const rule of Object.values(routeRules)) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
