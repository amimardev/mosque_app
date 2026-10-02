import { o as __toESM } from "./_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "./_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { S as Phone, W as Clock, l as Trash2, nt as ArrowRight, p as SquarePen } from "./_libs/lucide-react.mjs";
import { r as api } from "./_ssr/router-D9XCqWvD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CitFQTRI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeacherDetailsPage() {
	const { id } = useParams({ from: "/dashboard/teachers/$id/" });
	const navigate = useNavigate();
	const [teacher, setTeacher] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadTeacher() {
			try {
				setIsLoading(true);
				const res = await api.get(`/api/teachers/${id}`);
				setTeacher(res.data.teacher || null);
			} catch (err) {
				setError(err.message || "Failed to load teacher");
			} finally {
				setIsLoading(false);
			}
		}
		loadTeacher();
	}, [id]);
	const handleDelete = async () => {
		if (teacher && window.confirm(`هل أنت متأكد من حذف حساب المعلم "${teacher.name}"؟`)) {
			await api.delete(`/api/teachers/${teacher.id}`);
			navigate({ to: "/dashboard/teachers" });
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل ملف المعلم..."
	});
	if (!teacher || error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center space-y-4 text-right",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-slate-500 font-bold",
			children: "لم يتم العثور على المعلم المطلوب."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard/teachers",
			className: "px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs inline-block",
			children: "الرجوع لدليل الشيوخ"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/teachers",
						className: "px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الرجوع لدليل الشيوخ" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap sm:justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/teachers/$id/edit",
						params: { id: teacher.id },
						className: "px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعديل بيانات المعلم" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleDelete,
						className: "p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer",
						title: "حذف حساب المعلم",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white text-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-36 sm:w-48 h-48 sm:h-64 rounded-2xl overflow-hidden ring-4 ring-emerald-600/20 shrink-0 bg-slate-100 shadow-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: teacher.avatar,
							alt: teacher.name,
							className: "w-full h-full object-cover object-top"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 w-full text-right space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold",
										children: teacher.status === "active" ? "شيخ معتمد ومقرئ" : "في إجازة"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900",
									children: teacher.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-emerald-700 text-xs sm:text-sm font-bold",
									children: teacher.specialization
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-bold min-w-28 shrink-0",
										children: "رقم الجوال:"
									}), teacher.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `tel:${teacher.phone}`,
										className: "font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1.5",
										dir: "ltr",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: teacher.phone }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-emerald-600" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-400",
										children: "غير متوفر"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-bold min-w-28 shrink-0",
										children: "البريد الإلكتروني:"
									}), teacher.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `mailto:${teacher.email}`,
										className: "font-medium text-emerald-700 hover:underline truncate",
										children: teacher.email
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-400",
										children: "غير متوفر"
									})]
								}),
								teacher.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2 pt-2 border-t border-slate-50 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-bold block text-xs",
										children: "السيرة العلمية والإجازات:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-slate-700 leading-relaxed font-medium",
										children: teacher.bio
									})]
								})
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"الحلقات الدراسية المسندة لتدريسها (",
						teacher.assignedGroups?.length || 0,
						")"
					] })]
				}), teacher.assignedGroups && teacher.assignedGroups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: teacher.assignedGroups.map((group) => {
						const typeSlug = encodeURIComponent(group.typeSlug || "general");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/dashboard/groups/$groupType/$groupNumber`,
							params: {
								groupType: typeSlug,
								groupNumber: String(group.number)
							},
							className: "p-4 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-2xl transition-colors block group",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between flex-row-reverse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-bold text-slate-900 text-sm group-hover:text-emerald-700",
										children: [
											"حلقة رقم ",
											group.number,
											" (",
											group.type,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-emerald-800 font-semibold block mt-1",
										children: group.studyTime
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200",
									children: group.level === "Beginner" ? "مبتدئ" : group.level === "Intermediate" ? "متوسط" : "متقدم"
								})]
							})
						}, group.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-400 italic text-center py-4",
					children: "لا توجد حلقات مسندة لهذا الشيخ حالياً."
				})]
			})
		]
	});
}
//#endregion
export { TeacherDetailsPage as component };
