import { it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { S as Phone, W as Clock } from "../_libs/lucide-react.mjs";
import { t as SessionTimeDisplay } from "./SessionTimeDisplay-DLjI0Uaw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TeacherCard-DwhUrTfW.js
var import_jsx_runtime = require_jsx_runtime();
var TeacherCard = ({ teacher, onClick }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		onClick,
		className: "bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4 text-right",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0 space-y-1 text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-extrabold text-slate-900 text-base truncate group-hover:text-emerald-700 transition-colors",
									children: teacher.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${teacher.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`,
									children: teacher.status === "active" ? "نشط" : "في إجازة"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-emerald-800 font-semibold line-clamp-2",
								children: teacher.specialization
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-slate-500 pt-1 text-right",
								children: ["البريد: ", teacher.email || "غير متوفر"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: teacher.avatar,
						alt: teacher.name,
						referrerPolicy: "no-referrer",
						className: "w-20 sm:w-24 aspect-[3/4] rounded-2xl object-cover object-top shrink-0 bg-slate-100 ring-2 ring-emerald-600/20 shadow-xs",
						onError: (e) => {
							const target = e.target;
							if (!target.src.includes("dicebear")) target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(teacher.name)}`;
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-right",
						children: [
							"الحلقات المسندة (",
							teacher.assignedGroups?.length || 0,
							")"
						]
					}), teacher.assignedGroups && teacher.assignedGroups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: teacher.assignedGroups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-800 truncate max-w-[170px] text-right",
								children: [
									"حلقة رقم ",
									g.number,
									" (",
									g.type,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-medium text-emerald-700 flex items-center gap-1 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, { entry: g })]
							})]
						}, g.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400 italic text-center",
						children: "لا توجد حلقات مسندة بعد"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-slate-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-slate-400 text-[11px] flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-emerald-600" }), "الهاتف:"]
						}), teacher.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${teacher.phone}`,
							onClick: (e) => e.stopPropagation(),
							className: "font-mono text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3 h-3 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: teacher.phone })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400 text-[11px] italic",
							children: "غير متوفر"
						})]
					})
				})
			]
		})
	});
};
//#endregion
export { TeacherCard as t };
