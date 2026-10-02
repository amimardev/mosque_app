import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, w as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useForm } from "../_libs/@tanstack/react-form+[...].mjs";
import { a as string, r as object } from "../_libs/zod.mjs";
import { nt as ArrowRight, r as User, tt as Award, y as Save } from "../_libs/lucide-react.mjs";
import { i as Button$1, r as api } from "./router-DHZqPWB-.mjs";
import { t as Input } from "./input-74l4de9A.mjs";
import { n as FormLabel, t as FormItem } from "./form-Bd2PJ9L3.mjs";
import { t as Textarea } from "./textarea-BnSMNRzM.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D8jYswLp.mjs";
import { t as QURAN_SURAHS } from "./quranData-CM-Mrj3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-DfhkfKNI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RatingForm = ({ initialData, students, teachers, preselectedStudentId, onSave, onCancel, title, subtitle }) => {
	const [isSubmitting, setIsSubmitting] = import_react.useState(false);
	const [error, setError] = import_react.useState("");
	const defaultStudentId = initialData?.studentId || preselectedStudentId || students[0]?.id || "";
	const defaultTeacherId = initialData?.teacherId || teachers[0]?.id || "";
	const matchedStudent = students.find((s) => s.id === defaultStudentId);
	const form = useForm({
		defaultValues: {
			studentId: defaultStudentId,
			teacherId: defaultTeacherId,
			month: initialData?.month || "2026-09",
			hifzScore: initialData?.hifzScore ?? 95,
			tajweedScore: initialData?.tajweedScore ?? 90,
			murajaahScore: initialData?.murajaahScore ?? 92,
			attendanceScore: initialData?.attendanceScore ?? 95,
			behaviorScore: initialData?.behaviorScore ?? 100,
			surahEvaluated: initialData?.surahEvaluated || matchedStudent?.currentSurahName || "Al-Baqarah",
			ayahStart: initialData?.ayahStart ?? 1,
			ayahEnd: initialData?.ayahEnd ?? 20,
			notes: initialData?.notes || "",
			updateStudentSurah: !initialData
		},
		onSubmit: async ({ value }) => {
			if (!value.studentId) {
				setError("يرجى اختيار الطالب المراد تقييمه");
				return;
			}
			setIsSubmitting(true);
			setError("");
			const overall = Math.round(value.hifzScore * .35 + value.tajweedScore * .25 + value.murajaahScore * .2 + value.attendanceScore * .1 + value.behaviorScore * .1);
			let calcGrade = "مقبول (Acceptable)";
			if (overall >= 95) calcGrade = "ممتاز مرتفع (Mumtaz)";
			else if (overall >= 88) calcGrade = "ممتاز (Excellent)";
			else if (overall >= 80) calcGrade = "جيد جداً (Very Good)";
			else if (overall >= 70) calcGrade = "جيد (Good)";
			else if (overall < 60) calcGrade = "ضعيف يحتاج متابعة (Needs Improvement)";
			try {
				await onSave({
					studentId: value.studentId,
					teacherId: value.teacherId || void 0,
					month: value.month,
					hifzScore: Number(value.hifzScore),
					tajweedScore: Number(value.tajweedScore),
					murajaahScore: Number(value.murajaahScore),
					attendanceScore: Number(value.attendanceScore),
					behaviorScore: Number(value.behaviorScore),
					overallScore: overall,
					grade: calcGrade,
					surahEvaluated: value.surahEvaluated,
					ayahStart: Number(value.ayahStart) || void 0,
					ayahEnd: Number(value.ayahEnd) || void 0,
					notes: value.notes.trim() || void 0,
					updateStudentSurah: value.updateStudentSurah
				});
			} catch (err) {
				setError(err.message || "فشل في حفظ التقييم الشهري");
			} finally {
				setIsSubmitting(false);
			}
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto space-y-6 text-right pb-16",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						type: "button",
						variant: "outline",
						size: "icon",
						onClick: onCancel,
						className: "rounded-xl shadow-2xs",
						title: "الرجوع",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-slate-500",
							children: subtitle
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
					type: "button",
					onClick: () => form.handleSubmit(),
					disabled: isSubmitting,
					className: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الحفظ..." : "حفظ التقييم" })]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				},
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
						selector: (state) => [
							state.values.hifzScore,
							state.values.tajweedScore,
							state.values.murajaahScore,
							state.values.attendanceScore,
							state.values.behaviorScore
						],
						children: ([h, t, m, a, b]) => {
							const overall = Math.round(Number(h) * .35 + Number(t) * .25 + Number(m) * .2 + Number(a) * .1 + Number(b) * .1);
							let gradeStr = "مقبول (Acceptable)";
							if (overall >= 95) gradeStr = "ممتاز مرتفع (Mumtaz)";
							else if (overall >= 88) gradeStr = "ممتاز (Excellent)";
							else if (overall >= 80) gradeStr = "جيد جداً (Very Good)";
							else if (overall >= 70) gradeStr = "جيد (Good)";
							else if (overall < 60) gradeStr = "ضعيف يحتاج متابعة (Needs Improvement)";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 bg-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase font-bold text-emerald-300 tracking-wider block",
										children: "التقدير والدرجة الإجمالية المحسوبة"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-baseline gap-2 mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl sm:text-3xl font-extrabold",
											children: gradeStr
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-300 mt-1",
										children: "الوزن النسبي: الحفظ الجديد (35%) + التجويد ومخارج الحروف (25%) + المراجعة والتثبيت (20%) + الحضور والانضباط (10%) + السلوك والآداب (10%)"
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left sm:border-r sm:border-emerald-800 sm:pr-6",
									dir: "ltr",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-300 uppercase block font-semibold",
										children: "المعدل العام"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-4xl font-extrabold font-mono text-emerald-400",
										children: [overall, "%"]
									})]
								})]
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. تعيين الطالب والمعلم وشهر التقييم" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "studentId",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
										htmlFor: field.name,
										children: ["اختيار الطالب ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: field.state.value,
										onValueChange: (val) => {
											field.handleChange(val);
											const s = students.find((item) => item.id === val);
											if (s) {
												form.setFieldValue("surahEvaluated", s.currentSurahName || "Al-Baqarah");
												form.setFieldValue("ayahEnd", s.currentAyah || 20);
											}
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: field.name,
											className: "w-full bg-white text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "-- اختر الطالب --" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: students.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: s.id,
											children: [
												s.name,
												" (",
												s.group ? `حلقة رقم ${s.group.number}` : "بدون حلقة",
												")"
											]
										}, s.id)) })]
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "teacherId",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										htmlFor: field.name,
										children: "الشيخ / المعلم المقيم"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: field.state.value,
										onValueChange: field.handleChange,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: field.name,
											className: "w-full bg-white text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "-- اختر المعلم --" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: teachers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: t.id,
											children: [
												t.name,
												" (",
												t.specialization,
												")"
											]
										}, t.id)) })]
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "month",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										htmlFor: field.name,
										children: "شهر التقييم"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: field.name,
										name: field.name,
										type: "month",
										value: field.state.value,
										onBlur: field.handleBlur,
										onChange: (e) => field.handleChange(e.target.value),
										className: "text-center font-mono font-bold"
									})] })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 pt-4 border-t border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. درجات معايير التقييم (من 0 إلى 100)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "hifzScore",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-slate-800",
												children: "1. الحفظ الجديد والاستيعاب (35%)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-extrabold text-emerald-700 font-mono",
												dir: "ltr",
												children: [field.state.value, "/100"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "40",
											max: "100",
											value: field.state.value,
											onChange: (e) => field.handleChange(Number(e.target.value)),
											className: "w-full accent-emerald-600 cursor-pointer"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "tajweedScore",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-slate-800",
												children: "2. أحكام التجويد ومخارج الحروف (25%)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-extrabold text-emerald-700 font-mono",
												dir: "ltr",
												children: [field.state.value, "/100"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "40",
											max: "100",
											value: field.state.value,
											onChange: (e) => field.handleChange(Number(e.target.value)),
											className: "w-full accent-emerald-600 cursor-pointer"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "murajaahScore",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-slate-800",
												children: "3. المراجعة والتثبيت الماضي (20%)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-extrabold text-emerald-700 font-mono",
												dir: "ltr",
												children: [field.state.value, "/100"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "40",
											max: "100",
											value: field.state.value,
											onChange: (e) => field.handleChange(Number(e.target.value)),
											className: "w-full accent-emerald-600 cursor-pointer"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "attendanceScore",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-slate-800",
												children: "4. الحضور والانضباط والآداب (20%)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-extrabold text-emerald-700 font-mono",
												dir: "ltr",
												children: [field.state.value, "/100"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "40",
											max: "100",
											value: field.state.value,
											onChange: (e) => field.handleChange(Number(e.target.value)),
											className: "w-full accent-emerald-600 cursor-pointer"
										})]
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. السورة ومقدار الآيات التي تم اختبار الطالب فيها" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "surahEvaluated",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "السورة القرآنية المختبر فيها"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: field.state.value,
											onValueChange: field.handleChange,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: field.name,
												className: "w-full bg-white text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر السورة..." })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: QURAN_SURAHS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: s.nameArabic,
												children: [
													s.number,
													". سورة ",
													s.nameArabic,
													" (",
													s.totalAyahs,
													" آية)"
												]
											}, s.number)) })]
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "ayahStart",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "من الآية رقم"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: field.name,
											name: field.name,
											type: "number",
											min: 1,
											value: field.state.value,
											onBlur: field.handleBlur,
											onChange: (e) => field.handleChange(Number(e.target.value)),
											className: "text-center font-bold"
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "ayahEnd",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "إلى الآية رقم"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: field.name,
											name: field.name,
											type: "number",
											min: 1,
											value: field.state.value,
											onBlur: field.handleBlur,
											onChange: (e) => field.handleChange(Number(e.target.value)),
											className: "text-center font-bold"
										})] })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "notes",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									htmlFor: field.name,
									children: "ملاحظات وتوجيهات الأداء (اختياري)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: field.name,
									name: field.name,
									rows: 3,
									value: field.state.value,
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "ملاحظات حول التجويد ومخارج الحروف، التوجيهات لأولياء الأمور...",
									className: "text-right"
								})] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-slate-100 flex items-center justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							type: "button",
							variant: "ghost",
							onClick: onCancel,
							className: "rounded-xl",
							children: "إلغاء"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							type: "submit",
							disabled: isSubmitting,
							className: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الحفظ..." : "حفظ التقييم" })]
						})]
					})
				]
			})
		]
	});
};
object({ studentId: string().optional() });
function NewRatingPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/dashboard/ratings/new" });
	const [students, setStudents] = (0, import_react.useState)([]);
	const [teachers, setTeachers] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadData() {
			try {
				setIsLoading(true);
				const [studentsRes, teachersRes] = await Promise.all([api.get("/api/students"), api.get("/api/teachers")]);
				setStudents(studentsRes.data.students || []);
				setTeachers(teachersRes.data.teachers || []);
			} catch (e) {
				console.error("Failed to load rating form data:", e);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, []);
	const handleSave = async (ratingData) => {
		await api.post("/api/ratings", ratingData);
		navigate({ to: "/dashboard/ratings" });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل النموذج..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatingForm, {
		students,
		teachers,
		preselectedStudentId: search.studentId,
		onSave: handleSave,
		onCancel: () => navigate({ to: "/dashboard/ratings" }),
		title: "إجراء تقييم شهري جديد",
		subtitle: "تقييم حفظ الطالب الجديد، أحكام التجويد ومخارج الحروف، المراجعة، والانضباط الشهري."
	});
}
//#endregion
export { NewRatingPage as component };
