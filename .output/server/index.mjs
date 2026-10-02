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
		"etag": "\"10be-qlAx0iODrWQHMmXJ9oZ5bUJubSw\"",
		"mtime": "2026-10-02T22:35:11.855Z",
		"size": 4286,
		"path": "../public/favicon.ico"
	},
	"/paper-background.avif": {
		"type": "image/avif",
		"etag": "\"1e7b-MrO1Urk6Dc7oZpm4jD2/qd9TZgA\"",
		"mtime": "2026-10-02T22:35:11.855Z",
		"size": 7803,
		"path": "../public/paper-background.avif"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"6451-BKxvQoIeDsoFwQ0MFBPiZxZ9sQ8\"",
		"mtime": "2026-10-02T22:35:11.855Z",
		"size": 25681,
		"path": "../public/logo.png"
	},
	"/images/halaqat_faceless_1790530844707.jpg": {
		"type": "image/jpeg",
		"etag": "\"6a8f0-j8mpPXbNuLDJP9pfRR3UQHwNkko\"",
		"mtime": "2026-10-02T22:35:11.843Z",
		"size": 436464,
		"path": "../public/images/halaqat_faceless_1790530844707.jpg"
	},
	"/images/halaqat_icon_1790529720774.jpg": {
		"type": "image/jpeg",
		"etag": "\"6853d-U/qWouW8KzL1E77pjT1NNSj25mg\"",
		"mtime": "2026-10-02T22:35:11.843Z",
		"size": 427325,
		"path": "../public/images/halaqat_icon_1790529720774.jpg"
	},
	"/images/ratings_faceless_1790530856836.jpg": {
		"type": "image/jpeg",
		"etag": "\"73419-ahuNDyHspxxM8RHBjwcX93+0sqA\"",
		"mtime": "2026-10-02T22:35:11.853Z",
		"size": 472089,
		"path": "../public/images/ratings_faceless_1790530856836.jpg"
	},
	"/images/ratings_icon_1790529731569.jpg": {
		"type": "image/jpeg",
		"etag": "\"574a6-DCjavzPWf56lWEOg6o2bfLPKWZY\"",
		"mtime": "2026-10-02T22:35:11.852Z",
		"size": 357542,
		"path": "../public/images/ratings_icon_1790529731569.jpg"
	},
	"/images/hero_mosque_illustration_1790525295748.jpg": {
		"type": "image/jpeg",
		"etag": "\"6a948-cVYFZ88jsDbN1IKSwDggPe2Ly6c\"",
		"mtime": "2026-10-02T22:35:11.843Z",
		"size": 436552,
		"path": "../public/images/hero_mosque_illustration_1790525295748.jpg"
	},
	"/images/teachers_faceless_icon_1790529923181.jpg": {
		"type": "image/jpeg",
		"etag": "\"70180-eEGs3KH61K5uKs41KlFpryezSmo\"",
		"mtime": "2026-10-02T22:35:11.854Z",
		"size": 459136,
		"path": "../public/images/teachers_faceless_icon_1790529923181.jpg"
	},
	"/images/teachers_faceless_1790530831937.jpg": {
		"type": "image/jpeg",
		"etag": "\"7ea72-3li7HcUb61d9vxexeqLOJT3T9U4\"",
		"mtime": "2026-10-02T22:35:11.854Z",
		"size": 518770,
		"path": "../public/images/teachers_faceless_1790530831937.jpg"
	},
	"/assets/AvatarPicker-B3QpHmPF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c61-pg7UHaqgM8UO5jBkxijRBjSJ3a4\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 3169,
		"path": "../public/assets/AvatarPicker-B3QpHmPF.js"
	},
	"/assets/Combination-jueLkCMC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc86-4CrfWuzzU2OkswYS6WvEUaPzx2M\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 48262,
		"path": "../public/assets/Combination-jueLkCMC.js"
	},
	"/assets/GroupForm-BAydQBn4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"52ef-fUArhcVfAyplkykxX28+1VL3y+A\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 21231,
		"path": "../public/assets/GroupForm-BAydQBn4.js"
	},
	"/assets/SessionTimeDisplay-CkaRfhuF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"268-E4SSPVqvISm4a1KwYQxImUEzTgk\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 616,
		"path": "../public/assets/SessionTimeDisplay-CkaRfhuF.js"
	},
	"/assets/SessionTimePicker-B_oieEXk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c16-KI6LbCWW0He99s+jFcX1D0en8Nw\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 7190,
		"path": "../public/assets/SessionTimePicker-B_oieEXk.js"
	},
	"/assets/StudentForm-BjklqBVW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f66-WPh7TTBs0zgDEK4FklZLO0GIFcA\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 16230,
		"path": "../public/assets/StudentForm-BjklqBVW.js"
	},
	"/images/teachers_icon_1790529710256.jpg": {
		"type": "image/jpeg",
		"etag": "\"72869-AjOYyMk4TKBIza2KiMDtQcPm4aI\"",
		"mtime": "2026-10-02T22:35:11.854Z",
		"size": 469097,
		"path": "../public/images/teachers_icon_1790529710256.jpg"
	},
	"/images/students_faceless_1790530329562.jpg": {
		"type": "image/jpeg",
		"etag": "\"75593-lXsMjc2JJ0hYQ89U1JVR/jyjoZY\"",
		"mtime": "2026-10-02T22:35:11.853Z",
		"size": 480659,
		"path": "../public/images/students_faceless_1790530329562.jpg"
	},
	"/images/students_icon_1790529698112.jpg": {
		"type": "image/jpeg",
		"etag": "\"7ebb9-S9RZ+U5KRy4y/gyJ/2z6L0qrT84\"",
		"mtime": "2026-10-02T22:35:11.854Z",
		"size": 519097,
		"path": "../public/images/students_icon_1790529698112.jpg"
	},
	"/images/islamic_wallpaper_mosque_1790525336507.jpg": {
		"type": "image/jpeg",
		"etag": "\"cc55d-oFkg2dc92XTQrWCd9+9sf3R5s7M\"",
		"mtime": "2026-10-02T22:35:11.844Z",
		"size": 836957,
		"path": "../public/images/islamic_wallpaper_mosque_1790525336507.jpg"
	},
	"/images/scholar_imam_avatar_2_1790525315732.jpg": {
		"type": "image/jpeg",
		"etag": "\"ba3b3-PXMIjJkEdVadkNDsF82C2RrvLDg\"",
		"mtime": "2026-10-02T22:35:11.852Z",
		"size": 762803,
		"path": "../public/images/scholar_imam_avatar_2_1790525315732.jpg"
	},
	"/images/scholar_imam_avatar_3_1790525326637.jpg": {
		"type": "image/jpeg",
		"etag": "\"b7ba8-KrUeCn3fOgvhMOfhu/ZEQNFv/lw\"",
		"mtime": "2026-10-02T22:35:11.853Z",
		"size": 752552,
		"path": "../public/images/scholar_imam_avatar_3_1790525326637.jpg"
	},
	"/images/students_faceless_icon_1790529904779.jpg": {
		"type": "image/jpeg",
		"etag": "\"809db-pI7eUzlyAq5C6oRMm+BbUOI7u8E\"",
		"mtime": "2026-10-02T22:35:11.854Z",
		"size": 526811,
		"path": "../public/images/students_faceless_icon_1790529904779.jpg"
	},
	"/images/scholar_imam_avatar_1_1790525305502.jpg": {
		"type": "image/jpeg",
		"etag": "\"c823c-CwgoUmUEHYGNH0KR2QdrUUJSeQk\"",
		"mtime": "2026-10-02T22:35:11.844Z",
		"size": 819772,
		"path": "../public/images/scholar_imam_avatar_1_1790525305502.jpg"
	},
	"/images/students_faceless_1790530817292.jpg": {
		"type": "image/jpeg",
		"etag": "\"8f620-z7eMFzmeE7Vt5UcZna+g8Gx2Qzs\"",
		"mtime": "2026-10-02T22:35:11.853Z",
		"size": 587296,
		"path": "../public/images/students_faceless_1790530817292.jpg"
	},
	"/assets/TeacherCard-CVgAi1vT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db2-Kt8+A39CpH2rOdQ1QsVuTIxSvgE\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 3506,
		"path": "../public/assets/TeacherCard-CVgAi1vT.js"
	},
	"/assets/TeacherForm-PeT5zKIy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22cd-TXXjHD++wjXRnKntNVj1uWIHwEM\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 8909,
		"path": "../public/assets/TeacherForm-PeT5zKIy.js"
	},
	"/assets/_groupNumber-BIldRblL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e12-R5kIR5kR24h+yZ2L+XCoQwY/Qjc\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 24082,
		"path": "../public/assets/_groupNumber-BIldRblL.js"
	},
	"/assets/_id-B3VKlVTV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b30-WO+/2uhJuyHt08sISuFTKx+Gj0o\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 6960,
		"path": "../public/assets/_id-B3VKlVTV.js"
	},
	"/assets/_groupType-Dck11O1t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"464d-bkHvjX4yh2FJppKpOFK/rGcP75o\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 17997,
		"path": "../public/assets/_groupType-Dck11O1t.js"
	},
	"/assets/_id-JQWdcael.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"87c5-12e6eIm2hKUme64PMT8zDy9VwcI\"",
		"mtime": "2026-10-02T22:35:10.360Z",
		"size": 34757,
		"path": "../public/assets/_id-JQWdcael.js"
	},
	"/assets/_sessionId-BFORjGkz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e23-ZoUO3hIE1WrUOKymbC2pG6c9Q8M\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 28195,
		"path": "../public/assets/_sessionId-BFORjGkz.js"
	},
	"/assets/ageUtils-5_b3cbCd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ce-hgzMV+u8WNZO0d2W7gLbckFwmJo\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 462,
		"path": "../public/assets/ageUtils-5_b3cbCd.js"
	},
	"/assets/arrow-right-DnRCbPdY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-xW2oZc134fHcpoyuuw3ZgnU6Wts\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 165,
		"path": "../public/assets/arrow-right-DnRCbPdY.js"
	},
	"/assets/attendance-KqxDmuYF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-finfb5ydbifsDCXLhqncw6vJmkI\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 151,
		"path": "../public/assets/attendance-KqxDmuYF.js"
	},
	"/assets/award-Dzwi_aQZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-xp3Pbig4wx2JVotTOd81focsFZY\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 274,
		"path": "../public/assets/award-Dzwi_aQZ.js"
	},
	"/assets/book-open-CtnDUTfX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-2cw1ap2zb7SkptCyktwSl1d2oyk\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 279,
		"path": "../public/assets/book-open-CtnDUTfX.js"
	},
	"/assets/calendar-CMhG3bMY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-TG4E9TtVuM4CIkn2mrVFGPZ468I\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 257,
		"path": "../public/assets/calendar-CMhG3bMY.js"
	},
	"/assets/chevron-left-Ba3gsbLi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-FE0acLUuLam+FTxLRppk3FXHxs4\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 130,
		"path": "../public/assets/chevron-left-Ba3gsbLi.js"
	},
	"/assets/circle-alert-DBHQssPK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-KbA7fT2qR1PaOezfsxP5MfuD55k\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 250,
		"path": "../public/assets/circle-alert-DBHQssPK.js"
	},
	"/assets/clock-Casj3Y-s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-b6TiCwcNKTp7CaItz7L26sA0r8c\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 169,
		"path": "../public/assets/clock-Casj3Y-s.js"
	},
	"/assets/clsx-lE7C-4ge.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1983-5ZxOgURVePzbDvkELPUUOcjYO1I\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 6531,
		"path": "../public/assets/clsx-lE7C-4ge.js"
	},
	"/assets/createLucideIcon-Bo77HH2v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9948-Ee/WNOVORqSnpBHzqCLKACQ4Nmc\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 39240,
		"path": "../public/assets/createLucideIcon-Bo77HH2v.js"
	},
	"/assets/dashboard-7ZbF84Bb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b956-Lt1uzoc4e3pMG9AbcCcjFld372Q\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 47446,
		"path": "../public/assets/dashboard-7ZbF84Bb.js"
	},
	"/assets/date-picker-B6ORabe0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27dd-Xi3XSeX3rA5hYG3teATFs1S4VtQ\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 10205,
		"path": "../public/assets/date-picker-B6ORabe0.js"
	},
	"/assets/dist-CIbzoaTI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d74-ibEvMLq8mwzzW0bZFKVkcc9mIYU\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 3444,
		"path": "../public/assets/dist-CIbzoaTI.js"
	},
	"/assets/dist-CIi923aX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-qJn1nWXfPkPgApjC1V0MAdgJD90\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 418,
		"path": "../public/assets/dist-CIi923aX.js"
	},
	"/assets/dist-y8Zaf0J3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d8-IVQXkfJjBQ0VzU8LpGRcGGlw9RM\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 5592,
		"path": "../public/assets/dist-y8Zaf0J3.js"
	},
	"/assets/edit-B2FQjIa_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"765-8Jxh/5454uUsSNB44Pg4rXVxVAI\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 1893,
		"path": "../public/assets/edit-B2FQjIa_.js"
	},
	"/assets/edit-BbPQmQAl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"199f-qfni91yzLLZxv9WwIRGYpiAIOlc\"",
		"mtime": "2026-10-02T22:35:10.361Z",
		"size": 6559,
		"path": "../public/assets/edit-BbPQmQAl.js"
	},
	"/assets/edit-CILQ5yFi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f5-KQr4otbeaDS0Nby1JdE51hCnsow\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 1269,
		"path": "../public/assets/edit-CILQ5yFi.js"
	},
	"/assets/edit-D4n4qP8W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"516-EGVcHG0GEZzBs5VERKXpNkkIaa4\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 1302,
		"path": "../public/assets/edit-D4n4qP8W.js"
	},
	"/assets/form-Bi3Y5wgd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"606-y6urdumiBrE9qEMexF+r6o8PFhk\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 1542,
		"path": "../public/assets/form-Bi3Y5wgd.js"
	},
	"/assets/groups-DB9D_FmB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f5-Q5V/sbmyMJeaS5INEKrKoPwLDAk\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 5365,
		"path": "../public/assets/groups-DB9D_FmB.js"
	},
	"/assets/index-CYiNF5f2.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1cd1d-gYBT1rEGuoFi9jUiGGZAM85KIzk\"",
		"mtime": "2026-10-02T22:35:10.364Z",
		"size": 118045,
		"path": "../public/assets/index-CYiNF5f2.css"
	},
	"/assets/index-jg2H5HJa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"710f0-VEf4ZazqZNqI6JUGjJJUI4DHRgc\"",
		"mtime": "2026-10-02T22:35:10.359Z",
		"size": 463088,
		"path": "../public/assets/index-jg2H5HJa.js"
	},
	"/assets/input-oO4T6ikL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"288-bVnfcHRkfw8+wR0DYfHotZPioq4\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 648,
		"path": "../public/assets/input-oO4T6ikL.js"
	},
	"/assets/layout-grid-Ceaoq7nd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ca-gAqYTYBixFfPXOUWJzhKwNBZQRo\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 714,
		"path": "../public/assets/layout-grid-Ceaoq7nd.js"
	},
	"/assets/link-CrTMuIa6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1876-sEF+DoGNR4Ca444GLF1hlhaEJ+U\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 6262,
		"path": "../public/assets/link-CrTMuIa6.js"
	},
	"/assets/login-NBC0phHK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f0b-0TWIfKMCNMlOwx6Ob/dAVBpjbcQ\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 3851,
		"path": "../public/assets/login-NBC0phHK.js"
	},
	"/assets/mail-arwAEXoK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-FXQIxZnHWAEtg2cqg70AfEgt9zQ\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 213,
		"path": "../public/assets/mail-arwAEXoK.js"
	},
	"/assets/map-pin-CP2Lm51o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-lkOS+mJOoTnyV7MbdNvCgqU6AmU\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 259,
		"path": "../public/assets/map-pin-CP2Lm51o.js"
	},
	"/assets/new-BbooJnvT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d0-pwGpILNIuk2ciPFLVyXBiE/yqEg\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 5584,
		"path": "../public/assets/new-BbooJnvT.js"
	},
	"/assets/new-CUPTws8g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38f-v1I3jc+EyN2YT3nrZpjVGL711Y0\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 911,
		"path": "../public/assets/new-CUPTws8g.js"
	},
	"/assets/new-DG0eLW3_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542-O3aclaHC9/2Hnirs+D2ne4NnYD0\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 1346,
		"path": "../public/assets/new-DG0eLW3_.js"
	},
	"/assets/new-DGKo2keY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b7-IdQA+FL7MVLefoU0089Xn39uU0U\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 951,
		"path": "../public/assets/new-DGKo2keY.js"
	},
	"/assets/new-lkrIc0Z8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35c8-50AjVBcHRa+kDlXnoor5AzHqwfI\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 13768,
		"path": "../public/assets/new-lkrIc0Z8.js"
	},
	"/assets/parents-CyanaBha.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e2e-ZP8H29nQINKiPyK5gbLPVj19X/Q\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 24110,
		"path": "../public/assets/parents-CyanaBha.js"
	},
	"/assets/phone-Bi3rz8KK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-frTkI03DWScoA3tyzWHYIs5Cp54\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 322,
		"path": "../public/assets/phone-Bi3rz8KK.js"
	},
	"/assets/plus-DgNlrC7j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-d/nZsbfdPba/81/NNT/FARal2pg\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 153,
		"path": "../public/assets/plus-DgNlrC7j.js"
	},
	"/assets/prayerTimes-DU__82Rc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103a-bzcuQLvileO01W3uy3OhfO/obck\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 4154,
		"path": "../public/assets/prayerTimes-DU__82Rc.js"
	},
	"/assets/quranData-Dudm9hrV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3721-7GndK4GmnL4ypzh4ieBzNwzpW6M\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 14113,
		"path": "../public/assets/quranData-Dudm9hrV.js"
	},
	"/assets/ratings-Dm832ffg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20dd-QsFGr2w7jUV/4ofDcSUiIlfdPbc\"",
		"mtime": "2026-10-02T22:35:10.362Z",
		"size": 8413,
		"path": "../public/assets/ratings-Dm832ffg.js"
	},
	"/assets/refresh-cw-DZeSoDyD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-B72Wj+VGOj5YSgh7cnUEc5iP2Gk\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 321,
		"path": "../public/assets/refresh-cw-DZeSoDyD.js"
	},
	"/assets/save-C7WKXpM6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-3wncuvfFOuRFVOq/qazbMrYqyXQ\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 327,
		"path": "../public/assets/save-C7WKXpM6.js"
	},
	"/assets/scroll-area-D2smqN6c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3561-j3IYTthbqVBekhrfQ83NPbvpXl4\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 13665,
		"path": "../public/assets/scroll-area-D2smqN6c.js"
	},
	"/assets/search-CUh9bEUB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-65LQBOUZDenOrVYYXh/BgYKl6FI\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 174,
		"path": "../public/assets/search-CUh9bEUB.js"
	},
	"/assets/select-nNvkvlxi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"736d-fPus3/5arAVqRmA4cTovNy7qTAE\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 29549,
		"path": "../public/assets/select-nNvkvlxi.js"
	},
	"/assets/sessions-Cayhjbh0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6476-5nId57Yohmr9V+8AvvFgJBJsCaY\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 25718,
		"path": "../public/assets/sessions-Cayhjbh0.js"
	},
	"/assets/shield-check-tg4etmjr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-VLFU7H2fGJyzpznf0ukNJosjz3c\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 320,
		"path": "../public/assets/shield-check-tg4etmjr.js"
	},
	"/assets/square-pen-BYMTFreX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-Pmsd6ZfY9VlD3pu23UqJzS1z/mU\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 320,
		"path": "../public/assets/square-pen-BYMTFreX.js"
	},
	"/assets/students-BaF3v_zq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15cd-LAvPtYWOrVpCQfb2799nSbeg/WI\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 5581,
		"path": "../public/assets/students-BaF3v_zq.js"
	},
	"/assets/sun-DQ0u8UWj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-OiVRv4ss/iqS7F50sKl5+B/DCXM\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 472,
		"path": "../public/assets/sun-DQ0u8UWj.js"
	},
	"/assets/teachers-BaVpBIFP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f75-TZekoO08h1a7tbhLa9f9eh7oi4s\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 3957,
		"path": "../public/assets/teachers-BaVpBIFP.js"
	},
	"/assets/textarea-CTvjVdAQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22a-P2Cpmf+eEZj6nsLOkeGb5CbZOkE\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 554,
		"path": "../public/assets/textarea-CTvjVdAQ.js"
	},
	"/assets/trash-2-CWr29rGp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-o3rCgWElh511E6NPzSPfQx9W7Y0\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 328,
		"path": "../public/assets/trash-2-CWr29rGp.js"
	},
	"/assets/types-Ckh7KphH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c2-Fl7jRpnOjoximMMoDGu79xKGpSI\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 1218,
		"path": "../public/assets/types-Ckh7KphH.js"
	},
	"/assets/useForm-CNTK-7me.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6c1-FfP2Htp0WKyfQuszmb9p2dwxYww\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 59073,
		"path": "../public/assets/useForm-CNTK-7me.js"
	},
	"/assets/useMatch-DFsTmbha.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-Yg2EQKpWTGvXosvBTJcgUBUZbs4\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 626,
		"path": "../public/assets/useMatch-DFsTmbha.js"
	},
	"/assets/useNavigate-cKRKrHp2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23a7-o/q/djzEQUA7qiIzRF2mGZdm8SE\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 9127,
		"path": "../public/assets/useNavigate-cKRKrHp2.js"
	},
	"/assets/useSelector-CsJw-erN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76e-/oKuutqCU3Z8JPD3j1sPcc2pP6o\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 1902,
		"path": "../public/assets/useSelector-CsJw-erN.js"
	},
	"/assets/useStore-CYr0TDmA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5f-VYI3xi/ii9VGF1YQVtiAKMmT6y0\"",
		"mtime": "2026-10-02T22:35:10.363Z",
		"size": 95,
		"path": "../public/assets/useStore-CYr0TDmA.js"
	},
	"/assets/user-_tfSXwqS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-VLeih1eTzgSg3ergOuDOlGMGKeA\"",
		"mtime": "2026-10-02T22:35:10.364Z",
		"size": 196,
		"path": "../public/assets/user-_tfSXwqS.js"
	},
	"/assets/user-check-CqvLhrZt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3-2k3/8JIPZ8LK+eKDaioOfMnLeGI\"",
		"mtime": "2026-10-02T22:35:10.364Z",
		"size": 243,
		"path": "../public/assets/user-check-CqvLhrZt.js"
	},
	"/assets/users-C-IdkqRI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-t0cNfKD65DrGcAkuRMyjDapqQt4\"",
		"mtime": "2026-10-02T22:35:10.364Z",
		"size": 306,
		"path": "../public/assets/users-C-IdkqRI.js"
	},
	"/assets/utils-DCvbpOtd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb5-ddQe7nge4rkeuEehVJsFEDF3H9s\"",
		"mtime": "2026-10-02T22:35:10.364Z",
		"size": 3253,
		"path": "../public/assets/utils-DCvbpOtd.js"
	},
	"/assets/utils-DiLcvYCe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6aa6-aRS1QfeKkciEeahZK3xEuJSQ4VA\"",
		"mtime": "2026-10-02T22:35:10.364Z",
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
