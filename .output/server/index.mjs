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
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"26fc-U7WwkjkAg81QSQf7EssizBtxN6Y\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 9980,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"10be-qlAx0iODrWQHMmXJ9oZ5bUJubSw\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 4286,
		"path": "../public/favicon.ico"
	},
	"/icon-512.png": {
		"type": "image/png",
		"etag": "\"bf69-IgvJboWcFXzH+3e3AZgLDi14SN0\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 49001,
		"path": "../public/icon-512.png"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"6451-BKxvQoIeDsoFwQ0MFBPiZxZ9sQ8\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 25681,
		"path": "../public/logo.png"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"282-2AvSv/WZxJJQrlnmz60XQ+Tn3tw\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 642,
		"path": "../public/manifest.webmanifest"
	},
	"/paper-background.avif": {
		"type": "image/avif",
		"etag": "\"1e7b-MrO1Urk6Dc7oZpm4jD2/qd9TZgA\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 7803,
		"path": "../public/paper-background.avif"
	},
	"/onesignal/OneSignalSDKWorker.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c-xKTUbSnNdDIbOJyoF+CVXIRlsKE\"",
		"mtime": "2026-10-06T17:33:09.210Z",
		"size": 76,
		"path": "../public/onesignal/OneSignalSDKWorker.js"
	},
	"/images/halaqat_faceless_1790530844707.jpg": {
		"type": "image/jpeg",
		"etag": "\"6a8f0-j8mpPXbNuLDJP9pfRR3UQHwNkko\"",
		"mtime": "2026-10-06T17:33:09.210Z",
		"size": 436464,
		"path": "../public/images/halaqat_faceless_1790530844707.jpg"
	},
	"/icon-192.png": {
		"type": "image/png",
		"etag": "\"2a6a-9lEz2naxmSoLEIdd2y4vRoOCsMQ\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 10858,
		"path": "../public/icon-192.png"
	},
	"/images/halaqat_icon_1790529720774.jpg": {
		"type": "image/jpeg",
		"etag": "\"6853d-U/qWouW8KzL1E77pjT1NNSj25mg\"",
		"mtime": "2026-10-06T17:33:09.210Z",
		"size": 427325,
		"path": "../public/images/halaqat_icon_1790529720774.jpg"
	},
	"/images/ratings_icon_1790529731569.jpg": {
		"type": "image/jpeg",
		"etag": "\"574a6-DCjavzPWf56lWEOg6o2bfLPKWZY\"",
		"mtime": "2026-10-06T17:33:09.219Z",
		"size": 357542,
		"path": "../public/images/ratings_icon_1790529731569.jpg"
	},
	"/images/ratings_faceless_1790530856836.jpg": {
		"type": "image/jpeg",
		"etag": "\"73419-ahuNDyHspxxM8RHBjwcX93+0sqA\"",
		"mtime": "2026-10-06T17:33:09.210Z",
		"size": 472089,
		"path": "../public/images/ratings_faceless_1790530856836.jpg"
	},
	"/images/students_faceless_1790530329562.jpg": {
		"type": "image/jpeg",
		"etag": "\"75593-lXsMjc2JJ0hYQ89U1JVR/jyjoZY\"",
		"mtime": "2026-10-06T17:33:09.219Z",
		"size": 480659,
		"path": "../public/images/students_faceless_1790530329562.jpg"
	},
	"/images/teachers_faceless_1790530831937.jpg": {
		"type": "image/jpeg",
		"etag": "\"7ea72-3li7HcUb61d9vxexeqLOJT3T9U4\"",
		"mtime": "2026-10-06T17:33:09.220Z",
		"size": 518770,
		"path": "../public/images/teachers_faceless_1790530831937.jpg"
	},
	"/images/students_icon_1790529698112.jpg": {
		"type": "image/jpeg",
		"etag": "\"7ebb9-S9RZ+U5KRy4y/gyJ/2z6L0qrT84\"",
		"mtime": "2026-10-06T17:33:09.220Z",
		"size": 519097,
		"path": "../public/images/students_icon_1790529698112.jpg"
	},
	"/assets/AvatarPicker-Co-3OdEC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c66-4oF8DtlaK7bABNdV33jE0+ynsCY\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 3174,
		"path": "../public/assets/AvatarPicker-Co-3OdEC.js"
	},
	"/images/teachers_faceless_icon_1790529923181.jpg": {
		"type": "image/jpeg",
		"etag": "\"70180-eEGs3KH61K5uKs41KlFpryezSmo\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 459136,
		"path": "../public/images/teachers_faceless_icon_1790529923181.jpg"
	},
	"/images/teachers_icon_1790529710256.jpg": {
		"type": "image/jpeg",
		"etag": "\"72869-AjOYyMk4TKBIza2KiMDtQcPm4aI\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 469097,
		"path": "../public/images/teachers_icon_1790529710256.jpg"
	},
	"/images/hero_mosque_illustration_1790525295748.jpg": {
		"type": "image/jpeg",
		"etag": "\"6a948-cVYFZ88jsDbN1IKSwDggPe2Ly6c\"",
		"mtime": "2026-10-06T17:33:09.210Z",
		"size": 436552,
		"path": "../public/images/hero_mosque_illustration_1790525295748.jpg"
	},
	"/images/scholar_imam_avatar_3_1790525326637.jpg": {
		"type": "image/jpeg",
		"etag": "\"b7ba8-KrUeCn3fOgvhMOfhu/ZEQNFv/lw\"",
		"mtime": "2026-10-06T17:33:09.219Z",
		"size": 752552,
		"path": "../public/images/scholar_imam_avatar_3_1790525326637.jpg"
	},
	"/images/scholar_imam_avatar_2_1790525315732.jpg": {
		"type": "image/jpeg",
		"etag": "\"ba3b3-PXMIjJkEdVadkNDsF82C2RrvLDg\"",
		"mtime": "2026-10-06T17:33:09.219Z",
		"size": 762803,
		"path": "../public/images/scholar_imam_avatar_2_1790525315732.jpg"
	},
	"/images/students_faceless_icon_1790529904779.jpg": {
		"type": "image/jpeg",
		"etag": "\"809db-pI7eUzlyAq5C6oRMm+BbUOI7u8E\"",
		"mtime": "2026-10-06T17:33:09.220Z",
		"size": 526811,
		"path": "../public/images/students_faceless_icon_1790529904779.jpg"
	},
	"/images/scholar_imam_avatar_1_1790525305502.jpg": {
		"type": "image/jpeg",
		"etag": "\"c823c-CwgoUmUEHYGNH0KR2QdrUUJSeQk\"",
		"mtime": "2026-10-06T17:33:09.221Z",
		"size": 819772,
		"path": "../public/images/scholar_imam_avatar_1_1790525305502.jpg"
	},
	"/images/students_faceless_1790530817292.jpg": {
		"type": "image/jpeg",
		"etag": "\"8f620-z7eMFzmeE7Vt5UcZna+g8Gx2Qzs\"",
		"mtime": "2026-10-06T17:33:09.219Z",
		"size": 587296,
		"path": "../public/images/students_faceless_1790530817292.jpg"
	},
	"/images/islamic_wallpaper_mosque_1790525336507.jpg": {
		"type": "image/jpeg",
		"etag": "\"cc55d-oFkg2dc92XTQrWCd9+9sf3R5s7M\"",
		"mtime": "2026-10-06T17:33:09.210Z",
		"size": 836957,
		"path": "../public/images/islamic_wallpaper_mosque_1790525336507.jpg"
	},
	"/assets/Combination-jueLkCMC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc86-4CrfWuzzU2OkswYS6WvEUaPzx2M\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 48262,
		"path": "../public/assets/Combination-jueLkCMC.js"
	},
	"/assets/GroupForm-BgvpGYx2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5428-MDPSR6sYC8o+C6tE2WUNuGXkAyE\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 21544,
		"path": "../public/assets/GroupForm-BgvpGYx2.js"
	},
	"/assets/SessionTimeDisplay-C30vn8lz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"268-bfK2XZpW0x+3yoNTeWfciE4IT8E\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 616,
		"path": "../public/assets/SessionTimeDisplay-C30vn8lz.js"
	},
	"/assets/SessionTimePicker-1_U0TaO7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c16-pYY0iuoOGSkWvGeXBfOiCjsFKZ8\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 7190,
		"path": "../public/assets/SessionTimePicker-1_U0TaO7.js"
	},
	"/assets/StudentForm-bGQ_vUzA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"375f-MTFuSihav3afHy352Hg8SxyWRY4\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 14175,
		"path": "../public/assets/StudentForm-bGQ_vUzA.js"
	},
	"/assets/TeacherForm-BcHRNrNX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee2-gezs6mZQ1r04JOlTo7JRXMNtoMw\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 7906,
		"path": "../public/assets/TeacherForm-BcHRNrNX.js"
	},
	"/assets/TeacherCard-C9uTUEB4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d0d-+WxkRWptjHd5Ohm2sCZa/wpZg3M\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 3341,
		"path": "../public/assets/TeacherCard-C9uTUEB4.js"
	},
	"/assets/_groupNumber-Bky4VzLR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5de5-+nQNqhDg7FaSORSBlZLEdghy1o0\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 24037,
		"path": "../public/assets/_groupNumber-Bky4VzLR.js"
	},
	"/assets/_groupType-49YSxZL3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4624-L8EEqFqA2YH/4UM8Zw/ZBUOrCS0\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 17956,
		"path": "../public/assets/_groupType-49YSxZL3.js"
	},
	"/assets/_id-8PbQUveI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"192f-8mERZblmvcR4Kxh4QDqDJFNH4wY\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 6447,
		"path": "../public/assets/_id-8PbQUveI.js"
	},
	"/assets/_id-Cn16FC62.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8611-8CQQOjZtfe8jP/eEh1gmiSuPkWA\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 34321,
		"path": "../public/assets/_id-Cn16FC62.js"
	},
	"/assets/_sessionId-CLoarbD_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e23-BC3rmXnWFxHMH+GDqS7pyIkDIFo\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 28195,
		"path": "../public/assets/_sessionId-CLoarbD_.js"
	},
	"/assets/arrow-right-v_yrv7OS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-lrKOjhRuX46Kqf5pzuGfwXxNiR0\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 165,
		"path": "../public/assets/arrow-right-v_yrv7OS.js"
	},
	"/assets/attendance-KqxDmuYF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-finfb5ydbifsDCXLhqncw6vJmkI\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 151,
		"path": "../public/assets/attendance-KqxDmuYF.js"
	},
	"/assets/award-BgkeuAP3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-6KdYXMWW8MLI12Fo9/Sqtzns2kU\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 274,
		"path": "../public/assets/award-BgkeuAP3.js"
	},
	"/assets/book-open-Etcyfgez.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-hp1n8YgUutRChP2GcnrAk8o+o/0\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 279,
		"path": "../public/assets/book-open-Etcyfgez.js"
	},
	"/assets/calendar-gKN07cAN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-HmYfOnuVFIW1+uEP3XSXsa3WnRI\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 257,
		"path": "../public/assets/calendar-gKN07cAN.js"
	},
	"/assets/chevron-left-CijgOsFm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-HNip1FZof2w+6euggV79BimeeUU\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 130,
		"path": "../public/assets/chevron-left-CijgOsFm.js"
	},
	"/assets/circle-alert-BC1RHEv-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-L6cxZhHqV/Pc8sGeHxMv9147r2o\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 250,
		"path": "../public/assets/circle-alert-BC1RHEv-.js"
	},
	"/assets/clock-LK99AptF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-JYaCJYaCyFXf61lrnwg7sscG+d8\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 169,
		"path": "../public/assets/clock-LK99AptF.js"
	},
	"/assets/clsx-lE7C-4ge.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1983-5ZxOgURVePzbDvkELPUUOcjYO1I\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 6531,
		"path": "../public/assets/clsx-lE7C-4ge.js"
	},
	"/assets/createLucideIcon-5OpDD4u_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1de54-DHEAFaA7oHsseM6sLY6hwIHNoi8\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 122452,
		"path": "../public/assets/createLucideIcon-5OpDD4u_.js"
	},
	"/assets/dashboard-ppzQYCeS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e27e-cRb5BSe5l3deaBkxZh2fWdwiOQQ\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 57982,
		"path": "../public/assets/dashboard-ppzQYCeS.js"
	},
	"/assets/date-picker-DFpM_hOm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27dd-cvRYeQxmzVDYFYg04RYhoq63nDg\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 10205,
		"path": "../public/assets/date-picker-DFpM_hOm.js"
	},
	"/assets/dist-CIbzoaTI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d74-ibEvMLq8mwzzW0bZFKVkcc9mIYU\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 3444,
		"path": "../public/assets/dist-CIbzoaTI.js"
	},
	"/assets/dist-CIi923aX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-qJn1nWXfPkPgApjC1V0MAdgJD90\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 418,
		"path": "../public/assets/dist-CIi923aX.js"
	},
	"/assets/dist-y8Zaf0J3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d8-IVQXkfJjBQ0VzU8LpGRcGGlw9RM\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 5592,
		"path": "../public/assets/dist-y8Zaf0J3.js"
	},
	"/assets/dist-CXAY4zq2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1de4-Cc0H0/0aj/XdfobqXG226GHcHHU\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 7652,
		"path": "../public/assets/dist-CXAY4zq2.js"
	},
	"/assets/edit-B3C04-4m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f5-ExtyKQ8oV7mLWNOd7hWL5UrGAYA\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 1269,
		"path": "../public/assets/edit-B3C04-4m.js"
	},
	"/assets/edit-BvGQYCkv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"561-RHt0n5Alm6q9dXkOq7ZPlwQ3MKA\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 1377,
		"path": "../public/assets/edit-BvGQYCkv.js"
	},
	"/assets/edit-CFrrxi0O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"199f-uUFiZ/8rUhHrrz4wxP91x86wdMU\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 6559,
		"path": "../public/assets/edit-CFrrxi0O.js"
	},
	"/assets/edit-D1RD2r6W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"765-3oBBBjQMu1uMnoljHDfLK58lsa0\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 1893,
		"path": "../public/assets/edit-D1RD2r6W.js"
	},
	"/assets/form-Dh2x6uor.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"606-zW7109uOThYU1LF5Yea+mxS9Oh4\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 1542,
		"path": "../public/assets/form-Dh2x6uor.js"
	},
	"/assets/groups-C7ZAZOGx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f5-ImUa46GkkmhhC9X//cWJ9JOyIQs\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 5365,
		"path": "../public/assets/groups-C7ZAZOGx.js"
	},
	"/assets/input-oO4T6ikL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"288-bVnfcHRkfw8+wR0DYfHotZPioq4\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 648,
		"path": "../public/assets/input-oO4T6ikL.js"
	},
	"/assets/index-CTBHdVtn.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1ccbe-BShU6q0mJeaJjkLIJFsovHz2MGQ\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 117950,
		"path": "../public/assets/index-CTBHdVtn.css"
	},
	"/assets/layout-grid-g4yxVnNl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ca-NUNRAfVfykHpeX7kgqxSP1XhOQE\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 714,
		"path": "../public/assets/layout-grid-g4yxVnNl.js"
	},
	"/assets/index-D16qWvOO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5deb8-hwWzEd4YUrUmor9RPA7Tf6a1S+o\"",
		"mtime": "2026-10-06T17:33:08.250Z",
		"size": 384696,
		"path": "../public/assets/index-D16qWvOO.js"
	},
	"/assets/login-DXtX4uWv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee0-0xYVZdrmXHv15SIBhXcEJ8KESQU\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 3808,
		"path": "../public/assets/login-DXtX4uWv.js"
	},
	"/assets/link-CrTMuIa6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1876-sEF+DoGNR4Ca444GLF1hlhaEJ+U\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 6262,
		"path": "../public/assets/link-CrTMuIa6.js"
	},
	"/assets/map-pin-CUiBOO78.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-leUMrlLVdSHItdQcDmklnLTCb6g\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 259,
		"path": "../public/assets/map-pin-CUiBOO78.js"
	},
	"/assets/new-BeZiELq_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38f-8GdFOk9CY+rpqtN4nTQ9hQoIDjk\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 911,
		"path": "../public/assets/new-BeZiELq_.js"
	},
	"/assets/new-CMqkYGsY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d0-sYcbGJmG4TqzmPZEbscjugrpCCQ\"",
		"mtime": "2026-10-06T17:33:08.251Z",
		"size": 5584,
		"path": "../public/assets/new-CMqkYGsY.js"
	},
	"/assets/new-D1NT3CeL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542-a+uDEqJFKIWUdxpF8f2Ze4bZSIQ\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 1346,
		"path": "../public/assets/new-D1NT3CeL.js"
	},
	"/assets/new-DOgGM1CD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-mFVuzjVg6xDTn+83vPcSnV0hd2Y\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 716,
		"path": "../public/assets/new-DOgGM1CD.js"
	},
	"/assets/parents-zpO0fECV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ac8-n66l1ViKpylDFwv/cVLD12kHnnI\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 23240,
		"path": "../public/assets/parents-zpO0fECV.js"
	},
	"/assets/phone-p_hKAJPj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-3pU9fLxXnvPCC14z9NfHNCn21N0\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 322,
		"path": "../public/assets/phone-p_hKAJPj.js"
	},
	"/assets/plus-yLSOEAYi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-76FhV3M7XP3x3GOBUy3To4prOQk\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 153,
		"path": "../public/assets/plus-yLSOEAYi.js"
	},
	"/assets/prayerTimes-Ur27UMIq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103a-vXN4q2Y5ELW+POLd9e0vKcZpQB4\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 4154,
		"path": "../public/assets/prayerTimes-Ur27UMIq.js"
	},
	"/assets/quranData-Dudm9hrV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3721-7GndK4GmnL4ypzh4ieBzNwzpW6M\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 14113,
		"path": "../public/assets/quranData-Dudm9hrV.js"
	},
	"/assets/save-BlXiOJHK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-9u3mj031/z4Vmq6wvPu/UsITBTk\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 327,
		"path": "../public/assets/save-BlXiOJHK.js"
	},
	"/assets/refresh-cw-CiNJAXB1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-q8z69G+18Dq0J2KwXQtYE0vggmc\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 321,
		"path": "../public/assets/refresh-cw-CiNJAXB1.js"
	},
	"/assets/scroll-area-C2i-nXWu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3561-7na0qbj65bfCNtIeNIRCCTUifds\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 13665,
		"path": "../public/assets/scroll-area-C2i-nXWu.js"
	},
	"/assets/search-7Ih_5605.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-Rb+a9ubblIp14BWzu3vdUx3VM4Q\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 174,
		"path": "../public/assets/search-7Ih_5605.js"
	},
	"/assets/select-BheZCsCR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"736d-NQ10gkIK0XK4TIre0Rq4a69VLtk\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 29549,
		"path": "../public/assets/select-BheZCsCR.js"
	},
	"/assets/sessions-DjkV6ANI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6476-ot8qVlebCAKJBlBsEVpmvn3U/hk\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 25718,
		"path": "../public/assets/sessions-DjkV6ANI.js"
	},
	"/assets/shield-check-CF5UyWUu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-27d4dNFV7BjkT3GttXXWiDObRPM\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 320,
		"path": "../public/assets/shield-check-CF5UyWUu.js"
	},
	"/assets/square-pen-BkNXJMhX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-krw6ysKVq2828Nq/uu+4xl9AlT0\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 320,
		"path": "../public/assets/square-pen-BkNXJMhX.js"
	},
	"/assets/students-IQpsuF4J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17e3-2Tv+L79R0cT8dSJA5/ElvbncAv8\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 6115,
		"path": "../public/assets/students-IQpsuF4J.js"
	},
	"/assets/sun-N588cq0A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-b/g/nFYpdlEyev1YXCQhAiq0Fcg\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 472,
		"path": "../public/assets/sun-N588cq0A.js"
	},
	"/assets/teachers-BeZwOvn8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f0b-bFUriMAjVA14k51M1UAQSYERqAA\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 3851,
		"path": "../public/assets/teachers-BeZwOvn8.js"
	},
	"/assets/textarea-CTvjVdAQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22a-P2Cpmf+eEZj6nsLOkeGb5CbZOkE\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 554,
		"path": "../public/assets/textarea-CTvjVdAQ.js"
	},
	"/assets/trash-2-DzOe7B22.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-kbJKG7PAHTgHrDEBoZpBl5j62ZM\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 328,
		"path": "../public/assets/trash-2-DzOe7B22.js"
	},
	"/assets/useDebounce-CIaEPbCg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec-V1fs4KN1b11Yo4AXqBIwDDE/HRY\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 236,
		"path": "../public/assets/useDebounce-CIaEPbCg.js"
	},
	"/assets/types-Ckh7KphH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c2-Fl7jRpnOjoximMMoDGu79xKGpSI\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 1218,
		"path": "../public/assets/types-Ckh7KphH.js"
	},
	"/assets/useMatch-Pbd6Q68V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-3uX6wEZYCA4pZQol6xD9++Z/Cao\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 626,
		"path": "../public/assets/useMatch-Pbd6Q68V.js"
	},
	"/assets/useNavigate-cKRKrHp2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23a7-o/q/djzEQUA7qiIzRF2mGZdm8SE\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 9127,
		"path": "../public/assets/useNavigate-cKRKrHp2.js"
	},
	"/assets/useForm-DHYLzQNU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6c1-H62ZaEu6KqOfcyVcFLDAmGvZv4k\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 59073,
		"path": "../public/assets/useForm-DHYLzQNU.js"
	},
	"/assets/useSelector-CsJw-erN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76e-/oKuutqCU3Z8JPD3j1sPcc2pP6o\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 1902,
		"path": "../public/assets/useSelector-CsJw-erN.js"
	},
	"/assets/useStore-CYr0TDmA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5f-VYI3xi/ii9VGF1YQVtiAKMmT6y0\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 95,
		"path": "../public/assets/useStore-CYr0TDmA.js"
	},
	"/assets/user-QAm-LwGg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-4TyL8DkqUkHjG/iYeabsUNX9LYc\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 196,
		"path": "../public/assets/user-QAm-LwGg.js"
	},
	"/assets/user-check-DCjREjNS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3-VgAxwPm+Rjt5I+KgWkJT0rvOOx4\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 243,
		"path": "../public/assets/user-check-DCjREjNS.js"
	},
	"/assets/users-BNzc7Sax.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-6ZbEpZD/1GdIaLm3mcc1yDb5Oig\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 306,
		"path": "../public/assets/users-BNzc7Sax.js"
	},
	"/assets/utils-DCvbpOtd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb5-ddQe7nge4rkeuEehVJsFEDF3H9s\"",
		"mtime": "2026-10-06T17:33:08.252Z",
		"size": 3253,
		"path": "../public/assets/utils-DCvbpOtd.js"
	},
	"/assets/utils-DiLcvYCe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6aa6-aRS1QfeKkciEeahZK3xEuJSQ4VA\"",
		"mtime": "2026-10-06T17:33:08.252Z",
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
