import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as CalendarRange, J as ChevronRight, K as CircleAlert, M as List, Q as Calendar, W as Clock, Y as ChevronLeft, t as X, v as Search } from "../_libs/lucide-react.mjs";
import { a as useAuth, i as Button$1, r as api } from "./router-Bezq88tF.mjs";
import { t as Input } from "./input-74l4de9A.mjs";
import { t as SessionTimeDisplay } from "./SessionTimeDisplay-DLjI0Uaw.mjs";
import { t as DatePicker } from "./date-picker-9GBqdExK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sessions-b4TUBklX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SessionsListPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [viewMode, setViewMode] = (0, import_react.useState)("calendar");
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [currentWeekOffset, setCurrentWeekOffset] = (0, import_react.useState)(0);
	const [page, setPage] = (0, import_react.useState)(1);
	const [limit, setLimit] = (0, import_react.useState)(10);
	const [pagination, setPagination] = (0, import_react.useState)(null);
	const [filterStartDate, setFilterStartDate] = (0, import_react.useState)("");
	const [filterEndDate, setFilterEndDate] = (0, import_react.useState)("");
	const [isDateFilterModalOpen, setIsDateFilterModalOpen] = (0, import_react.useState)(false);
	const [tempStartDate, setTempStartDate] = (0, import_react.useState)("");
	const [tempEndDate, setTempEndDate] = (0, import_react.useState)("");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const currentWeekRange = (0, import_react.useMemo)(() => {
		const today = /* @__PURE__ */ new Date();
		const dayOfWeek = today.getDay();
		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - dayOfWeek + currentWeekOffset * 7);
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);
		const startStr = startOfWeek.toISOString().split("T")[0];
		const endStr = endOfWeek.toISOString().split("T")[0];
		const arabDays = [
			"الأحد",
			"الاثنين",
			"الثلاثاء",
			"الأربعاء",
			"الخميس",
			"الجمعة",
			"السبت"
		];
		const days = [];
		for (let i = 0; i < 7; i++) {
			const d = new Date(startOfWeek);
			d.setDate(startOfWeek.getDate() + i);
			const dateStr = d.toISOString().split("T")[0];
			days.push({
				dayName: arabDays[i],
				dateStr,
				isToday: dateStr === today.toISOString().split("T")[0]
			});
		}
		return {
			startDate: startStr,
			endDate: endStr,
			days
		};
	}, [currentWeekOffset]);
	const fetchCalendarSessions = (0, import_react.useCallback)(async () => {
		try {
			setIsLoading(true);
			setError("");
			const res = await api.get("/api/sessions", { params: {
				startDate: currentWeekRange.startDate,
				endDate: currentWeekRange.endDate
			} });
			setSessions(res.data.sessions || []);
			setPagination(null);
		} catch (err) {
			console.error("Failed to load calendar sessions:", err);
			setError("فشل في جلب حصص الأسبوع المحدد");
		} finally {
			setIsLoading(false);
		}
	}, [currentWeekRange.startDate, currentWeekRange.endDate]);
	const fetchListSessions = (0, import_react.useCallback)(async () => {
		try {
			setIsLoading(true);
			setError("");
			const params = {
				page,
				limit
			};
			if (filterStartDate) params.startDate = filterStartDate;
			if (filterEndDate) params.endDate = filterEndDate;
			if (searchQuery.trim()) params.search = searchQuery.trim();
			if (statusFilter !== "all") params.status = statusFilter;
			const res = await api.get("/api/sessions", { params });
			setSessions(res.data.sessions || []);
			if (res.data.pagination) setPagination(res.data.pagination);
		} catch (err) {
			console.error("Failed to load list sessions:", err);
			setError("فشل في جلب قائمة الحصص المفلترة");
		} finally {
			setIsLoading(false);
		}
	}, [
		page,
		limit,
		filterStartDate,
		filterEndDate,
		searchQuery,
		statusFilter
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		if (viewMode === "calendar") fetchCalendarSessions();
		else fetchListSessions();
	}, [
		viewMode,
		fetchCalendarSessions,
		fetchListSessions,
		user
	]);
	const handleOpenSession = (session) => {
		navigate({
			to: "/dashboard/sessions/$sessionId",
			params: { sessionId: session.id }
		});
	};
	const handleOpenDateFilterModal = () => {
		setTempStartDate(filterStartDate);
		setTempEndDate(filterEndDate);
		setIsDateFilterModalOpen(true);
	};
	const handleApplyDateFilter = () => {
		setFilterStartDate(tempStartDate);
		setFilterEndDate(tempEndDate);
		setPage(1);
		setIsDateFilterModalOpen(false);
	};
	const handleClearDateFilter = () => {
		setTempStartDate("");
		setTempEndDate("");
		setFilterStartDate("");
		setFilterEndDate("");
		setPage(1);
		setIsDateFilterModalOpen(false);
	};
	const applyPreset = (preset) => {
		const today = /* @__PURE__ */ new Date();
		const todayStr = today.toISOString().split("T")[0];
		if (preset === "today") {
			setTempStartDate(todayStr);
			setTempEndDate(todayStr);
		} else if (preset === "this_week") {
			const dayOfWeek = today.getDay();
			const startOfWeek = new Date(today);
			startOfWeek.setDate(today.getDate() - dayOfWeek);
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
			setTempStartDate(startOfWeek.toISOString().split("T")[0]);
			setTempEndDate(endOfWeek.toISOString().split("T")[0]);
		} else if (preset === "this_month") {
			const y = today.getFullYear();
			const m = String(today.getMonth() + 1).padStart(2, "0");
			const startOfMonth = `${y}-${m}-01`;
			const lastDay = new Date(y, today.getMonth() + 1, 0).getDate();
			const endOfMonth = `${y}-${m}-${String(lastDay).padStart(2, "0")}`;
			setTempStartDate(startOfMonth);
			setTempEndDate(endOfMonth);
		} else if (preset === "last_30_days") {
			const past = /* @__PURE__ */ new Date();
			past.setDate(today.getDate() - 30);
			setTempStartDate(past.toISOString().split("T")[0]);
			setTempEndDate(todayStr);
		}
	};
	const hasActiveDateFilter = Boolean(filterStartDate || filterEndDate);
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
	const getActiveFilterLabel = () => {
		if (filterStartDate && filterEndDate) {
			if (filterStartDate === filterEndDate) return `تاريخ: ${filterStartDate}`;
			return `${filterStartDate} إلى ${filterEndDate}`;
		}
		if (filterStartDate) return `من ${filterStartDate}`;
		if (filterEndDate) return `حتى ${filterEndDate}`;
		return "تصفية بالتاريخ";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-right font-sans",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-6 h-6 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الحصص واللقاءات اليومية" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 mt-1",
					children: "جدول اللقاءات، وتوثيق مقدار الحفظ الفردي والملاحظات والحضور اليومي."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-start md:justify-end",
					children: [viewMode === "list" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleOpenDateFilterModal,
							className: `h-9 px-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${hasActiveDateFilter ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs hover:bg-emerald-100/70" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: `w-4 h-4 ${hasActiveDateFilter ? "text-emerald-600" : "text-slate-500"}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate max-w-[160px]",
									children: getActiveFilterLabel()
								}),
								hasActiveDateFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 shrink-0" })
							]
						}), hasActiveDateFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleClearDateFilter,
							className: "h-9 w-9 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center transition-all cursor-pointer",
							title: "إلغاء تصفية التاريخ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("calendar"),
							className: `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "calendar" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عرض التقويم" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setViewMode("list"),
							className: `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عرض القائمة" })]
						})]
					})]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}),
			viewMode === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-2xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setCurrentWeekOffset((o) => o + 1),
							className: "p-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold",
							title: "الأسبوع القادم",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "الأسبوع القادم"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs sm:text-sm font-extrabold text-slate-900 block",
								children: currentWeekOffset === 0 ? "الأسبوع الحالي" : currentWeekOffset === -1 ? "الأسبوع الماضي" : currentWeekOffset === 1 ? "الأسبوع القادم" : `أسبوع (${currentWeekOffset > 0 ? "+" : ""}${currentWeekOffset})`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-slate-400 font-mono block mt-0.5",
								children: [
									formatArabicDate(currentWeekRange.startDate),
									" — ",
									formatArabicDate(currentWeekRange.endDate)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setCurrentWeekOffset((o) => o - 1),
							className: "p-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold",
							title: "الأسبوع الماضي",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "الأسبوع الماضي"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })]
						})
					]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-20 text-center text-slate-500 font-bold bg-white rounded-3xl border border-slate-100 shadow-xs",
					children: "جاري تحميل حصص الأسبوع المحدد..."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden lg:flex flex-col gap-4",
					children: currentWeekRange.days.map((day) => {
						const daySessions = sessions.filter((s) => s.date === day.dateStr);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `bg-white rounded-3xl border p-4 flex items-center justify-between gap-6 transition-all ${day.isToday ? "border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/10" : "border-slate-200/80 hover:border-slate-300"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-4 rounded-2xl w-36 text-center shrink-0 ${day.isToday ? "bg-emerald-600 text-white" : "bg-slate-50 border border-slate-100"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-extrabold",
									children: day.dayName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[11px] font-mono font-bold block mt-0.5 ${day.isToday ? "text-emerald-100" : "text-slate-400"}`,
									children: day.dateStr
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 flex flex-wrap gap-3 items-center",
								children: daySessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-400 font-bold italic",
									children: "لا توجد حصص مجدولة لهذا اليوم"
								}) : daySessions.map((session) => {
									const isException = session.sessionType === "exception";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleOpenSession(session),
										className: `text-right p-3.5 rounded-2xl border transition-all text-xs cursor-pointer min-w-[200px] max-w-[280px] shadow-2xs hover:shadow-xs flex-1 ${isException ? "bg-amber-50 border-amber-200 text-amber-950" : "bg-slate-50 border-slate-200/70 hover:bg-slate-100/50"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-3 mb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded-lg text-[9px] font-extrabold ${isException ? "bg-amber-200 text-amber-900" : "bg-slate-200 text-slate-700"}`,
													children: isException ? "استثنائية" : "أساسية"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[10px] text-slate-500 font-bold",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, {
														entry: session,
														format: "slot"
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-extrabold text-slate-900 truncate",
												children: [
													"حلقة رقم ",
													session.groupNumber,
													" (",
													session.level,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-slate-500 font-medium mt-1 truncate",
												children: ["المعلم: ", session.teacherName || "غير محدد"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2.5 flex justify-between items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded-full text-[9px] font-bold ${session.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-700"}`,
													children: session.status === "completed" ? "تم الرصد" : "مجدولة"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] text-emerald-700 font-bold hover:underline",
													children: "رصد وتقييم الحصة ←"
												})]
											})
										]
									}, session.id);
								})
							})]
						}, day.dateStr);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:hidden flex flex-col gap-4",
					children: currentWeekRange.days.map((day) => {
						const daySessions = sessions.filter((s) => s.date === day.dateStr);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `bg-white rounded-2xl border p-4 flex flex-col gap-3 ${day.isToday ? "border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/10" : "border-slate-200/80"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center border-b border-slate-100 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm font-extrabold ${day.isToday ? "text-emerald-800" : "text-slate-800"}`,
										children: day.dayName
									}), day.isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold",
										children: "اليوم"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-mono text-slate-400 font-bold",
									children: day.dateStr
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-2",
								children: daySessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-slate-400 font-bold text-center py-4",
									children: "لا توجد حصص مجدولة"
								}) : daySessions.map((session) => {
									const isException = session.sessionType === "exception";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleOpenSession(session),
										className: `text-right p-3 rounded-xl border transition-all text-xs cursor-pointer flex items-center justify-between gap-4 ${isException ? "bg-amber-50 border-amber-200 text-amber-950" : "bg-slate-50 border-slate-150"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-extrabold text-slate-900",
												children: [
													"حلقة ",
													session.groupNumber,
													" (",
													session.level,
													")"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-slate-500",
												children: ["المعلم: ", session.teacherName || "غير محدد"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-end gap-1.5 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[10px] text-slate-500 font-bold",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, {
													entry: session,
													format: "slot"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-full text-[9px] font-bold ${session.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-700"}`,
												children: session.status === "completed" ? "تم الرصد" : "مجدولة"
											})]
										})]
									}, session.id);
								})
							})]
						}, day.dateStr);
					})
				})] })]
			}),
			viewMode === "list" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-72",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "text",
							placeholder: "بحث برقم الحلقة، المعلم، المستوى...",
							value: searchQuery,
							onChange: (e) => {
								setSearchQuery(e.target.value);
								setPage(1);
							},
							className: "pr-9 text-xs bg-slate-50 rounded-xl"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 w-full sm:w-auto justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-500 font-bold",
							children: "الحالة:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 bg-slate-100 p-1 rounded-xl",
							children: [
								{
									value: "all",
									label: "الكل"
								},
								{
									value: "scheduled",
									label: "مجدولة"
								},
								{
									value: "completed",
									label: "مكتملة"
								}
							].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setStatusFilter(opt.value);
									setPage(1);
								},
								className: `px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === opt.value ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`,
								children: opt.label
							}, opt.value))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs",
					children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-20 text-center text-slate-500 font-bold",
						children: "جاري تحميل قائمة الحصص..."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:hidden space-y-3 p-3 sm:p-4 bg-slate-50/50",
						children: sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-8 text-center text-slate-400 font-bold text-xs bg-white rounded-2xl border border-slate-200",
							children: hasActiveDateFilter ? "لا توجد حصص في نطاق التاريخ المحدد" : "لا توجد حصص مسجلة حالياً"
						}) : sessions.map((session) => {
							const isException = session.sessionType === "exception";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-extrabold text-slate-900 text-xs block",
												children: formatArabicDate(session.date)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono font-bold text-slate-400 block",
												children: session.date
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${isException ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`,
												children: isException ? "استثنائية" : "أساسية"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${session.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-700"}`,
												children: session.status === "completed" ? "مكتملة" : "مجدولة"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 bg-slate-50 rounded-xl border border-slate-100",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-slate-400 font-bold block mb-0.5",
													children: "الحلقة والمساق:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-slate-900 block",
													children: ["حلقة رقم ", session.groupNumber]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-teal-800 font-medium block truncate",
													children: session.level
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 bg-slate-50 rounded-xl border border-slate-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 font-bold block mb-0.5",
												children: "المعلم المشرف:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-slate-900 block truncate",
												children: session.teacherName || "غير محدد"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-teal-950 font-extrabold text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-teal-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, {
												entry: session,
												format: "description"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-[11px] font-mono font-bold text-slate-700",
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOpenSession(session),
										className: "w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: user?.role === "parent" ? "عرض السجل" : "تقييم ورصد الحصة" })
									})
								]
							}, session.id);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full border-collapse text-right text-xs sm:text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-slate-50 text-slate-500 border-b border-slate-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-bold",
										children: "التاريخ"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-bold",
										children: "الحلقة الدراسية"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-bold",
										children: "المعلم"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-bold",
										children: "التوقيت والتفاصيل"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-bold",
										children: "الحالة والنوع"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-4 font-bold text-center",
										children: "الإجراء"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-100",
								children: sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 6,
									className: "p-12 text-center text-slate-400 font-bold",
									children: hasActiveDateFilter ? "لا توجد حصص في نطاق التاريخ المحدد" : "لا توجد حصص مسجلة حالياً"
								}) }) : sessions.map((session) => {
									const isException = session.sessionType === "exception";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-slate-50/50 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-extrabold text-slate-900 block",
													children: formatArabicDate(session.date)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-mono font-bold text-slate-400 block mt-0.5",
													children: session.date
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-slate-800 block",
													children: ["حلقة رقم ", session.groupNumber]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-slate-500 font-medium",
													children: session.level
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-slate-800 block",
													children: session.teacherName || "غير محدد"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "inline-flex flex-col gap-1 p-2.5 bg-teal-50/80 border border-teal-200/80 rounded-2xl text-right",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5 text-teal-950 font-extrabold text-xs",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-teal-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimeDisplay, {
															entry: session,
															format: "description"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 text-[11px] font-mono font-bold text-slate-700",
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
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-4 space-x-1.5 space-x-reverse",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${isException ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`,
													children: isException ? "استثنائية" : "أساسية"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${session.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-700"}`,
													children: session.status === "completed" ? "مكتملة" : "مجدولة"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-4 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleOpenSession(session),
													className: "px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer",
													children: user?.role === "parent" ? "عرض السجل" : "تقييم ورصد الحصة"
												})
											})
										]
									}, session.id);
								})
							})]
						})
					})] }), pagination && pagination.totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-slate-500 font-medium",
							children: [
								"عرض ",
								Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total),
								" - ",
								Math.min(pagination.page * pagination.limit, pagination.total),
								" من إجمالي ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900",
									children: pagination.total
								}),
								" حصة"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
									variant: "outline",
									size: "sm",
									onClick: () => setPage((p) => Math.max(1, p - 1)),
									disabled: pagination.page <= 1,
									className: "h-8 px-3 rounded-lg text-xs",
									children: "السابق"
								}),
								Array.from({ length: pagination.totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1).map((pageNum, idx, arr) => {
									const showEllipsisBefore = idx > 0 && pageNum - arr[idx - 1] > 1;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [showEllipsisBefore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-1 text-slate-400",
										children: "..."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										variant: pagination.page === pageNum ? "default" : "outline",
										size: "sm",
										onClick: () => setPage(pageNum),
										className: `h-8 w-8 rounded-lg text-xs font-mono font-bold ${pagination.page === pageNum ? "bg-slate-900 text-white" : ""}`,
										children: pageNum
									})] }, pageNum);
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
									variant: "outline",
									size: "sm",
									onClick: () => setPage((p) => Math.min(pagination.totalPages, p + 1)),
									disabled: pagination.page >= pagination.totalPages,
									className: "h-8 px-3 rounded-lg text-xs",
									children: "التالي"
								})
							]
						})]
					})]
				})]
			}),
			isDateFilterModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-slate-900",
								children: "تصفية الحصص حسب التاريخ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400",
								children: "حدد تاريخ البداية والنهاية لعرض الحصص"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsDateFilterModalOpen(false),
							className: "w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-slate-700 block mb-1.5",
								children: "اختيار سريع:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-1.5",
								children: [
									{
										key: "today",
										label: "اليوم"
									},
									{
										key: "this_week",
										label: "هذا الأسبوع"
									},
									{
										key: "this_month",
										label: "هذا الشهر"
									},
									{
										key: "last_30_days",
										label: "آخر 30 يوم"
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => applyPreset(item.key),
									className: "py-1 px-2 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer text-center",
									children: item.label
								}, item.key))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-slate-700 block mb-1",
									children: "من تاريخ (البداية):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
									value: tempStartDate,
									onChange: setTempStartDate,
									placeholder: "اختر تاريخ البداية"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-slate-700 block mb-1",
									children: "إلى تاريخ (النهاية):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
									value: tempEndDate,
									onChange: setTempEndDate,
									placeholder: "اختر تاريخ النهاية"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-slate-100 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										onClick: handleApplyDateFilter,
										className: "bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs px-4",
										children: "تطبيق التصفية"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
										variant: "outline",
										onClick: () => setIsDateFilterModalOpen(false),
										className: "rounded-xl text-xs",
										children: "إلغاء"
									})]
								}), (tempStartDate || tempEndDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setTempStartDate("");
										setTempEndDate("");
									},
									className: "text-xs text-rose-600 hover:underline font-bold",
									children: "مسح التحديد"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { SessionsListPage as component };
