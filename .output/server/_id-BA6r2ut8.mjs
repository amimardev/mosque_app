import { o as __toESM } from "./_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "./_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as useForm } from "./_libs/@tanstack/react-form+[...].mjs";
import { n as formatArabicAge } from "./_ssr/ageUtils-DAte9AqJ.mjs";
import { G as CircleCheck, K as CircleAlert, S as Phone, W as Clock, et as BookOpen, l as Trash2, nt as ArrowRight, p as SquarePen, r as User, t as X, tt as Award, x as Plus, y as Save } from "./_libs/lucide-react.mjs";
import { i as Button$1, r as api } from "./_ssr/router-Bezq88tF.mjs";
import { n as FormLabel, t as FormItem } from "./_ssr/form-Bd2PJ9L3.mjs";
import { t as ScrollArea } from "./_ssr/scroll-area-Ci2SgH4c.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-D8jYswLp.mjs";
import { t as QURAN_SURAHS } from "./_ssr/quranData-CM-Mrj3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BA6r2ut8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ChangeParentModal = ({ isOpen, onClose, student, onSuccess }) => {
	if (!isOpen) return null;
	const [parents, setParents] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [successMsg, setSuccessMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadParents() {
			try {
				setIsLoading(true);
				const res = await api.get("/api/parents");
				setParents(res.data.parents || []);
			} catch (err) {
				console.error("Failed to load parents list:", err);
			} finally {
				setIsLoading(false);
			}
		}
		loadParents();
	}, [isOpen]);
	const form = useForm({
		defaultValues: { parentId: student.parentId || "none" },
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			setError("");
			setSuccessMsg("");
			try {
				await api.put(`/api/students/${student.id}`, { parentId: value.parentId === "none" ? null : value.parentId || null });
				setSuccessMsg("تم تحديث ارتباط ولي الأمر للطالب بنجاح");
				await onSuccess();
				setTimeout(() => {
					onClose();
				}, 700);
			} catch (err) {
				console.error("Failed to update student parent:", err);
				setError(err.response?.data?.error || err.message || "فشل في ربط ولي الأمر بالطالب");
			} finally {
				setIsSubmitting(false);
			}
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col overflow-hidden text-right",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base sm:text-lg font-extrabold text-slate-900",
						children: "اختيار وتحديد ولي الأمر للطالب"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500",
						children: ["الطالب: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-teal-800",
							children: student.name
						})]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				},
				className: "p-5 sm:p-6 space-y-4",
				children: [
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
					}),
					successMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMsg })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
						name: "parentId",
						children: (field) => {
							const selectedParent = parents.find((p) => p.id === field.state.value);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									htmlFor: field.name,
									children: "اختر ولي الأمر من القائمة المسجلة:"
								}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400",
									children: "جاري تحميل قائمة أولياء الأمور..."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: field.state.value,
									onValueChange: field.handleChange,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: field.name,
										className: "w-full bg-slate-50 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "-- بدون ولي أمر محدد (إلغاء الارتباط) --" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "-- بدون ولي أمر محدد (إلغاء الارتباط) --"
									}), parents.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: p.id,
										children: [
											p.name,
											" (",
											p.phone,
											") ",
											p.studentsCount ? `- الأبناء: ${p.studentsCount}` : ""
										]
									}, p.id))] })]
								})] }), selectedParent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-teal-800 block",
											children: "بيانات ولي الأمر المحدد:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs sm:text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-extrabold text-slate-900",
												children: selectedParent.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-teal-800 font-bold flex items-center gap-1",
												dir: "ltr",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-teal-600" }), selectedParent.phone]
											})]
										}),
										selectedParent.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-slate-500",
											children: ["البريد الإلكتروني: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-slate-700",
												children: selectedParent.email
											})]
										})
									]
								})]
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-slate-100 flex items-center justify-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							type: "submit",
							disabled: isSubmitting,
							className: "bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl gap-2 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الربط..." : "تأكيد اختيار ولي الأمر" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							type: "button",
							variant: "secondary",
							onClick: onClose,
							className: "rounded-xl",
							children: "إلغاء"
						})]
					})
				]
			})]
		})
	});
};
function StudentDetailsPage() {
	const { id } = useParams({ from: "/dashboard/students/$id/" });
	const navigate = useNavigate();
	const [student, setStudent] = (0, import_react.useState)(null);
	const [teachers, setTeachers] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [isRatingModalOpen, setIsRatingModalOpen] = (0, import_react.useState)(false);
	const [isChangeParentModalOpen, setIsChangeParentModalOpen] = (0, import_react.useState)(false);
	const [viewedSessionRecord, setViewedSessionRecord] = (0, import_react.useState)(null);
	const [editingRating, setEditingRating] = (0, import_react.useState)(null);
	const [evalMonth, setEvalMonth] = (0, import_react.useState)("2026-09");
	const [evalTeacherId, setEvalTeacherId] = (0, import_react.useState)("");
	const [evalHifz, setEvalHifz] = (0, import_react.useState)(95);
	const [evalTajweed, setEvalTajweed] = (0, import_react.useState)(90);
	const [evalMurajaah, setEvalMurajaah] = (0, import_react.useState)(92);
	const [evalAttendance, setEvalAttendance] = (0, import_react.useState)(95);
	const [evalBehavior, setEvalBehavior] = (0, import_react.useState)(100);
	const [evalSurah, setEvalSurah] = (0, import_react.useState)("Al-Baqarah");
	const [evalAyahStart, setEvalAyahStart] = (0, import_react.useState)(1);
	const [evalAyahEnd, setEvalAyahEnd] = (0, import_react.useState)(50);
	const [evalNotes, setEvalNotes] = (0, import_react.useState)("");
	const [isSavingRating, setIsSavingRating] = (0, import_react.useState)(false);
	const loadStudent = async () => {
		try {
			setIsLoading(true);
			const [studentRes, teachersRes] = await Promise.all([api.get(`/api/students/${id}`), api.get("/api/teachers")]);
			const stData = studentRes.data.student || null;
			setStudent(stData);
			setTeachers(teachersRes.data.teachers || []);
			if (stData) {
				setEvalSurah(stData.currentSurahName || "Al-Baqarah");
				setEvalAyahEnd(stData.currentAyah || 50);
			}
		} catch (err) {
			setError(err.message || "Failed to load student details");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadStudent();
	}, [id]);
	const handleDeleteStudent = async () => {
		if (student && window.confirm(`Are you sure you want to delete "${student.name}"?`)) {
			await api.delete(`/api/students/${student.id}`);
			navigate({ to: "/dashboard/students" });
		}
	};
	const handleOpenNewRating = () => {
		setEditingRating(null);
		setEvalMonth((/* @__PURE__ */ new Date()).toISOString().substring(0, 7));
		setEvalTeacherId(teachers.length > 0 ? teachers[0].id : "");
		setEvalHifz(95);
		setEvalTajweed(90);
		setEvalMurajaah(92);
		setEvalAttendance(95);
		setEvalBehavior(100);
		if (student) {
			setEvalSurah(student.currentSurahName || "Al-Baqarah");
			setEvalAyahEnd(student.currentAyah || 50);
		}
		setEvalNotes("");
		setIsRatingModalOpen(true);
	};
	const handleOpenEditRating = (r) => {
		setEditingRating(r);
		setEvalMonth(r.month || "2026-09");
		setEvalTeacherId(r.teacherId || "");
		setEvalHifz(r.hifzScore ?? 90);
		setEvalTajweed(r.tajweedScore ?? 85);
		setEvalMurajaah(r.murajaahScore ?? 88);
		setEvalAttendance(r.attendanceScore ?? 95);
		setEvalBehavior(r.behaviorScore ?? 100);
		setEvalSurah(r.surahEvaluated || "Al-Baqarah");
		setEvalAyahStart(r.ayahStart ?? 1);
		setEvalAyahEnd(r.ayahEnd ?? 50);
		setEvalNotes(r.notes || "");
		setIsRatingModalOpen(true);
	};
	const handleSaveRating = async (e) => {
		e.preventDefault();
		if (!student) return;
		setIsSavingRating(true);
		try {
			const overallScore = Math.round(evalHifz * .35 + evalTajweed * .25 + evalMurajaah * .2 + evalAttendance * .1 + evalBehavior * .1);
			let grade = "Mumtaz (Outstanding)";
			if (overallScore < 60) grade = "Da'eef (Needs Improvement)";
			else if (overallScore < 70) grade = "Maqbool (Acceptable)";
			else if (overallScore < 80) grade = "Jayyid (Good)";
			else if (overallScore < 88) grade = "Jayyid Jiddan (Very Good)";
			else if (overallScore < 95) grade = "Mumtaz (Excellent)";
			const payload = {
				studentId: student.id,
				teacherId: evalTeacherId || void 0,
				month: evalMonth,
				hifzScore: evalHifz,
				tajweedScore: evalTajweed,
				murajaahScore: evalMurajaah,
				attendanceScore: evalAttendance,
				behaviorScore: evalBehavior,
				overallScore,
				grade,
				surahEvaluated: evalSurah,
				ayahStart: Number(evalAyahStart) || void 0,
				ayahEnd: Number(evalAyahEnd) || void 0,
				notes: evalNotes.trim() || void 0,
				updateStudentSurah: true
			};
			if (editingRating) await api.put(`/api/ratings/${editingRating.id}`, payload);
			else await api.post("/api/ratings", payload);
			setIsRatingModalOpen(false);
			await loadStudent();
		} catch (err) {
			console.error("Failed to save rating:", err);
			alert("Failed to save rating evaluation");
		} finally {
			setIsSavingRating(false);
		}
	};
	const handleDeleteRating = async (ratingId) => {
		if (window.confirm("Delete this evaluation entry?")) {
			await api.delete(`/api/ratings/${ratingId}`);
			await loadStudent();
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل ملف الطالب..."
	});
	if (!student || error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center space-y-4 text-right",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-slate-500 font-bold",
			children: "لم يتم العثور على ملف الطالب أو حدث خطأ أثناء التحميل."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard/students",
			className: "px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs inline-block",
			children: "العودة لدليل الطلاب"
		})]
	});
	const juzProgress = Math.min(100, Math.round((student.memorizedJuzCount || 0) / (student.targetJuz || 30) * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/students",
						className: "px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العودة لقائمة الطلاب" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap sm:justify-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleOpenNewRating,
							className: "px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+ إضافة تقييم شهري" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/students/$id/edit",
							params: { id: student.id },
							className: "px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعديل الملف" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleDeleteStudent,
							className: "p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer",
							title: "حذف الطالب",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white text-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-36 sm:w-48 h-48 sm:h-64 rounded-2xl overflow-hidden ring-4 ring-emerald-600/20 shrink-0 bg-slate-100 shadow-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: student.avatar,
							alt: student.name,
							className: "w-full h-full object-cover object-top"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 w-full text-right space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold",
										children: student.status === "active" ? "طالب نشط ومنتظم" : student.status === "graduated" ? "متخرج" : "موقوف مؤقتاً"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold",
										children: ["الجنس: ", student.gender === "male" ? "طالب (ذكر)" : "طالبة (أنثى)"]
									}),
									student.group && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold",
										children: ["مسار ", student.group.type]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900",
								children: student.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-bold min-w-28 shrink-0",
										children: "العمر:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-800",
										children: formatArabicAge(student.dateOfBirth || student.age)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-bold min-w-28 shrink-0",
										children: "الحلقة الدراسية:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-emerald-700",
										children: student.group ? `حلقة رقم ${student.group.number || 1} (${student.group.type})` : "لم يتم التعيين لحلقة"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-bold min-w-28 shrink-0",
										children: "ولي الأمر:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-800",
											children: student.parentName || "غير متوفر"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setIsChangeParentModalOpen(true),
											className: "px-2 py-0.5 text-[10px] bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold rounded-lg transition-colors cursor-pointer",
											children: "تغيير ولي الأمر"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-bold min-w-28 shrink-0",
										children: "هاتف ولي الأمر:"
									}), student.parentPhone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `tel:${student.parentPhone}`,
										className: "font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1.5",
										dir: "ltr",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: student.parentPhone }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-emerald-600" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-slate-400",
										children: "غير متوفر"
									})]
								}),
								student.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400 font-bold min-w-28 shrink-0",
										children: "البريد الإلكتروني:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `mailto:${student.email}`,
										className: "font-medium text-emerald-700 hover:underline truncate",
										children: student.email
									})]
								})
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "مرحلة الحفظ الحالية والهدف المنشود" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase font-bold text-emerald-800",
								children: "السورة الحالية"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xl font-extrabold text-slate-900 mt-0.5",
								children: ["سورة ", student.currentSurahName || "الفاتحة"]
							}),
							student.surahDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-slate-500 block",
								children: [
									"سورة رقم ",
									student.surahDetails.number,
									" • ",
									student.surahDetails.type === "Meccan" ? "مكية" : "مدنية"
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left sm:border-r sm:border-emerald-200 sm:pr-6",
							dir: "ltr",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-emerald-800 font-bold block uppercase",
								children: "موضع الحفظ الحالي"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-2xl font-mono font-extrabold text-emerald-950",
								children: ["الآية ", student.currentAyah || 1]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-800",
								children: ["إجمالي المحفوظ: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-emerald-700 font-extrabold",
									children: [student.memorizedJuzCount || 0, " أجزاء"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-500",
								children: [
									"الهدف: ",
									student.targetJuz || 30,
									" جزء (",
									juzProgress,
									"%)"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-emerald-600 rounded-full transition-all duration-500",
								style: { width: `${Math.max(juzProgress, 5)}%` }
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-slate-100 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-base font-extrabold text-slate-900 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-5 h-5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"التقييمات والدرجات الشهرية (",
							student.ratings?.length || 0,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "الدرجات الأكاديمية الشهرية، أحكام التجويد، اختبارات المراجعة، وملاحظات المشايخ."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleOpenNewRating,
						className: "px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة تقييم" })]
					})]
				}), student.ratings && student.ratings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: student.ratings.map((rating) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-extrabold font-mono text-base flex items-center justify-center shrink-0 shadow-2xs",
										dir: "ltr",
										children: [rating.overallScore, "%"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-extrabold text-slate-900 text-base",
											children: rating.grade
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-mono font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md",
											children: rating.month
										})]
									}), rating.surahEvaluated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-emerald-800 font-bold block mt-0.5",
										children: [
											"السورة المختبرة: سورة ",
											rating.surahEvaluated,
											" ",
											rating.ayahStart && `(من الآية ${rating.ayahStart} إلى ${rating.ayahEnd || "نهاية السورة"})`
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOpenEditRating(rating),
										className: "px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer",
										children: "تعديل"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDeleteRating(rating.id),
										className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
										title: "حذف التقييم",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 bg-white rounded-xl border border-slate-200/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-bold uppercase",
											children: "1. الحفظ (35%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-emerald-800",
											dir: "ltr",
											children: [rating.hifzScore, "/100"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 bg-white rounded-xl border border-slate-200/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-bold uppercase",
											children: "2. التجويد (25%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-emerald-800",
											dir: "ltr",
											children: [rating.tajweedScore, "/100"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 bg-white rounded-xl border border-slate-200/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-bold uppercase",
											children: "3. المراجعة (20%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-emerald-800",
											dir: "ltr",
											children: [rating.murajaahScore, "/100"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 bg-white rounded-xl border border-slate-200/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 block font-bold uppercase",
											children: "4. الحضور والسلوك (20%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold text-emerald-800",
											dir: "ltr",
											children: [rating.attendanceScore, "/100"]
										})]
									})
								]
							}),
							rating.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 italic",
								children: [
									"\"",
									rating.notes,
									"\""
								]
							})
						]
					}, rating.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-10 text-center bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500 font-medium",
						children: [
							"لا توجد تقييمات شهرية مسجلة بعد للطالب ",
							student.name,
							"."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleOpenNewRating,
						className: "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs inline-block transition-colors cursor-pointer",
						children: "إضافة أول تقييم شهري"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-extrabold text-slate-900 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"سجل الأداء اليومي في الحصص واللقاءات اليومية (",
						student.sessions?.length || 0,
						")"
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: "متابعة دقيقة لمقدار الحفظ والتسميع اليومي والمراجعة، مع رصد الغياب وحضور الحصص وملاحظات المشايخ الفردية."
				})] }), student.sessions && student.sessions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: student.sessions.map((ses) => {
						ses.sessionType;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setViewedSessionRecord(ses),
							className: "p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 cursor-pointer hover:bg-slate-100/70 transition-all text-right group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono font-bold text-slate-400",
										children: ses.date
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-xs font-bold text-slate-900 mt-0.5",
										children: ["حصة ", ses.sessionType === "exception" ? "استثنائية" : "أساسية"]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `px-2 py-0.5 rounded-full text-[9px] font-bold ${ses.attendanceStatus === "present" ? "bg-emerald-100 text-emerald-800" : ses.attendanceStatus === "absent" ? "bg-rose-100 text-rose-800" : ses.attendanceStatus === "late" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`,
										children: ses.attendanceStatus === "present" ? "حاضر" : ses.attendanceStatus === "absent" ? "غائب" : ses.attendanceStatus === "late" ? "متأخر" : "بعذر"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white p-3 rounded-xl border border-slate-200/60 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-400 font-bold block mb-1",
											children: "الآيات والسورة المقروءة:"
										}),
										ses.attendanceStatus === "present" && ses.surahName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-extrabold text-emerald-800 block",
											children: [
												"سورة ",
												ses.surahName,
												" (الآية ",
												ses.ayahStart,
												" - ",
												ses.ayahEnd,
												")"
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 font-medium block",
											children: ses.attendanceStatus === "present" ? "لم يرصد تسميع" : "لم يحضر اللقاء"
										}),
										ses.teacherRemarque && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2 border-t border-slate-100 mt-2 text-[10px] text-slate-600 font-medium italic truncate",
											children: [
												"\"",
												ses.teacherRemarque,
												"\""
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-slate-400 font-medium flex justify-between items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["المعلم: ", ses.teacherName || "غير محدد"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-700 font-bold group-hover:underline text-[9px]",
										children: "انقر لعرض الملاحظات الكاملة ←"
									})]
								})
							]
						}, ses.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-10 text-center bg-slate-50 border border-slate-200 rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-slate-500 font-bold",
						children: "لا توجد سجلات حصص يومية مسجلة بعد لهذا الطالب."
					})
				})]
			}),
			viewedSessionRecord && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4",
				dir: "rtl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200 w-full max-w-md overflow-hidden text-right shadow-2xl animate-in fade-in duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm sm:text-base font-extrabold text-slate-900",
							children: "تفاصيل الحصة والأداء اليومي"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-slate-400 font-bold",
							children: viewedSessionRecord.date
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setViewedSessionRecord(null),
							className: "w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4 text-xs sm:text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 pb-3 border-b border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 font-bold block uppercase",
									children: "نوع الحصة:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-extrabold text-slate-800",
									children: viewedSessionRecord.sessionType === "exception" ? "استثنائية" : "أساسية"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 font-bold block uppercase",
									children: "حالة الحضور:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `font-extrabold ${viewedSessionRecord.attendanceStatus === "present" ? "text-emerald-700" : "text-rose-600"}`,
									children: viewedSessionRecord.attendanceStatus === "present" ? "حاضر ومستمع" : "غائب"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400 font-bold block uppercase mb-1",
								children: "المعلم المسمّع:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-800",
								children: viewedSessionRecord.teacherName || "غير محدد"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-emerald-800 font-bold block uppercase mb-1",
									children: "مقدار الحفظ المقروء والتسميع:"
								}), viewedSessionRecord.attendanceStatus === "present" && viewedSessionRecord.surahName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-base font-extrabold text-emerald-950",
									children: [
										"سورة ",
										viewedSessionRecord.surahName,
										" (الآية ",
										viewedSessionRecord.ayahStart,
										" - ",
										viewedSessionRecord.ayahEnd,
										")"
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500 font-bold block",
									children: "لا يوجد تسميع مسجل في هذه الحصة اليوم."
								})]
							}),
							viewedSessionRecord.teacherRemarque && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-teal-50 border border-teal-100 rounded-2xl italic text-teal-950",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-teal-800 font-bold block uppercase not-italic mb-1",
										children: "ملاحظة وتوجيه الشيخ للمعلم وولي الأمر:"
									}),
									"\"",
									viewedSessionRecord.teacherRemarque,
									"\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-3 border-t border-slate-100 flex justify-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setViewedSessionRecord(null),
									className: "px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer",
									children: "إغلاق نافذة التفاصيل"
								})
							})
						]
					})]
				})
			}),
			isRatingModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4",
				dir: "rtl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200 max-w-2xl w-full h-[85vh] max-h-[640px] flex flex-col shadow-2xl relative text-right overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-5 h-5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingRating ? "تعديل التقييم الشهري" : `تقييم جديد للطالب ${student.name}` })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "تسجيل تفاصيل الدرجات والملاحظات التوجيهية"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsRatingModalOpen(false),
							className: "p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveRating,
						className: "flex flex-col flex-1 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
							className: "flex-1 w-full p-4 sm:p-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 mb-1",
											children: "شهر التقييم"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "month",
											required: true,
											value: evalMonth,
											onChange: (e) => setEvalMonth(e.target.value),
											className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-center"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 mb-1",
											children: "الشيخ / المعلم المقيم"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: evalTeacherId,
											onChange: (e) => setEvalTeacherId(e.target.value),
											className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "-- اختر المعلم --"
											}), teachers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: t.id,
												children: t.name
											}, t.id))]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between font-bold flex-row-reverse",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-emerald-700",
														dir: "ltr",
														children: [evalHifz, "/100"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. الحفظ الجديد (35%)" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "40",
													max: "100",
													value: evalHifz,
													onChange: (e) => setEvalHifz(Number(e.target.value)),
													className: "w-full accent-emerald-600"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between font-bold flex-row-reverse",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-emerald-700",
														dir: "ltr",
														children: [evalTajweed, "/100"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. أحكام التجويد (25%)" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "40",
													max: "100",
													value: evalTajweed,
													onChange: (e) => setEvalTajweed(Number(e.target.value)),
													className: "w-full accent-emerald-600"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between font-bold flex-row-reverse",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-emerald-700",
														dir: "ltr",
														children: [evalMurajaah, "/100"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. المراجعة والتثبيت (20%)" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "40",
													max: "100",
													value: evalMurajaah,
													onChange: (e) => setEvalMurajaah(Number(e.target.value)),
													className: "w-full accent-emerald-600"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between font-bold flex-row-reverse",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-emerald-700",
														dir: "ltr",
														children: [evalAttendance, "/100"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4. الحضور والسلوك (20%)" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "40",
													max: "100",
													value: evalAttendance,
													onChange: (e) => setEvalAttendance(Number(e.target.value)),
													className: "w-full accent-emerald-600"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 mb-1",
											children: "السورة التي تم تقييمها"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: evalSurah,
											onChange: (e) => setEvalSurah(e.target.value),
											className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-right",
											children: QURAN_SURAHS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: s.nameEnglish,
												children: [
													s.number,
													". سورة ",
													s.nameArabic,
													" (",
													s.nameEnglish,
													") - ",
													s.totalAyahs,
													" آية"
												]
											}, s.number))
										})] }), (() => {
											const maxAyahs = (QURAN_SURAHS.find((s) => s.nameEnglish === evalSurah) || QURAN_SURAHS[0])?.totalAyahs || 286;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-bold text-slate-700 mb-1",
													children: "من الآية"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "1",
													max: maxAyahs,
													value: evalAyahStart,
													onChange: (e) => setEvalAyahStart(e.target.value),
													className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-center"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-slate-400 block mt-0.5 text-right",
													children: [
														"الحد الأقصى: ",
														maxAyahs,
														" آية"
													]
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-bold text-slate-700 mb-1",
													children: "إلى الآية"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "1",
													max: maxAyahs,
													value: evalAyahEnd,
													onChange: (e) => setEvalAyahEnd(e.target.value),
													className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-center"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-slate-400 block mt-0.5 text-right",
													children: [
														"الحد الأقصى: ",
														maxAyahs,
														" آية"
													]
												})
											] })] });
										})()]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 mb-1",
										children: "ملاحظات وتوجيهات المعلم"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										value: evalNotes,
										onChange: (e) => setEvalNotes(e.target.value),
										placeholder: "ملاحظات حول التلاوة، مخارج الحروف، التجويد، والواجب البيتي...",
										className: "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-right"
									})] })
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-t border-slate-100 flex items-center justify-start gap-2 shrink-0 bg-slate-50/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isSavingRating,
								className: "px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer",
								children: isSavingRating ? "جاري الحفظ..." : "حفظ التقييم"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsRatingModalOpen(false),
								className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer",
								children: "إلغاء"
							})]
						})]
					})]
				})
			}),
			student && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeParentModal, {
				isOpen: isChangeParentModalOpen,
				onClose: () => setIsChangeParentModalOpen(false),
				student,
				onSuccess: loadStudent
			})
		]
	});
}
//#endregion
export { StudentDetailsPage as component };
