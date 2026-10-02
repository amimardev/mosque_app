import { o as __toESM } from "./_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "./_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { B as Funnel, D as MapPin, K as CircleAlert, Q as Calendar, W as Clock, Y as ChevronLeft, b as RefreshCw, l as Trash2, n as Users, nt as ArrowRight, o as UserCheck, p as SquarePen, t as X, u as Sun, x as Plus } from "./_libs/lucide-react.mjs";
import { i as Button$1, n as StudentCard, r as api } from "./_ssr/router-DHZqPWB-.mjs";
import { r as formatSessionTimeArabic } from "./_ssr/types-D-Kr0J12.mjs";
import { t as Input } from "./_ssr/input-74l4de9A.mjs";
import { n as FormLabel, t as FormItem } from "./_ssr/form-Bd2PJ9L3.mjs";
import { t as SessionTimeDisplay } from "./_ssr/SessionTimeDisplay-DbCNkcqt.mjs";
import { t as TeacherCard } from "./_ssr/TeacherCard-Di2MdDsp.mjs";
import { t as Textarea } from "./_ssr/textarea-BnSMNRzM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_groupNumber-BShKuEjk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GroupSessionsModal = ({ isOpen, onClose, groupId, groupNumber }) => {
	if (!isOpen) return null;
	const navigate = useNavigate();
	const getInitialDates = () => {
		const now = /* @__PURE__ */ new Date();
		const past = /* @__PURE__ */ new Date();
		past.setDate(now.getDate() - 30);
		const future = /* @__PURE__ */ new Date();
		future.setDate(now.getDate() + 14);
		return {
			start: past.toISOString().split("T")[0],
			end: future.toISOString().split("T")[0]
		};
	};
	const initial = getInitialDates();
	const [startDate, setStartDate] = (0, import_react.useState)(initial.start);
	const [endDate, setEndDate] = (0, import_react.useState)(initial.end);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const fetchSessions = (0, import_react.useCallback)(async () => {
		try {
			setIsLoading(true);
			setError("");
			let query = `/api/sessions?groupId=${encodeURIComponent(groupId)}`;
			if (startDate) query += `&startDate=${encodeURIComponent(startDate)}`;
			if (endDate) query += `&endDate=${encodeURIComponent(endDate)}`;
			if (statusFilter !== "all") query += `&status=${encodeURIComponent(statusFilter)}`;
			let list = (await api.get(query)).data.sessions || [];
			list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
			if (searchTerm.trim()) {
				const term = searchTerm.trim().toLowerCase();
				list = list.filter((s) => s.date.includes(term) || s.teacherName && s.teacherName.toLowerCase().includes(term) || s.sessionTimeText && s.sessionTimeText.toLowerCase().includes(term));
			}
			setSessions(list);
		} catch (err) {
			console.error("Failed to fetch group sessions:", err);
			setError(err.response?.data?.error || err.message || "فشل في تحميل حصص الحلقة");
		} finally {
			setIsLoading(false);
		}
	}, [
		groupId,
		startDate,
		endDate,
		statusFilter,
		searchTerm
	]);
	(0, import_react.useEffect)(() => {
		if (isOpen) fetchSessions();
	}, [isOpen, fetchSessions]);
	const handleFilterSubmit = (e) => {
		e.preventDefault();
		fetchSessions();
	};
	const handleApplyPreset = (type) => {
		const now = /* @__PURE__ */ new Date();
		if (type === "last30") {
			const past = /* @__PURE__ */ new Date();
			past.setDate(now.getDate() - 30);
			setStartDate(past.toISOString().split("T")[0]);
			setEndDate(now.toISOString().split("T")[0]);
		} else if (type === "currentMonth") {
			const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
			const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			setStartDate(firstDay.toISOString().split("T")[0]);
			setEndDate(lastDay.toISOString().split("T")[0]);
		} else if (type === "all") {
			setStartDate("");
			setEndDate("");
		}
	};
	const handleGoToSession = (sessionId) => {
		onClose();
		navigate({ to: `/dashboard/sessions/${sessionId}` });
	};
	const formatArabicDate = (dateStr) => {
		if (!dateStr) return "";
		try {
			return new Date(dateStr).toLocaleDateString("ar-DZ", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric"
			});
		} catch {
			return dateStr;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0 border border-teal-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-base sm:text-lg font-extrabold text-slate-900",
							children: ["حصص وسجل الحلقة رقم ", groupNumber]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "استعراض جدول الحصص السابقة والقادمة مع إمكانية الانتقال المباشر لتقييم ورصد أي حصة"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-slate-50 border-b border-slate-100 space-y-3 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleFilterSubmit,
						className: "grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-4 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[11px] font-bold text-slate-700 block",
									children: "من تاريخ (البداية):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: startDate,
									onChange: (e) => setStartDate(e.target.value),
									className: "w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-4 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[11px] font-bold text-slate-700 block",
									children: "إلى تاريخ (النهاية):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: endDate,
									onChange: (e) => setEndDate(e.target.value),
									className: "w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sm:col-span-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									className: "w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحديث النتائج" })]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 flex-wrap pt-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-slate-500",
									children: "خيارات سريعة:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleApplyPreset("last30"),
									className: "px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer",
									children: "آخر 30 يوم"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleApplyPreset("currentMonth"),
									className: "px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer",
									children: "الشهر الحالي"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleApplyPreset("all"),
									className: "px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer",
									children: "جميع التواريخ"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 bg-white p-0.5 border border-slate-200 rounded-xl text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStatusFilter("all"),
									className: `px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${statusFilter === "all" ? "bg-teal-800 text-white" : "text-slate-600 hover:bg-slate-100"}`,
									children: "الكل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStatusFilter("completed"),
									className: `px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${statusFilter === "completed" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"}`,
									children: "مكتملة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStatusFilter("scheduled"),
									className: `px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${statusFilter === "scheduled" ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100"}`,
									children: "مجدولة"
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 overflow-y-auto flex-1 space-y-3",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-16 text-center space-y-2 text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-6 h-6 animate-spin mx-auto text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold",
							children: "جاري تحميل حصص الحلقة..."
						})]
					}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
					}) : sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-16 text-center space-y-2 p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-8 h-8 text-slate-300 mx-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-slate-800",
								children: "لا توجد حصص مسجلة في هذا النطاق الزمني."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500",
								children: "حاول تغيير نطاق تواريخ البداية والنهاية من الأعلى."
							})
						]
					}) : sessions.map((session) => {
						const isException = session.sessionType === "exception";
						const isCompleted = session.status === "completed";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 p-4 shadow-2xs hover:shadow-md transition-all space-y-3 text-right group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-9 h-9 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-200",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-extrabold text-slate-900 text-xs sm:text-sm block",
											children: formatArabicDate(session.date)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono font-bold text-slate-400 block mt-0.5",
											children: session.date
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isException ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-slate-100 text-slate-700"}`,
											children: isException ? "استثنائية" : "أساسية"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isCompleted ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`,
											children: isCompleted ? "مكتملة ومقيّمة" : "مجدولة"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-teal-950 font-extrabold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-teal-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, {
											entry: session,
											format: "description"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dir-ltr",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, {
											entry: session,
											format: "slot"
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-teal-800 font-sans font-semibold",
											children: [
												"(",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, {
													entry: session,
													format: "12h"
												}),
												")"
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-slate-500 font-medium",
										children: ["المعلم المشرف: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-slate-800 font-bold",
											children: session.teacherName || "غير محدد"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleGoToSession(session.id),
										className: "px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer group-hover:bg-teal-700 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الانتقال للحصة ورصد التقييمات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4 text-slate-300 group-hover:text-white transition-colors" })]
									})]
								})
							]
						}, session.id);
					})
				})
			]
		})
	});
};
var DAY_TRANSLATIONS = {
	"Saturday": "السبت",
	"Sunday": "الأحد",
	"Monday": "الاثنين",
	"Tuesday": "الثلاثاء",
	"Wednesday": "الأربعاء",
	"Thursday": "الخميس",
	"Friday": "الجمعة"
};
function ViewGroupByNumberPage() {
	const { groupType: groupTypeParam, groupNumber: groupNumberParam } = useParams({ from: "/dashboard/groups/$groupType/$groupNumber/" });
	const navigate = useNavigate();
	const [group, setGroup] = (0, import_react.useState)(null);
	const [groupStudents, setGroupStudents] = (0, import_react.useState)([]);
	const [groupTeachers, setGroupTeachers] = (0, import_react.useState)([]);
	const [isSessionsModalOpen, setIsSessionsModalOpen] = (0, import_react.useState)(false);
	const [isExceptionModalOpen, setIsExceptionModalOpen] = (0, import_react.useState)(false);
	const [exceptionDate, setExceptionDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [exceptionNotes, setExceptionNotes] = (0, import_react.useState)("");
	const [isCreatingSession, setIsCreatingSession] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const loadGroupData = async () => {
		try {
			setIsLoading(true);
			const g = (await api.get(`/api/groups/by-type-and-number/${encodeURIComponent(groupTypeParam)}/${encodeURIComponent(groupNumberParam)}`)).data.group;
			if (!g) {
				setError("الحلقة الدراسية غير موجودة");
				return;
			}
			setGroup(g);
			setGroupStudents(g.students || []);
			setGroupTeachers(g.teachers || []);
		} catch (err) {
			console.error("Failed to load group details:", err);
			setError(err.response?.data?.error || err.message || "فشل في تحميل تفاصيل الحلقة");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadGroupData();
	}, [groupTypeParam, groupNumberParam]);
	const handleDelete = async () => {
		if (group && window.confirm(`هل أنت متأكد من حذف الحلقة رقم ${group.number}؟`)) {
			await api.delete(`/api/groups/${group.id}`);
			navigate({ to: `/dashboard/groups/${encodeURIComponent(groupTypeParam)}` });
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل تفاصيل الحلقة الدراسية..."
	});
	if (!group || error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center space-y-4 text-right",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-slate-600 font-bold",
			children: "الحلقة غير موجودة أو فشل تحميلها."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: `/dashboard/groups/${encodeURIComponent(groupTypeParam)}`,
			className: "px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs inline-block",
			children: "العودة للمسار الدراسي"
		})]
	});
	const currentTypeSlug = encodeURIComponent(group.typeSlug || groupTypeParam);
	const editUrl = `/dashboard/groups/${currentTypeSlug}/${group.number}/edit`;
	const formattedTiming = formatSessionTimeArabic(group.sessionTime, group.studyTime);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-5xl mx-auto space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: `/dashboard/groups/${currentTypeSlug}`,
						className: "px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العودة لقائمة حلقات المسار" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap sm:justify-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsSessionsModalOpen(true),
							className: "px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عرض حصص وسجل الحلقة" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsExceptionModalOpen(true),
							className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنشاء حصة استثنائية" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: editUrl,
							className: "px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعديل بيانات الحلقة" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleDelete,
							className: "p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer",
							title: "حذف الحلقة",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block",
									children: ["مسار: ", group.type]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-slate-500",
									children: group.gender === "male" ? "حلقة ذكور" : "حلقة إناث"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md",
									children: group.level === "Beginner" ? "مبتدئ" : group.level === "Advanced" ? "متقدم" : group.level === "Ijazah & Sanad" ? "إجازة وسند" : "متوسط"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight",
							children: ["حلقة رقم ", group.number]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shrink-0 text-center sm:text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-emerald-800 font-bold block",
							children: "إجمالي الطلاب"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xl font-extrabold text-emerald-950 font-mono",
							children: [groupStudents.length, " طلاب"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 flex-row-reverse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0",
							children: group.sessionTime?.startType === "prayer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-5 h-5 text-amber-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-5 h-5 text-emerald-600" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 min-w-0 flex-1 text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-slate-500 block",
									children: "توقيت وجدول الحصة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-extrabold text-slate-900 leading-tight",
									children: formattedTiming
								}),
								group.sessionTime && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-bold mt-0.5",
									children: group.sessionTime.startType === "prayer" ? "توقيت مرتبط بمواقيت الصلاة" : "توقيت زمني محدد"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 flex-row-reverse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 min-w-0 flex-1 text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-slate-500 block",
									children: "أيام الدراسة والقاعة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1 flex-row-reverse",
									children: group.days && group.days.length > 0 ? group.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md text-[11px] font-bold shadow-2xs",
										children: DAY_TRANSLATIONS[d] || d
									}, d)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-400",
										children: "غير محدد"
									})
								}),
								group.room && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 text-xs text-slate-600 font-semibold pt-0.5 flex-row-reverse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: group.room })]
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-extrabold text-slate-900 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"المعلمون والشيوخ المسندون (",
						groupTeachers.length,
						")"
					] })]
				}), groupTeachers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5",
					children: groupTeachers.map((tch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherCard, {
						teacher: tch,
						onClick: () => navigate({ to: `/dashboard/teachers/${tch.id}` })
					}, tch.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 italic text-center shadow-xs",
					children: "لم يتم إسناد معلمين لهذه الحلقة بعد. اضغط على \"تعديل بيانات الحلقة\" لتعيين شيخ للحلقة."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-extrabold text-slate-900 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"الطلاب المسجلون في الحلقة (",
							groupStudents.length,
							")"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500",
						children: [
							"قائمة الطلاب الذين يتابعون حفظ القرآن الكريم في حلقة رقم ",
							group.number,
							"."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/students/new",
						className: "px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تسجيل طالب جديد" })]
					})]
				}), groupStudents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
					children: groupStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentCard, {
						student,
						onClick: () => navigate({ to: `/dashboard/students/${student.id}` })
					}, student.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-6 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "لا يوجد طلاب مسجلون في هذه الحلقة حالياً."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/students/new",
						className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-block",
						children: "تسجيل طالب جديد"
					})]
				})]
			}),
			isExceptionModalOpen && group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm sm:text-base font-extrabold text-slate-900",
								children: "إنشاء حصة استثنائية جديدة"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsExceptionModalOpen(false),
							className: "w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: async (e) => {
							e.preventDefault();
							setIsCreatingSession(true);
							try {
								await api.post("/api/sessions/exception", {
									groupId: group.id,
									date: exceptionDate,
									notes: exceptionNotes
								});
								setIsExceptionModalOpen(false);
								setExceptionNotes("");
								navigate({ to: "/dashboard/sessions" });
							} catch (err) {
								alert(err.response?.data?.error || err.message || "فشل في إنشاء الحصة الاستثنائية");
							} finally {
								setIsCreatingSession(false);
							}
						},
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
								htmlFor: "exceptionDate",
								children: "تاريخ الحصة الاستثنائية:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "exceptionDate",
								type: "date",
								required: true,
								value: exceptionDate,
								onChange: (e) => setExceptionDate(e.target.value),
								className: "bg-slate-50 font-bold font-mono text-center"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
								htmlFor: "exceptionNotes",
								children: "عنوان أو ملاحظات حول اللقاء:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "exceptionNotes",
								rows: 3,
								value: exceptionNotes,
								onChange: (e) => setExceptionNotes(e.target.value),
								placeholder: "مثال: لقاء لتثبيت متشابهات الجزء الأول من سورة البقرة وتكثيف المراجعة...",
								className: "bg-slate-50"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-slate-100 flex items-center justify-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
									type: "submit",
									disabled: isCreatingSession,
									className: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs",
									children: isCreatingSession ? "جاري الإنشاء والتحضير..." : "إنشاء وتأكيد الحصة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
									type: "button",
									variant: "secondary",
									onClick: () => setIsExceptionModalOpen(false),
									className: "rounded-xl",
									children: "إلغاء"
								})]
							})
						]
					})]
				})
			}),
			group && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupSessionsModal, {
				isOpen: isSessionsModalOpen,
				onClose: () => setIsSessionsModalOpen(false),
				groupId: group.id,
				groupNumber: group.number
			})
		]
	});
}
//#endregion
export { ViewGroupByNumberPage as component };
