import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as PenLine, l as Trash2, nt as ArrowRight, y as Save } from "../_libs/lucide-react.mjs";
import { r as api } from "./router-D9XCqWvD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-8xmGriA7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditGroupTypePage() {
	const { groupType: groupTypeParam } = useParams({ from: "/dashboard/groups/$groupType/edit" });
	const navigate = useNavigate();
	const [groupType, setGroupType] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadType() {
			try {
				setIsLoading(true);
				const gt = (await api.get(`/api/group-types/${encodeURIComponent(groupTypeParam)}`)).data.groupType;
				setGroupType(gt);
				if (gt) {
					setName(gt.name || "");
					setSlug(gt.slug || "");
					setDescription(gt.description || "");
				}
			} catch (err) {
				console.error("Failed to load group type for edit:", err);
				setError(err.response?.data?.error || err.message || "فشل في تحميل بيانات المسار");
			} finally {
				setIsLoading(false);
			}
		}
		loadType();
	}, [groupTypeParam]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("اسم المسار أو نوع الحلقة مطلوب");
			return;
		}
		if (!groupType) return;
		setIsSubmitting(true);
		setError("");
		try {
			const targetSlug = (await api.put(`/api/group-types/${encodeURIComponent(groupType.id)}`, {
				name: name.trim(),
				slug: slug.trim() || void 0,
				description: description.trim() || void 0
			})).data.groupType?.slug || groupTypeParam;
			navigate({ to: `/dashboard/groups/${encodeURIComponent(targetSlug)}` });
		} catch (err) {
			console.error("Failed to update group type:", err);
			setError(err.response?.data?.error || err.message || "فشل في تحديث بيانات المسار");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleDelete = async () => {
		if (!groupType) return;
		if (window.confirm(`هل أنت متأكد من حذف المسار الدراسي "${groupType.name}"؟`)) try {
			await api.delete(`/api/group-types/${encodeURIComponent(groupType.id)}`);
			navigate({ to: "/dashboard/groups" });
		} catch (err) {
			alert(err.response?.data?.error || "فشل في حذف المسار");
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل بيانات المسار..."
	});
	if (error || !groupType) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center space-y-4 text-right",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-slate-600 font-bold",
			children: "لم يتم العثور على المسار المطلوب."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard/groups",
			className: "px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs inline-block",
			children: "العودة لقائمة المسارات"
		})]
	});
	const currentSlug = encodeURIComponent(groupType.slug || groupTypeParam);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl mx-auto space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: `/dashboard/groups/${currentSlug}`,
						className: "px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العودة للمسار" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight",
							children: ["تعديل المسار الدراسي: ", groupType.name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "تحديث اسم المسار، وصف المنهج، أو الرابط التعريفي."
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
						onChange: (e) => setName(e.target.value),
						className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-right"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 mb-1.5",
						children: "المعرف بالرابط (Slug)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: slug,
						onChange: (e) => setSlug(e.target.value),
						className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-left",
						dir: "ltr"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold text-slate-700 mb-1.5",
						children: "وصف المسار والأهداف التعليمية"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: description,
						onChange: (e) => setDescription(e.target.value),
						className: "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-right leading-relaxed"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-slate-100 flex items-center justify-between flex-row-reverse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 flex-row-reverse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: isSubmitting,
								className: "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: `/dashboard/groups/${currentSlug}`,
								className: "px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer",
								children: "إلغاء"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleDelete,
							className: "px-4 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حذف المسار" })]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { EditGroupTypePage as component };
