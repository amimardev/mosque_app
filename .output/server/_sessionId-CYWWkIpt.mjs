import { o as __toESM } from "./_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "./_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { G as CircleCheck, K as CircleAlert, Q as Calendar, R as History, W as Clock, nt as ArrowRight, o as UserCheck, t as X, v as Search, y as Save } from "./_libs/lucide-react.mjs";
import { a as useAuth, i as Button$1, r as api } from "./_ssr/router-D9XCqWvD.mjs";
import { t as Input } from "./_ssr/input-74l4de9A.mjs";
import { n as FormLabel, t as FormItem } from "./_ssr/form-Bd2PJ9L3.mjs";
import { t as SessionTimeDisplay } from "./_ssr/SessionTimeDisplay-CrBUKltz.mjs";
import { t as Textarea } from "./_ssr/textarea-BnSMNRzM.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-D8jYswLp.mjs";
import { t as QURAN_SURAHS } from "./_ssr/quranData-CM-Mrj3O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_sessionId-CYWWkIpt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SessionAssessmentPage() {
	const { sessionId } = useParams({ from: "/dashboard/sessions/$sessionId/" });
	const { user } = useAuth();
	useNavigate();
	const [session, setSession] = (0, import_react.useState)(null);
	const [records, setRecords] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [successMsg, setSuccessMsg] = (0, import_react.useState)("");
	const [studentSearchQuery, setStudentSearchQuery] = (0, import_react.useState)("");
	const [sessionNotes, setSessionNotes] = (0, import_react.useState)("");
	const [sessionStatus, setSessionStatus] = (0, import_react.useState)("completed");
	const [isSavingRecords, setIsSavingRecords] = (0, import_react.useState)(false);
	const [selectedRecord, setSelectedRecord] = (0, import_react.useState)(null);
	const [progSurah, setProgSurah] = (0, import_react.useState)("");
	const [progAyahStart, setProgAyahStart] = (0, import_react.useState)("");
	const [progAyahEnd, setProgAyahEnd] = (0, import_react.useState)("");
	const [progRemarque, setProgRemarque] = (0, import_react.useState)("");
	const [progAttendance, setProgAttendance] = (0, import_react.useState)("present");
	const [historyStudent, setHistoryStudent] = (0, import_react.useState)(null);
	const [historyData, setHistoryData] = (0, import_react.useState)(null);
	const [isLoadingHistory, setIsLoadingHistory] = (0, import_react.useState)(false);
	const [historyError, setHistoryError] = (0, import_react.useState)("");
	const loadSessionDetails = async () => {
		try {
			setIsLoading(true);
			setError("");
			const res = await api.get(`/api/sessions/${sessionId}`);
			const sessionData = res.data.session;
			const recordsData = res.data.records || [];
			setSession(sessionData);
			setRecords(recordsData);
			setSessionNotes(sessionData.notes || "");
			setSessionStatus(sessionData.status || "completed");
		} catch (err) {
			console.error("Failed to load session details:", err);
			setError(err.response?.data?.error || "فشل في تحميل بيانات وتفاصيل الحصة");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (sessionId) loadSessionDetails();
	}, [sessionId]);
	const handleOpenProgressDialog = (rec) => {
		setSelectedRecord(rec);
		setProgSurah(rec.surahName || "");
		setProgAyahStart(rec.ayahStart || "");
		setProgAyahEnd(rec.ayahEnd || "");
		setProgRemarque(rec.teacherRemarque || rec.absenceReason || "");
		setProgAttendance(rec.attendanceStatus || "present");
	};
	const handleOpenHistoryDialog = async (studentId, studentName) => {
		setHistoryStudent({
			id: studentId,
			name: studentName
		});
		setIsLoadingHistory(true);
		setHistoryError("");
		setHistoryData(null);
		try {
			const res = await api.get(`/api/students/${studentId}/history`);
			setHistoryData(res.data);
		} catch (err) {
			console.error("Failed to load student history:", err);
			setHistoryError(err.response?.data?.error || "فشل في تحميل سجل وتاريخ الطالب");
		} finally {
			setIsLoadingHistory(false);
		}
	};
	const handleSaveStudentProgress = async () => {
		if (!selectedRecord || !session) return;
		const matchedSurah = QURAN_SURAHS.find((s) => s.nameArabic === progSurah);
		const surahNum = matchedSurah ? matchedSurah.number : null;
		const updatedRecord = {
			...selectedRecord,
			attendanceStatus: progAttendance,
			surahName: progAttendance === "present" || progAttendance === "late" ? progSurah || null : null,
			surahNumber: progAttendance === "present" || progAttendance === "late" ? surahNum : null,
			ayahStart: (progAttendance === "present" || progAttendance === "late") && progAyahStart ? Number(progAyahStart) : null,
			ayahEnd: (progAttendance === "present" || progAttendance === "late") && progAyahEnd ? Number(progAyahEnd) : null,
			absenceReason: progAttendance === "absent" || progAttendance === "excused" ? progRemarque.trim() || null : null,
			teacherRemarque: progAttendance === "present" || progAttendance === "late" ? progRemarque.trim() || null : null,
			isAssessed: true
		};
		const updated = records.map((r) => {
			if (r.id === selectedRecord.id) return updatedRecord;
			return r;
		});
		setRecords(updated);
		setSelectedRecord(null);
		try {
			await api.post(`/api/sessions/${session.id}/records/${selectedRecord.id}`, updatedRecord);
		} catch (err) {
			console.error("Failed to save student assessment to DB:", err);
		}
	};
	const handleSaveAllRecords = async () => {
		if (!session) return;
		setIsSavingRecords(true);
		setError("");
		setSuccessMsg("");
		try {
			await api.post(`/api/sessions/${session.id}/records`, {
				records,
				notes: sessionNotes.trim(),
				status: sessionStatus
			});
			setSuccessMsg("تم حفظ وتحديث كافة بيانات وتقييمات الحصة بنجاح");
			setTimeout(() => setSuccessMsg(""), 4e3);
		} catch (err) {
			setError(err.response?.data?.error || "فشل في حفظ سجلات الحصة");
		} finally {
			setIsSavingRecords(false);
		}
	};
	const formatArabicDate = (dateStr) => {
		if (!dateStr) return "";
		const [y, m, d] = dateStr.split("-");
		return `${d} ${[
			"يناير",
			"فبراير",
			"مارس",
			"أبريل",
			"مايو",
			"يونيو",
			"يوليو",
			"أغسطس",
			"سبتمبر",
			"أكتوبر",
			"نوفمبر",
			"ديسمبر"
		][parseInt(m) - 1]} ${y}`;
	};
	const getDayNameArabic = (dateStr) => {
		if (!dateStr) return "";
		return [
			"الأحد",
			"الاثنين",
			"الثلاثاء",
			"الأربعاء",
			"الخميس",
			"الجمعة",
			"السبت"
		][new Date(dateStr).getDay()] || "";
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6 text-right font-sans",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-20 text-center text-slate-500 font-bold bg-white rounded-3xl border border-slate-100 shadow-xs",
			children: "جاري تحميل بيانات تقييم الحصة..."
		})
	});
	if (error && !session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6 text-right font-sans",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard/sessions",
				className: "px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold",
				children: "العودة إلى الحصص"
			})]
		})
	});
	const totalStudents = records.length;
	const assessedCount = records.filter((r) => r.isAssessed).length;
	const pendingCount = totalStudents - assessedCount;
	const displayedRecords = records.filter((rec) => {
		if (studentSearchQuery && !rec.studentName.toLowerCase().includes(studentSearchQuery.toLowerCase())) return false;
		return true;
	}).sort((a, b) => {
		const aVal = a.isAssessed ? 1 : 0;
		const bVal = b.isAssessed ? 1 : 0;
		if (aVal !== bVal) return aVal - bVal;
		return a.studentName.localeCompare(b.studentName);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-right font-sans max-w-6xl mx-auto",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/sessions",
					className: "inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all shadow-2xs group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العودة إلى جدول الحصص" })]
				}), user?.role !== "parent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-slate-700",
						children: "حالة الحصة:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sessionStatus,
						onValueChange: (val) => setSessionStatus(val),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-36 h-8 text-xs font-bold bg-white text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "scheduled",
								children: "مجدولة"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "completed",
								children: "مكتملة (تم الرصد)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cancelled",
								children: "ملغاة"
							})
						] })]
					})]
				})]
			}),
			session && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2.5 py-0.5 rounded-lg text-xs font-bold ${session.sessionType === "exception" ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`,
								children: session.sessionType === "exception" ? "حصة استثنائية" : "حصة أساسية"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2.5 py-0.5 rounded-lg text-xs font-bold ${session.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-700"}`,
								children: session.status === "completed" ? "مكتملة ومقيّمة" : "مجدولة"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-xl sm:text-2xl font-extrabold text-slate-900",
							children: [
								"تقييم حضور وأداء الطلاب • حلقة رقم ",
								session.groupNumber,
								" (",
								session.level || "المستوى العام",
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										formatArabicDate(session.date),
										" (",
										session.date,
										")"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, { entry: session })]
								}),
								session.teacherName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["المعلم: ", session.teacherName] })]
								})] })
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-slate-400 block font-bold",
									children: "الإجمالي"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-extrabold text-slate-900",
									children: totalStudents
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-emerald-700 block font-bold",
									children: "تم التقييم"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-extrabold text-emerald-800",
									children: assessedCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-amber-700 block font-bold",
									children: "في الانتظار"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-extrabold text-amber-800",
									children: pendingCount
								})]
							})
						]
					})]
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}),
			successMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-2xl flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 shrink-0 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMsg })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full sm:w-80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "text",
								value: studentSearchQuery,
								onChange: (e) => setStudentSearchQuery(e.target.value),
								placeholder: "البحث السريع عن طالب...",
								className: "w-full pl-3 pr-9 py-2 bg-slate-50 border-slate-200 text-xs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute right-3 top-2.5" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-slate-500 font-medium",
							children: "يتم عرض الطلاب غير المقيَّمين (في الانتظار) في أعلى القائمة لتسهيل الرصد"
						})]
					}),
					displayedRecords.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-medium",
						children: "لا يوجد طلاب مطابقين للبحث"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block rounded-2xl border border-slate-200 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-right text-xs border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-slate-50 border-b border-slate-200 text-slate-600 font-bold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "صورة واسم الطالب"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-center",
										children: "حالة التقييم"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "حالة الحضور"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "مقدار الحفظ والتسميع والملاحظات"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-left",
										children: "الإجراء"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-100 bg-white",
								children: displayedRecords.map((rec) => {
									const isAssessed = !!rec.isAssessed;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-slate-50/50 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(rec.studentName)}`,
														alt: rec.studentName,
														className: "w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-slate-900 block text-xs sm:text-sm",
														children: rec.studentName
													}), rec.studentAge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] text-slate-400 block font-medium",
														children: [rec.studentAge, " سنة"]
													}) : null] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-center",
												children: isAssessed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "inline-flex items-center gap-1.5 text-emerald-700 font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تم التقييم" })]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "inline-flex items-center gap-1.5 text-amber-700 font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "في الانتظار" })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold ${rec.attendanceStatus === "present" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : rec.attendanceStatus === "absent" ? "bg-rose-50 text-rose-800 border border-rose-200" : rec.attendanceStatus === "late" ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-blue-50 text-blue-800 border border-blue-200"}`,
													children: rec.attendanceStatus === "present" ? "حاضر" : rec.attendanceStatus === "absent" ? "غائب" : rec.attendanceStatus === "late" ? "متأخر" : "بعذر"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-slate-600",
												children: isAssessed && rec.attendanceStatus === "present" && rec.surahName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-slate-900 block text-xs",
													children: [
														"سورة ",
														rec.surahName,
														" ",
														rec.ayahStart && rec.ayahEnd ? `(${rec.ayahStart} - ${rec.ayahEnd})` : ""
													]
												}), rec.teacherRemarque && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-slate-500 truncate max-w-xs mt-0.5",
													children: [
														"\"",
														rec.teacherRemarque,
														"\""
													]
												})] }) : isAssessed && (rec.attendanceStatus === "absent" || rec.attendanceStatus === "excused") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 text-[11px]",
													children: rec.absenceReason || rec.teacherRemarque || "غائب عن الحصة"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-400 text-[11px]",
													children: "—"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-left",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 justify-end",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
														size: "sm",
														variant: "ghost",
														onClick: () => handleOpenHistoryDialog(rec.studentId, rec.studentName),
														className: "h-7 text-xs font-bold rounded-lg px-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 gap-1",
														title: "عرض سجل ومحفوظ الطالب",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "hidden lg:inline",
															children: "السجل"
														})]
													}), user?.role !== "parent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
														size: "sm",
														variant: isAssessed ? "outline" : "default",
														onClick: () => handleOpenProgressDialog(rec),
														className: `h-7 text-xs font-bold rounded-lg px-3 ${!isAssessed ? "bg-slate-900 hover:bg-slate-800 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAssessed ? "تعديل التقييم" : "تقييم" })
													})]
												})
											})
										]
									}, rec.id);
								})
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "block md:hidden space-y-2.5",
						children: displayedRecords.map((rec) => {
							const isAssessed = !!rec.isAssessed;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(rec.studentName)}`,
											alt: rec.studentName,
											className: "w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-slate-900 block text-xs",
											children: rec.studentName
										}), rec.studentAge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-slate-400 block",
											children: [rec.studentAge, " سنة"]
										}) : null] })]
									}), isAssessed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تم التقييم" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "في الانتظار" })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 pt-2 border-t border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 text-[10px]",
												children: "الحضور:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${rec.attendanceStatus === "present" ? "bg-emerald-50 text-emerald-800" : rec.attendanceStatus === "absent" ? "bg-rose-50 text-rose-800" : rec.attendanceStatus === "late" ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-blue-800"}`,
												children: rec.attendanceStatus === "present" ? "حاضر" : rec.attendanceStatus === "absent" ? "غائب" : rec.attendanceStatus === "late" ? "متأخر" : "بعذر"
											})]
										}), isAssessed && rec.attendanceStatus === "present" && rec.surahName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-slate-700 font-medium text-[11px]",
											children: [
												"سورة ",
												rec.surahName,
												" ",
												rec.ayahStart && rec.ayahEnd ? `(${rec.ayahStart} - ${rec.ayahEnd})` : ""
											]
										}) : isAssessed && (rec.attendanceStatus === "absent" || rec.attendanceStatus === "excused") && (rec.absenceReason || rec.teacherRemarque) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-slate-500 text-[10px]",
											children: ["العذر: ", rec.absenceReason || rec.teacherRemarque]
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
											size: "sm",
											variant: "ghost",
											onClick: () => handleOpenHistoryDialog(rec.studentId, rec.studentName),
											className: "h-7 text-xs font-bold rounded-lg px-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5" })
										}), user?.role !== "parent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
											size: "sm",
											variant: isAssessed ? "outline" : "default",
											onClick: () => handleOpenProgressDialog(rec),
											className: `h-7 text-xs font-bold rounded-lg px-2.5 shrink-0 ${!isAssessed ? "bg-slate-900 hover:bg-slate-800 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAssessed ? "تعديل" : "تقييم" })
										})]
									})]
								})]
							}, rec.id);
						})
					})] }),
					user?.role !== "parent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-4 border-t border-slate-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
							htmlFor: "sessionNotes",
							className: "text-xs text-slate-700 font-bold",
							children: "ملاحظات عامة حول أداء الحلقة والحصة:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "sessionNotes",
							rows: 3,
							value: sessionNotes,
							onChange: (e) => setSessionNotes(e.target.value),
							placeholder: "اكتب أي ملاحظات عامة أو توجيهات حول أداء طلاب الحلقة إجمالاً في هذه الحصة...",
							className: "bg-slate-50 text-xs"
						})] })
					}),
					user?.role !== "parent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 flex items-center justify-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							onClick: handleSaveAllRecords,
							disabled: isSavingRecords,
							className: "bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs gap-2 px-5 py-2.5 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSavingRecords ? "جاري الحفظ..." : "حفظ وإنهاء رصد الحصة" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/sessions",
							className: "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all",
							children: "إلغاء والعودة"
						})]
					})
				]
			}),
			selectedRecord && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(selectedRecord.studentName)}`,
								alt: selectedRecord.studentName,
								className: "w-8 h-8 rounded-full border border-slate-200"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-slate-900",
								children: ["تقييم الطالب: ", selectedRecord.studentName]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-slate-400",
								children: ["حلقة رقم ", session?.groupNumber]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedRecord(null),
							className: "w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-600 font-medium",
									children: "الاطلاع على الحفظ والحضور السابق:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => handleOpenHistoryDialog(selectedRecord.studentId, selectedRecord.studentName),
									className: "h-7 text-xs font-bold rounded-lg border-slate-300 text-slate-700 hover:bg-white gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "سجل الطالب" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
								className: "block text-xs font-bold text-slate-700 mb-1.5",
								children: "حالة الحضور:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-1.5",
								children: [
									{
										value: "present",
										label: "حاضر"
									},
									{
										value: "absent",
										label: "غائب"
									},
									{
										value: "late",
										label: "متأخر"
									},
									{
										value: "excused",
										label: "بعذر"
									}
								].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setProgAttendance(opt.value),
									className: `py-1.5 text-center text-xs font-bold rounded-lg border transition-colors cursor-pointer ${progAttendance === opt.value ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`,
									children: opt.label
								}, opt.value))
							})] }),
							progAttendance === "present" || progAttendance === "late" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-3 border-t border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "text-xs text-slate-700 font-bold",
									children: "اسم السورة:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: progSurah || "none",
									onValueChange: (val) => setProgSurah(val === "none" ? "" : val),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-slate-50 text-right text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر السورة" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "-- غير محدد --"
									}), QURAN_SURAHS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: s.nameArabic,
										children: [
											s.number,
											". سورة ",
											s.nameArabic,
											" (",
											s.totalAyahs,
											" آية)"
										]
									}, s.number))] })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										className: "text-xs text-slate-700 font-bold",
										children: "من الآية:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: progAyahStart,
										onChange: (e) => setProgAyahStart(e.target.value),
										placeholder: "مثال: 1",
										className: "bg-slate-50 text-center font-mono text-xs"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										className: "text-xs text-slate-700 font-bold",
										children: "إلى الآية:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: progAyahEnd,
										onChange: (e) => setProgAyahEnd(e.target.value),
										placeholder: "مثال: 10",
										className: "bg-slate-50 text-center font-mono text-xs"
									})] })]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-3 border-t border-slate-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "text-xs text-slate-700 font-bold",
									children: "سبب الغياب / العذر:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "text",
									value: progRemarque,
									onChange: (e) => setProgRemarque(e.target.value),
									placeholder: "اكتب سبب الغياب إن وجد...",
									className: "bg-slate-50 text-xs"
								})] })
							}),
							(progAttendance === "present" || progAttendance === "late") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-3 border-t border-slate-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "text-xs text-slate-700 font-bold",
									children: "ملاحظات المعلم والتوجيه:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: progRemarque,
									onChange: (e) => setProgRemarque(e.target.value),
									placeholder: "ملاحظات حول التجويد، الحفظ، أو التثبيت...",
									className: "bg-slate-50 text-right text-xs"
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-slate-100 flex items-center justify-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
									onClick: handleSaveStudentProgress,
									className: "bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حفظ التقييم" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
									variant: "outline",
									onClick: () => setSelectedRecord(null),
									className: "rounded-lg text-xs",
									children: "إلغاء"
								})]
							})
						]
					})]
				})
			}),
			historyStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-bold text-slate-900",
								children: ["سجل الطالب: ", historyStudent.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400",
								children: "آخر تقدّم وحضور الطالب في الحصص السابقة"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setHistoryStudent(null);
								setHistoryData(null);
							},
							className: "w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-5",
						children: [isLoadingHistory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-10 text-center text-xs text-slate-400 font-medium",
							children: "جاري جلب سجل وتقدم الطالب..."
						}) : historyError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl",
							children: historyError
						}) : historyData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-500 font-bold block",
									children: "آخر تقدّم (آخر حصة حضر فيها الطالب):"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-black text-slate-900",
									children: [
										"سورة ",
										historyData.lastProgress.surahName,
										" • الآية ",
										historyData.lastProgress.latestVerse
									]
								}),
								historyData.lastProgress.date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-slate-400 block font-medium",
									children: ["تاريخ الحصة: ", formatArabicDate(historyData.lastProgress.date)]
								}),
								historyData.lastProgress.teacherRemarque && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-slate-200/70",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold text-slate-500 block mb-1",
										children: "ملاحظة المعلم على الحفظ في تلك الحصة:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed",
										children: [
											"\"",
											historyData.lastProgress.teacherRemarque,
											"\""
										]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-slate-700 font-bold block",
								children: "حالة آخر 5 حصص للطالب:"
							}), historyData.latestSessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center bg-slate-50 rounded-xl text-slate-400 text-xs font-medium",
								children: "لا توجد حصص سابقة مسجلة للطالب"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-slate-200 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-right text-xs border-collapse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "bg-slate-50 border-b border-slate-200 text-slate-600 font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3",
											children: "يوم وتاريخ الحصة"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2.5 px-3 text-left",
											children: "حالة الحضور"
										})]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-slate-100 bg-white",
										children: historyData.latestSessions.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 px-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-slate-800 block",
													children: [
														getDayNameArabic(s.date),
														" (",
														formatArabicDate(s.date),
														")"
													]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2.5 px-3 text-left",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${s.status === "present" ? "bg-emerald-50 text-emerald-800" : s.status === "absent" ? "bg-rose-50 text-rose-800" : s.status === "late" ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-blue-800"}`,
													children: s.status === "present" ? "حاضر" : s.status === "absent" ? "غائب" : s.status === "late" ? "متأخر" : "بعذر"
												})
											})]
										}, idx))
									})]
								})
							})]
						})] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 flex justify-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
								type: "button",
								variant: "outline",
								onClick: () => {
									setHistoryStudent(null);
									setHistoryData(null);
								},
								className: "rounded-lg text-xs",
								children: "إغلاق السجل"
							})
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { SessionAssessmentPage as component };
