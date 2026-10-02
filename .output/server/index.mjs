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
		"mtime": "2026-10-02T22:21:56.590Z",
		"size": 4286,
		"path": "../public/favicon.ico"
	},
	"/logo.png": {
		"type": "image/png",
		"etag": "\"6451-BKxvQoIeDsoFwQ0MFBPiZxZ9sQ8\"",
		"mtime": "2026-10-02T22:21:56.590Z",
		"size": 25681,
		"path": "../public/logo.png"
	},
	"/paper-background.avif": {
		"type": "image/avif",
		"etag": "\"1e7b-MrO1Urk6Dc7oZpm4jD2/qd9TZgA\"",
		"mtime": "2026-10-02T22:21:56.590Z",
		"size": 7803,
		"path": "../public/paper-background.avif"
	},
	"/assets/AvatarPicker-Cfut1uKv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c61-QyatoWO+RmRX4oOF57KsqTB/nz8\"",
		"mtime": "2026-10-02T22:21:54.720Z",
		"size": 3169,
		"path": "../public/assets/AvatarPicker-Cfut1uKv.js"
	},
	"/assets/SessionTimeDisplay-DUnWAMXQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"268-6Ak9vDnByY3za3nL57jx63Q/sMc\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 616,
		"path": "../public/assets/SessionTimeDisplay-DUnWAMXQ.js"
	},
	"/assets/SessionTimePicker-BgnU8WQf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c16-AicUHaVL/dYcSUBfgana9Yyp5Qk\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 7190,
		"path": "../public/assets/SessionTimePicker-BgnU8WQf.js"
	},
	"/assets/StudentForm-C65kGLuR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f66-BpxppEIEhp7gZuumb9NuCFIp2d4\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 16230,
		"path": "../public/assets/StudentForm-C65kGLuR.js"
	},
	"/assets/TeacherCard-Cyf2MMPK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db2-eaE5woR8kzid0Yt5rP3Z1muwWvc\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 3506,
		"path": "../public/assets/TeacherCard-Cyf2MMPK.js"
	},
	"/assets/TeacherForm-iwafDVKY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22cd-7bUVd8OWvbZrxAt7kSbvMjWZwZE\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 8909,
		"path": "../public/assets/TeacherForm-iwafDVKY.js"
	},
	"/assets/_groupNumber-C_vXyZKc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e12-YyUd2M2rcHCDL2ffyYB+VWKy4ug\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 24082,
		"path": "../public/assets/_groupNumber-C_vXyZKc.js"
	},
	"/assets/_groupType-BoEgXa1k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"464d-T+xYh5ic3P8R1YSBlKVCFUFtwss\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 17997,
		"path": "../public/assets/_groupType-BoEgXa1k.js"
	},
	"/assets/Combination-jueLkCMC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc86-4CrfWuzzU2OkswYS6WvEUaPzx2M\"",
		"mtime": "2026-10-02T22:21:54.720Z",
		"size": 48262,
		"path": "../public/assets/Combination-jueLkCMC.js"
	},
	"/assets/_id-CETBRSZx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b30-HCyLanRPEwj8DkWEncwhay9712s\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 6960,
		"path": "../public/assets/_id-CETBRSZx.js"
	},
	"/assets/_id-DVkQgRG5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"87c5-yKDaC/XwkdKpREkZDpD2H/duzGU\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 34757,
		"path": "../public/assets/_id-DVkQgRG5.js"
	},
	"/assets/_sessionId-B9q1ckZe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e23-Bl9ksLrA5UY/uXmJiP2A2UgMzvc\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 28195,
		"path": "../public/assets/_sessionId-B9q1ckZe.js"
	},
	"/assets/ageUtils-5_b3cbCd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ce-hgzMV+u8WNZO0d2W7gLbckFwmJo\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 462,
		"path": "../public/assets/ageUtils-5_b3cbCd.js"
	},
	"/assets/arrow-right-DnRCbPdY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-xW2oZc134fHcpoyuuw3ZgnU6Wts\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 165,
		"path": "../public/assets/arrow-right-DnRCbPdY.js"
	},
	"/assets/attendance-KqxDmuYF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-finfb5ydbifsDCXLhqncw6vJmkI\"",
		"mtime": "2026-10-02T22:21:54.721Z",
		"size": 151,
		"path": "../public/assets/attendance-KqxDmuYF.js"
	},
	"/assets/award-Dzwi_aQZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-xp3Pbig4wx2JVotTOd81focsFZY\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 274,
		"path": "../public/assets/award-Dzwi_aQZ.js"
	},
	"/assets/book-open-CtnDUTfX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-2cw1ap2zb7SkptCyktwSl1d2oyk\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 279,
		"path": "../public/assets/book-open-CtnDUTfX.js"
	},
	"/assets/calendar-CMhG3bMY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-TG4E9TtVuM4CIkn2mrVFGPZ468I\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 257,
		"path": "../public/assets/calendar-CMhG3bMY.js"
	},
	"/assets/chevron-left-Ba3gsbLi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-FE0acLUuLam+FTxLRppk3FXHxs4\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 130,
		"path": "../public/assets/chevron-left-Ba3gsbLi.js"
	},
	"/assets/circle-alert-DBHQssPK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-KbA7fT2qR1PaOezfsxP5MfuD55k\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 250,
		"path": "../public/assets/circle-alert-DBHQssPK.js"
	},
	"/assets/clock-Casj3Y-s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-b6TiCwcNKTp7CaItz7L26sA0r8c\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 169,
		"path": "../public/assets/clock-Casj3Y-s.js"
	},
	"/assets/GroupForm-gHjATufy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"52ef-XTzh/UaDVE5gOPxE80AXjhS5QkI\"",
		"mtime": "2026-10-02T22:21:54.720Z",
		"size": 21231,
		"path": "../public/assets/GroupForm-gHjATufy.js"
	},
	"/assets/clsx-lE7C-4ge.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1983-5ZxOgURVePzbDvkELPUUOcjYO1I\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 6531,
		"path": "../public/assets/clsx-lE7C-4ge.js"
	},
	"/assets/date-picker-BUXyjpUC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27dd-VnK1SgQ+An27y16oyf+QHOYCTqE\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 10205,
		"path": "../public/assets/date-picker-BUXyjpUC.js"
	},
	"/assets/createLucideIcon-Bo77HH2v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9948-Ee/WNOVORqSnpBHzqCLKACQ4Nmc\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 39240,
		"path": "../public/assets/createLucideIcon-Bo77HH2v.js"
	},
	"/assets/dashboard-CGpYpIFU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b956-FTROU6FbfEOKnxEk+O4wUrXpfHk\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 47446,
		"path": "../public/assets/dashboard-CGpYpIFU.js"
	},
	"/assets/dist-CIi923aX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a2-qJn1nWXfPkPgApjC1V0MAdgJD90\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 418,
		"path": "../public/assets/dist-CIi923aX.js"
	},
	"/assets/dist-y8Zaf0J3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d8-IVQXkfJjBQ0VzU8LpGRcGGlw9RM\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 5592,
		"path": "../public/assets/dist-y8Zaf0J3.js"
	},
	"/assets/edit-BsjP46Lm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"516-a+OvzwW/kvV/st+V30NvdozFXvg\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 1302,
		"path": "../public/assets/edit-BsjP46Lm.js"
	},
	"/assets/dist-CIbzoaTI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d74-ibEvMLq8mwzzW0bZFKVkcc9mIYU\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 3444,
		"path": "../public/assets/dist-CIbzoaTI.js"
	},
	"/assets/edit-B39mSN-g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"765-p8oS9uY04X6Q+0KfDm1E7PMQECc\"",
		"mtime": "2026-10-02T22:21:54.722Z",
		"size": 1893,
		"path": "../public/assets/edit-B39mSN-g.js"
	},
	"/assets/edit-CgqDWG-Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"199f-mO9FYzfNaz3NCgHxTxMLYE5Mx9c\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 6559,
		"path": "../public/assets/edit-CgqDWG-Z.js"
	},
	"/assets/edit-DgpmrmZg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f5-ui3fkWJm/NlAesejdx9JbROMqbk\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 1269,
		"path": "../public/assets/edit-DgpmrmZg.js"
	},
	"/assets/form-CsxCTiKh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"606-IIsKBuJYHV2Iz7rOsmTjCFPE6qc\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 1542,
		"path": "../public/assets/form-CsxCTiKh.js"
	},
	"/assets/groups-SF7YfM5e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f5-1QsBZ4XMlLf0aOYICsFRayi/amA\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 5365,
		"path": "../public/assets/groups-SF7YfM5e.js"
	},
	"/assets/layout-grid-Ceaoq7nd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ca-gAqYTYBixFfPXOUWJzhKwNBZQRo\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 714,
		"path": "../public/assets/layout-grid-Ceaoq7nd.js"
	},
	"/assets/input-oO4T6ikL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"288-bVnfcHRkfw8+wR0DYfHotZPioq4\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 648,
		"path": "../public/assets/input-oO4T6ikL.js"
	},
	"/assets/link-CrTMuIa6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1876-sEF+DoGNR4Ca444GLF1hlhaEJ+U\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 6262,
		"path": "../public/assets/link-CrTMuIa6.js"
	},
	"/assets/mail-arwAEXoK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-FXQIxZnHWAEtg2cqg70AfEgt9zQ\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 213,
		"path": "../public/assets/mail-arwAEXoK.js"
	},
	"/assets/login-XpT6mi-Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c64-PHPKU8b1awY54+3pRnl8BVV1GDs\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 7268,
		"path": "../public/assets/login-XpT6mi-Z.js"
	},
	"/assets/index-CPz5xXb7.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1d166-/5KbefUKad1ZKe2BwL8+3PHGe8Y\"",
		"mtime": "2026-10-02T22:21:54.726Z",
		"size": 119142,
		"path": "../public/assets/index-CPz5xXb7.css"
	},
	"/assets/new-Bxj0lF0B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d0-baUaF0KqsbrNpTJ74ZIElnecQdc\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 5584,
		"path": "../public/assets/new-Bxj0lF0B.js"
	},
	"/assets/map-pin-CP2Lm51o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-lkOS+mJOoTnyV7MbdNvCgqU6AmU\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 259,
		"path": "../public/assets/map-pin-CP2Lm51o.js"
	},
	"/assets/new-G434xk_7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38f-sAfTwiTazs9aV4anb4uPBn7QYvI\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 911,
		"path": "../public/assets/new-G434xk_7.js"
	},
	"/assets/new-Du7SDUvB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b7-799gn6fAinyjkmwLDjKPtIICizk\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 951,
		"path": "../public/assets/new-Du7SDUvB.js"
	},
	"/assets/new-KkznFVxN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542-jbsOVyVxZE0M5O9AMo5DCEaMbSk\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 1346,
		"path": "../public/assets/new-KkznFVxN.js"
	},
	"/assets/index-DI7cPgzD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70ff8-Gs83SM0Mjo+7LOnpv+5RMwuf8cc\"",
		"mtime": "2026-10-02T22:21:54.719Z",
		"size": 462840,
		"path": "../public/assets/index-DI7cPgzD.js"
	},
	"/assets/new-sYTr3iPI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35c8-jNY1qyA2nG5HbJhMZlpw+VdQTyA\"",
		"mtime": "2026-10-02T22:21:54.723Z",
		"size": 13768,
		"path": "../public/assets/new-sYTr3iPI.js"
	},
	"/assets/parents-DJKF26OO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e2e-aih1QvW9PZkK7G29Vn6uLwEEyLs\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 24110,
		"path": "../public/assets/parents-DJKF26OO.js"
	},
	"/assets/prayerTimes-BmvhfQvy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103a-JwZFoLmcUJYrOQBL3xFwAxpSoQI\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 4154,
		"path": "../public/assets/prayerTimes-BmvhfQvy.js"
	},
	"/assets/quranData-Dudm9hrV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3721-7GndK4GmnL4ypzh4ieBzNwzpW6M\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 14113,
		"path": "../public/assets/quranData-Dudm9hrV.js"
	},
	"/assets/ratings-UPW2z9-4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20dd-tCfpfr6WVtZMSXrWlKBKmopPa+0\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 8413,
		"path": "../public/assets/ratings-UPW2z9-4.js"
	},
	"/assets/phone-Bi3rz8KK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-frTkI03DWScoA3tyzWHYIs5Cp54\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 322,
		"path": "../public/assets/phone-Bi3rz8KK.js"
	},
	"/assets/plus-DgNlrC7j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-d/nZsbfdPba/81/NNT/FARal2pg\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 153,
		"path": "../public/assets/plus-DgNlrC7j.js"
	},
	"/assets/scroll-area-B1kPdmGs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3561-fLSlmCpmAME0sBpNOXQMK2JYhGs\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 13665,
		"path": "../public/assets/scroll-area-B1kPdmGs.js"
	},
	"/assets/save-C7WKXpM6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-3wncuvfFOuRFVOq/qazbMrYqyXQ\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 327,
		"path": "../public/assets/save-C7WKXpM6.js"
	},
	"/assets/search-CUh9bEUB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-65LQBOUZDenOrVYYXh/BgYKl6FI\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 174,
		"path": "../public/assets/search-CUh9bEUB.js"
	},
	"/assets/select-nNvkvlxi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"736d-fPus3/5arAVqRmA4cTovNy7qTAE\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 29549,
		"path": "../public/assets/select-nNvkvlxi.js"
	},
	"/assets/shield-check-tg4etmjr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-VLFU7H2fGJyzpznf0ukNJosjz3c\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 320,
		"path": "../public/assets/shield-check-tg4etmjr.js"
	},
	"/assets/sessions-CAK-WT7K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6476-R3pfiQXnO1Ds+wOzATTByz21vIg\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 25718,
		"path": "../public/assets/sessions-CAK-WT7K.js"
	},
	"/assets/students-C19ZYmVU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15cd-HB85+d6QWBBYyCkON1753/NQjf8\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 5581,
		"path": "../public/assets/students-C19ZYmVU.js"
	},
	"/assets/square-pen-BYMTFreX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-Pmsd6ZfY9VlD3pu23UqJzS1z/mU\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 320,
		"path": "../public/assets/square-pen-BYMTFreX.js"
	},
	"/assets/refresh-cw-DZeSoDyD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-B72Wj+VGOj5YSgh7cnUEc5iP2Gk\"",
		"mtime": "2026-10-02T22:21:54.724Z",
		"size": 321,
		"path": "../public/assets/refresh-cw-DZeSoDyD.js"
	},
	"/assets/teachers-DZLjB-Yb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f75-92LCFxzc/dk3VpdwrfDzVb4XV04\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 3957,
		"path": "../public/assets/teachers-DZLjB-Yb.js"
	},
	"/assets/sun-DQ0u8UWj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-OiVRv4ss/iqS7F50sKl5+B/DCXM\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 472,
		"path": "../public/assets/sun-DQ0u8UWj.js"
	},
	"/assets/types-Ckh7KphH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c2-Fl7jRpnOjoximMMoDGu79xKGpSI\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 1218,
		"path": "../public/assets/types-Ckh7KphH.js"
	},
	"/assets/textarea-CTvjVdAQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22a-P2Cpmf+eEZj6nsLOkeGb5CbZOkE\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 554,
		"path": "../public/assets/textarea-CTvjVdAQ.js"
	},
	"/assets/useMatch-DFsTmbha.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"272-Yg2EQKpWTGvXosvBTJcgUBUZbs4\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 626,
		"path": "../public/assets/useMatch-DFsTmbha.js"
	},
	"/assets/useSelector-CsJw-erN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76e-/oKuutqCU3Z8JPD3j1sPcc2pP6o\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 1902,
		"path": "../public/assets/useSelector-CsJw-erN.js"
	},
	"/assets/useForm-Ccl-Sqdm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6c1-7zyWIfnbueW/3/8956IIci0hseA\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 59073,
		"path": "../public/assets/useForm-Ccl-Sqdm.js"
	},
	"/assets/useNavigate-cKRKrHp2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23a7-o/q/djzEQUA7qiIzRF2mGZdm8SE\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 9127,
		"path": "../public/assets/useNavigate-cKRKrHp2.js"
	},
	"/assets/trash-2-CWr29rGp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-o3rCgWElh511E6NPzSPfQx9W7Y0\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 328,
		"path": "../public/assets/trash-2-CWr29rGp.js"
	},
	"/assets/user-_tfSXwqS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-VLeih1eTzgSg3ergOuDOlGMGKeA\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 196,
		"path": "../public/assets/user-_tfSXwqS.js"
	},
	"/assets/users-C-IdkqRI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-t0cNfKD65DrGcAkuRMyjDapqQt4\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 306,
		"path": "../public/assets/users-C-IdkqRI.js"
	},
	"/assets/utils-DCvbpOtd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb5-ddQe7nge4rkeuEehVJsFEDF3H9s\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 3253,
		"path": "../public/assets/utils-DCvbpOtd.js"
	},
	"/assets/utils-DiLcvYCe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6aa6-aRS1QfeKkciEeahZK3xEuJSQ4VA\"",
		"mtime": "2026-10-02T22:21:54.726Z",
		"size": 27302,
		"path": "../public/assets/utils-DiLcvYCe.js"
	},
	"/assets/useStore-CYr0TDmA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5f-VYI3xi/ii9VGF1YQVtiAKMmT6y0\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 95,
		"path": "../public/assets/useStore-CYr0TDmA.js"
	},
	"/assets/user-check-CqvLhrZt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3-2k3/8JIPZ8LK+eKDaioOfMnLeGI\"",
		"mtime": "2026-10-02T22:21:54.725Z",
		"size": 243,
		"path": "../public/assets/user-check-CqvLhrZt.js"
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
