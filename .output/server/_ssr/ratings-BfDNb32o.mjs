import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Trash2, tt as Award, v as Search, x as Plus } from "../_libs/lucide-react.mjs";
import { r as api } from "./router-DHZqPWB-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ratings-BfDNb32o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RatingsHubPage() {
	useNavigate();
	const [ratings, setRatings] = (0, import_react.useState)([]);
	const [students, setStudents] = (0, import_react.useState)([]);
	const [teachers, setTeachers] = (0, import_react.useState)([]);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)("all");
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [ratingsRes, studentsRes, teachersRes] = await Promise.all([
				api.get("/api/ratings"),
				api.get("/api/students"),
				api.get("/api/teachers")
			]);
			setRatings(ratingsRes.data.ratings || []);
			setStudents(studentsRes.data.students || []);
			setTeachers(teachersRes.data.teachers || []);
		} catch (err) {
			console.error("Failed to load ratings:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const availableMonths = (0, import_react.useMemo)(() => {
		return Array.from(new Set(ratings.map((r) => r.month))).sort().reverse();
	}, [ratings]);
	const filteredRatings = (0, import_react.useMemo)(() => {
		return ratings.filter((r) => {
			const studentName = r.student?.name || "";
			const matchesSearch = searchQuery === "" || studentName.toLowerCase().includes(searchQuery.toLowerCase()) || r.surahEvaluated && r.surahEvaluated.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesMonth = selectedMonth === "all" || r.month === selectedMonth;
			return matchesSearch && matchesMonth;
		});
	}, [
		ratings,
		searchQuery,
		selectedMonth
	]);
	const handleDelete = async (r, e) => {
		e.stopPropagation();
		if (window.confirm(`هل أنت متأكد من حذف سجل التقييم للطالب "${r.student?.name || "الطالب"}"؟`)) {
			setDeletingId(r.id);
			try {
				await api.delete(`/api/ratings/${r.id}`);
				await fetchData();
			} finally {
				setDeletingId(null);
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 flex-row-reverse justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-7 h-7 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"سجل التقييمات والاختبارات الشهرية (",
						ratings.length,
						")"
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs sm:text-sm text-slate-500",
					children: "كشوفات درجات الحفظ الجديد، أحكام التجويد ومخارج الحروف، وجداول اختبارات التثبيت والمراجعة."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/ratings/new",
					className: "px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all self-start sm:self-auto cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إجراء تقييم جديد" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						placeholder: "البحث باسم الطالب أو السورة المختبرة...",
						className: "w-full pr-10 pl-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-right"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: selectedMonth,
					onChange: (e) => setSelectedMonth(e.target.value),
					className: "w-full sm:w-48 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "جميع الأشهر"
					}), availableMonths.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: m,
						children: ["شهر: ", m]
					}, m))]
				})]
			}),
			filteredRatings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
				children: filteredRatings.map((rating) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 flex-row-reverse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0 flex-row-reverse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: rating.student?.avatar || "https://api.dicebear.com/7.x/micah/svg?seed=student",
										alt: "",
										className: "w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400/40 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 text-right",
										children: [rating.student ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/dashboard/students/$id",
											params: { id: rating.student.id },
											className: "font-extrabold text-slate-900 text-sm hover:text-emerald-700 block truncate",
											children: rating.student.name
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-extrabold text-slate-900 text-sm block",
											children: "طالب"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-slate-400 block",
											children: ["الشهر: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-slate-700",
												children: rating.month
											})]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left shrink-0",
									dir: "ltr",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-base font-extrabold font-mono text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-xl block",
										children: [rating.overallScore, "%"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-slate-500 uppercase block mt-1",
										children: rating.grade?.split(" ")[0]
									})]
								})]
							}),
							rating.surahEvaluated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs space-y-0.5 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-amber-800 block",
									children: "المقطع المختبر"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-900 block",
									children: [
										"سورة ",
										rating.surahEvaluated,
										" ",
										rating.ayahStart && rating.ayahEnd ? `(من الآية ${rating.ayahStart} إلى ${rating.ayahEnd})` : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 text-center text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 bg-slate-50 rounded-xl border border-slate-200/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-semibold",
											children: "الحفظ"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-slate-800",
											dir: "ltr",
											children: [rating.hifzScore, "/100"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 bg-slate-50 rounded-xl border border-slate-200/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-semibold",
											children: "التجويد"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-slate-800",
											dir: "ltr",
											children: [rating.tajweedScore, "/100"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 bg-slate-50 rounded-xl border border-slate-200/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-semibold",
											children: "المراجعة"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-slate-800",
											dir: "ltr",
											children: [rating.murajaahScore, "/100"]
										})]
									})
								]
							}),
							rating.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 line-clamp-2 italic text-right",
								children: [
									"\"",
									rating.notes,
									"\""
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-row-reverse",
						children: [rating.teacher ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-slate-500 font-medium truncate max-w-[180px]",
							children: ["الشيخ: ", rating.teacher.name]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-slate-400",
							children: "مسجل"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: (e) => handleDelete(rating, e),
							disabled: deletingId === rating.id,
							className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
							title: "حذف التقييم",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})]
					})]
				}, rating.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-bold text-slate-900 mb-1",
						children: "لا توجد سجلات تقييم مطابقة"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 mb-4 max-w-sm mx-auto",
						children: "قم بإجراء التقييمات الشهرية للطلاب لمتابعة تطور الحفظ والتجويد عبر الأشهر."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/ratings/new",
						className: "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all inline-block",
						children: "تسجيل أول تقييم شهري"
					})
				]
			})
		]
	});
}
//#endregion
export { RatingsHubPage as component };
