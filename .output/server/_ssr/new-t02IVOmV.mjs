import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { V as FolderPlus, nt as ArrowRight, y as Save } from "../_libs/lucide-react.mjs";
import { r as api } from "./router-DHZqPWB-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-t02IVOmV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewGroupTypePage() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("اسم المسار أو نوع الحلقة مطلوب");
			return;
		}
		setIsSubmitting(true);
		setError("");
		try {
			const newType = (await api.post("/api/group-types", {
				name: name.trim(),
				slug: slug.trim() || void 0,
				description: description.trim() || void 0
			})).data.groupType;
			if (newType?.slug) navigate({ to: `/dashboard/groups/${encodeURIComponent(newType.slug)}` });
			else navigate({ to: "/dashboard/groups" });
		} catch (err) {
			console.error("Failed to create group type:", err);
			setError(err.response?.data?.error || err.message || "فشل في حفظ المسار الدراسي");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl mx-auto space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/groups",
						className: "px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العودة للمسارات" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight",
							children: "إنشاء مسار دراسي / تصنيف جديد"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "إضافة تصنيف تنظيمي جديد لتجميع حلقات التحفيظ (مثل: جزء عم، القراءات، ورش)"
						})]
					})]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-bold text-slate-700 mb-1.5",
						children: ["اسم المسار أو نوع الحلقات ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						required: true,
						value: name,
						onChange: (e) => {
							setName(e.target.value);
							if (!slug) setSlug(e.target.value.trim().toLowerCase().replace(/\s+/g, "-"));
						},
						placeholder: "مثال: حفظ جزء عم، رواية ورش، مسار الإتقان والتثبيت",
						className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-right"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-700 mb-1.5",
							children: "المعرف بالرابط (Slug - اختياري)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: slug,
							onChange: (e) => setSlug(e.target.value),
							placeholder: "hifz-juz-amma",
							className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-left",
							dir: "ltr"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-slate-400 block mt-1",
							children: ["يستخدم كعنوان للصفحة في المتصفح مثل: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
								className: "bg-slate-100 px-1 py-0.5 rounded text-slate-600",
								children: ["/dashboard/groups/", slug || "name"]
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 mb-1.5",
						children: "وصف المسار والأهداف التعليمية"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: "مثال: يهدف هذا المسار إلى تدريب الطلاب الصغار على تلاوة وتجويد وحفظ قصار السور من سورة الناس إلى سورة النبأ، مع ضبط مخارج الحروف...",
						className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-right leading-relaxed"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-slate-100 flex items-center justify-start gap-3 flex-row-reverse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isSubmitting,
							className: "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الحفظ..." : "حفظ المسار الجديد" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/groups",
							className: "px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer",
							children: "إلغاء"
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { NewGroupTypePage as component };
