import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { D as MapPin, W as Clock, h as Sparkles } from "../_libs/lucide-react.mjs";
import { n as PRAYER_OPTIONS, r as formatSessionTimeArabic, t as OFFSET_HOURS_OPTIONS } from "./types-D-Kr0J12.mjs";
import { t as Input } from "./input-74l4de9A.mjs";
import { i as getPrayerTime, r as getAlgeriaPrayerTimes, t as calculateSessionClockTimes } from "./prayerTimes-C2HEDTVf.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D8jYswLp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SessionTimePicker-C-p9kA5Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SessionTimePicker = ({ value, onChange, showPreview = true, className = "", label = "تحديد التوقيت الزمني (بداية ونهاية الحصة)" }) => {
	const startType = value?.startType || "prayer";
	const startTime = value?.startTime || "16:30";
	const startPrayer = value?.startPrayer || "asr";
	const startOffsetHours = value?.startOffsetHours ?? 0;
	const endType = value?.endType || "prayer";
	const endTime = value?.endTime || "18:00";
	const endPrayer = value?.endPrayer || "maghrib";
	const endOffsetHours = value?.endOffsetHours ?? 0;
	const [timings, setTimings] = (0, import_react.useState)({
		Fajr: "05:17",
		Sunrise: "06:43",
		Dhuhr: "12:37",
		Asr: "15:59",
		Sunset: "18:31",
		Maghrib: "18:31",
		Isha: "19:52"
	});
	(0, import_react.useEffect)(() => {
		getAlgeriaPrayerTimes().then((data) => {
			if (data?.timings) setTimings(data.timings);
		});
	}, []);
	const updateField = (fields) => {
		onChange({
			...value,
			...fields
		});
	};
	const formattedSummary = (0, import_react.useMemo)(() => {
		return formatSessionTimeArabic({
			startType,
			startTime: startType === "time" ? startTime : null,
			startPrayer: startType === "prayer" ? startPrayer : null,
			startOffsetHours: startType === "prayer" ? Number(startOffsetHours) : 0,
			endType,
			endTime: endType === "time" ? endTime : null,
			endPrayer: endType === "prayer" ? endPrayer : null,
			endOffsetHours: endType === "prayer" ? Number(endOffsetHours) : 0
		});
	}, [
		startType,
		startTime,
		startPrayer,
		startOffsetHours,
		endType,
		endTime,
		endPrayer,
		endOffsetHours
	]);
	const clockTimes = (0, import_react.useMemo)(() => {
		return calculateSessionClockTimes(startType, startTime, startPrayer, startOffsetHours, endType, endTime, endPrayer, endOffsetHours, timings);
	}, [
		startType,
		startTime,
		startPrayer,
		startOffsetHours,
		endType,
		endTime,
		endPrayer,
		endOffsetHours,
		timings
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-5 text-right ${className}`,
		dir: "rtl",
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-slate-200/60 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-extrabold text-slate-800 flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] text-slate-400 font-bold flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3 h-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حسب أذان الجزائر" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-800",
							children: "1. بداية الموعد"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-lg bg-slate-100 p-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => updateField({ startType: "prayer" }),
								className: `flex-1 py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${startType === "prayer" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
								children: "أوقات الصلاة"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => updateField({ startType: "time" }),
								className: `flex-1 py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${startType === "time" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
								children: "ساعة محددة"
							})]
						}),
						startType === "prayer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-500 font-bold block mb-1",
								children: "اختر الصلاة:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: startPrayer,
								onValueChange: (val) => updateField({ startPrayer: val }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-slate-50 text-right text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الصلاة" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRAYER_OPTIONS.map((p) => {
									const prayerTimeStr = getPrayerTime(p.id, timings);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: p.id,
										children: [
											p.nameAr,
											" (",
											prayerTimeStr,
											")"
										]
									}, p.id);
								}) })]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-500 font-bold block mb-1",
								children: "إضافة فارق زمني:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(startOffsetHours),
								onValueChange: (val) => updateField({ startOffsetHours: Number(val) }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-slate-50 text-right text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "فارق زمني" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: OFFSET_HOURS_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: String(o.value),
									children: o.label
								}, o.value)) })]
							})] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-500 font-bold block mb-1",
								children: "الساعة:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: startTime,
								onChange: (e) => updateField({ startTime: e.target.value }),
								className: "w-full bg-slate-50 text-xs font-mono font-bold text-center text-slate-800"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-800",
							children: "2. نهاية الموعد"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-lg bg-slate-100 p-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => updateField({ endType: "prayer" }),
								className: `flex-1 py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${endType === "prayer" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
								children: "أوقات الصلاة"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => updateField({ endType: "time" }),
								className: `flex-1 py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${endType === "time" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
								children: "ساعة محددة"
							})]
						}),
						endType === "prayer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-500 font-bold block mb-1",
								children: "اختر الصلاة:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: endPrayer,
								onValueChange: (val) => updateField({ endPrayer: val }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-slate-50 text-right text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الصلاة" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRAYER_OPTIONS.map((p) => {
									const prayerTimeStr = getPrayerTime(p.id, timings);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: p.id,
										children: [
											p.nameAr,
											" (",
											prayerTimeStr,
											")"
										]
									}, p.id);
								}) })]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-500 font-bold block mb-1",
								children: "إضافة فارق زمني:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(endOffsetHours),
								onValueChange: (val) => updateField({ endOffsetHours: Number(val) }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-slate-50 text-right text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "فارق زمني" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: OFFSET_HOURS_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: String(o.value),
									children: o.label
								}, o.value)) })]
							})] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-500 font-bold block mb-1",
								children: "الساعة:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: endTime,
								onChange: (e) => updateField({ endTime: e.target.value }),
								className: "w-full bg-slate-50 text-xs font-mono font-bold text-center text-slate-800"
							})]
						})
					]
				})]
			}),
			showPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 bg-emerald-950 text-emerald-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold border border-emerald-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الصياغة والوقت المحسوب بدقة:" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-emerald-200 font-extrabold block",
						children: formattedSummary
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-1 bg-emerald-900/80 rounded-lg border border-emerald-700 font-mono text-xs text-white",
					children: [
						clockTimes.calculatedStartTime,
						" — ",
						clockTimes.calculatedEndTime
					]
				})]
			})
		]
	});
};
//#endregion
export { SessionTimePicker as t };
