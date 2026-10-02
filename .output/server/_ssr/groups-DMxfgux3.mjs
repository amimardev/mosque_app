import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Layers, H as FolderOpen, J as ChevronRight, N as LayoutGrid, W as Clock, n as Users, x as Plus } from "../_libs/lucide-react.mjs";
import { r as api } from "./router-Bezq88tF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/groups-DMxfgux3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GroupTypesCatalogPage() {
	const navigate = useNavigate();
	const [groupTypes, setGroupTypes] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const fetchTypes = async () => {
		try {
			setIsLoading(true);
			const res = await api.get("/api/group-types");
			setGroupTypes(res.data.groupTypes || []);
		} catch (err) {
			console.error("Failed to load group types:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchTypes();
	}, []);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل مسارات وتصنيفات الحلقات..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "w-6 h-6 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"مسارات وتصنيفات الحلقات القرآنية (",
					groupTypes.length,
					")"
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-slate-500",
				children: "تصنيفات ومناهج الحلقات في المدرسة. اختر مساراً لعرض الحلقات المسجلة تحته أو أضف مساراً جديداً."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard/groups/new",
				className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all self-start sm:self-auto cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء مسار دراسي جديد" })]
			})]
		}), groupTypes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
			children: groupTypes.map((gt) => {
				const targetUrl = `/dashboard/groups/${encodeURIComponent(gt.slug || gt.id)}`;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onClick: () => navigate({ to: targetUrl }),
					className: "bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors",
								children: gt.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 line-clamp-2 mt-1",
								children: gt.description || "مسار قرآني تعليمي موحد الأهداف والمنهج لجميع الحلقات التابعة."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-row-reverse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 flex-row-reverse font-semibold text-slate-700",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-emerald-600" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الحلقات التابعة:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-emerald-950 font-mono",
										children: [gt.groupsCount || 0, " حلقة"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 flex-row-reverse font-semibold text-slate-700",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-emerald-600" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إجمالي الطلاب:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-emerald-950 font-mono",
										children: [gt.totalStudents || 0, " طلاب"]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex items-center justify-end text-xs font-bold text-emerald-700 group-hover:-translate-x-1 transition-transform gap-0.5 flex-row-reverse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عرض حلقات المسار" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 transform rotate-180" })]
						})
					]
				}, gt.id);
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-6 h-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-slate-800",
					children: "لا توجد مسارات أو تصنيفات دراسية مضافة حتى الآن."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 max-w-sm mx-auto",
					children: "ابدأ بإنشاء أول مسار دراسي (مثل: حفظ جزء عم، رواية ورش، الحفظ المكثف) لتنظيم الحلقات تحته."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/groups/new",
					className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء أول مسار دراسي" })]
				})
			]
		})]
	});
}
//#endregion
export { GroupTypesCatalogPage as component };
