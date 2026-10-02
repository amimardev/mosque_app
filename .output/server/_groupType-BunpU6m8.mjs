import { o as __toESM } from "./_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "./_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams, x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { F as Layers, G as CircleCheck, J as ChevronRight, K as CircleAlert, N as LayoutGrid, W as Clock, f as Square, l as Trash2, m as SquareCheckBig, n as Users, nt as ArrowRight, o as UserCheck, p as SquarePen, t as X, u as Sun, x as Plus, y as Save } from "./_libs/lucide-react.mjs";
import { r as api } from "./_ssr/router-DHZqPWB-.mjs";
import { r as formatSessionTimeArabic } from "./_ssr/types-D-Kr0J12.mjs";
import { t as ScrollArea } from "./_ssr/scroll-area-Ci2SgH4c.mjs";
import { t as SessionTimePicker } from "./_ssr/SessionTimePicker-_SX19nyH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_groupType-BunpU6m8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BulkTimingModal = ({ isOpen, onClose, groups, groupTypeName, onSuccess }) => {
	if (!isOpen) return null;
	const [selectedGroupIds, setSelectedGroupIds] = (0, import_react.useState)(() => groups.map((g) => g.id));
	const [sessionTime, setSessionTime] = (0, import_react.useState)(() => ({
		startType: "prayer",
		startTime: "16:30",
		startPrayer: "asr",
		startOffsetHours: 0,
		endType: "prayer",
		endTime: "18:00",
		endPrayer: "maghrib",
		endOffsetHours: 0
	}));
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [successMsg, setSuccessMsg] = (0, import_react.useState)("");
	const liveFormattedSummary = (0, import_react.useMemo)(() => {
		return formatSessionTimeArabic(sessionTime);
	}, [sessionTime]);
	const isAllSelected = groups.length > 0 && selectedGroupIds.length === groups.length;
	const toggleSelectAll = () => {
		if (isAllSelected) setSelectedGroupIds([]);
		else setSelectedGroupIds(groups.map((g) => g.id));
	};
	const toggleGroupSelection = (id) => {
		setSelectedGroupIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (selectedGroupIds.length === 0) {
			setError("يرجى تحديد حلقة واحدة على الأقل لتطبيق التوقيت عليها.");
			return;
		}
		setIsSubmitting(true);
		setError("");
		setSuccessMsg("");
		try {
			await api.post("/api/groups/bulk-update-time", {
				groupIds: selectedGroupIds,
				sessionTime,
				studyTime: liveFormattedSummary
			});
			setSuccessMsg(`تم تحديث توقيت ${selectedGroupIds.length} حلقات بنجاح!`);
			await onSuccess();
			setTimeout(() => {
				onClose();
			}, 800);
		} catch (err) {
			console.error("Failed to bulk update group timings:", err);
			setError(err.response?.data?.error || err.message || "حدث خطأ أثناء تحديث التوقيت بالجملة.");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[85vh] max-h-[680px] flex flex-col overflow-hidden text-right",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعديل مواعيد الحلقات بالجملة" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: groupTypeName ? `تخصيص توقيت الحصص للحلقات التابعة لمسار "${groupTypeName}"` : "تطبيق نفس التوقيت الزمني على عدة حلقات دفعة واحدة"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "flex flex-col flex-1 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "flex-1 w-full p-4 sm:p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
							}),
							successMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: successMsg })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimePicker, {
								value: sessionTime,
								onChange: setSessionTime,
								showPreview: true,
								label: "تحديد التوقيت الجديد (بداية ونهاية الحصة)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-slate-100 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-extrabold text-slate-800",
											children: [
												"اختيار الحلقات المراد تطبيق التوقيت عليها (",
												selectedGroupIds.length,
												" / ",
												groups.length,
												")"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: toggleSelectAll,
										className: "text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer",
										children: isAllSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إلغاء تحديد الكل" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3.5 h-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تحديد كل الحلقات" })] })
									})]
								}), groups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2 max-h-56 overflow-y-auto pr-1",
									children: groups.map((g) => {
										const isSelected = selectedGroupIds.includes(g.id);
										const currentTimingText = formatSessionTimeArabic(g.sessionTime, g.studyTime) || "لم يحدد موعد بعد";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => toggleGroupSelection(g.id),
											className: `p-3 rounded-xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${isSelected ? "bg-emerald-50/80 border-emerald-300 shadow-2xs" : "bg-white border-slate-200 hover:border-slate-300 opacity-75"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"}`,
													children: isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-white" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-extrabold text-slate-900",
														children: ["حلقة رقم ", g.number]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold",
														children: g.level === "Beginner" ? "مبتدئ" : g.level === "Advanced" ? "متقدم" : "متوسط"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-slate-500 mt-0.5",
													children: ["التوقيت الحالي: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-slate-700",
														children: currentTimingText
													})]
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded",
												children: g.gender === "male" ? "ذكور" : "إناث"
											})]
										}, g.id);
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-6 text-center text-xs text-slate-500 font-bold bg-slate-50 rounded-xl border border-slate-200",
									children: "لا توجد أي حلقات في هذا المسار لتطبيق التوقيت عليها."
								})]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 py-4 border-t border-slate-100 flex items-center justify-start gap-2 bg-slate-50/50 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: isSubmitting || selectedGroupIds.length === 0,
						className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري تطبيق التحديثات..." : `تطبيق التوقيت على (${selectedGroupIds.length}) حلقات` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer",
						children: "إلغاء"
					})]
				})]
			})]
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
function GroupTypeGroupsPage() {
	const { groupType: groupTypeParam } = useParams({ from: "/dashboard/groups/$groupType/" });
	const navigate = useNavigate();
	const [groupTypeData, setGroupTypeData] = (0, import_react.useState)(null);
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [isBulkTimingOpen, setIsBulkTimingOpen] = (0, import_react.useState)(false);
	const loadData = async () => {
		try {
			setIsLoading(true);
			const gt = (await api.get(`/api/group-types/${encodeURIComponent(groupTypeParam)}`)).data.groupType;
			setGroupTypeData(gt);
			setGroups(gt?.groups || []);
		} catch (err) {
			console.error("Failed to load group type groups:", err);
			setError(err.response?.data?.error || err.message || "فشل في تحميل حلقات هذا المسار");
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, [groupTypeParam]);
	const handleDeleteGroup = async (group, e) => {
		e.stopPropagation();
		if (window.confirm(`هل أنت متأكد من رغبتك في حذف الحلقة رقم ${group.number}؟`)) {
			setDeletingId(group.id);
			try {
				await api.delete(`/api/groups/${group.id}`);
				await loadData();
			} finally {
				setDeletingId(null);
			}
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل حلقات المسار..."
	});
	if (error || !groupTypeData) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center space-y-4 text-right",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-slate-600 font-bold",
			children: "لم يتم العثور على المسار الدراسي المطلوب."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard/groups",
			className: "px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs inline-block",
			children: "العودة لقائمة المسارات"
		})]
	});
	const currentSlug = encodeURIComponent(groupTypeData.slug || groupTypeParam);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/groups",
						className: "px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العودة للمسارات والتصنيفات" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap sm:justify-end",
					children: [
						groups.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsBulkTimingOpen(true),
							className: "px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-emerald-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعديل المواعيد بالجملة" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: `/dashboard/groups/${currentSlug}/new`,
							className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة حلقة جديدة" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: `/dashboard/groups/${currentSlug}/edit`,
							className: "px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعديل المسار" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block",
								children: "مسار دراسي نشط"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight",
								children: groupTypeData.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 max-w-2xl leading-relaxed",
								children: groupTypeData.description || "الحلقات الدراسية المسجلة تحت هذا المسار، مواعيد الحصص، والمشايخ والطلاب المنتسبين."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center min-w-[90px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-emerald-800 font-bold block",
								children: "إجمالي الحلقات"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl font-extrabold text-emerald-950 font-mono",
								children: groups.length
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center min-w-[90px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-emerald-800 font-bold block",
								children: "إجمالي الطلاب"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl font-extrabold text-emerald-950 font-mono",
								children: groupTypeData.totalStudents || 0
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-base font-extrabold text-slate-900 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"حلقات هذا المسار (",
						groups.length,
						")"
					] })]
				}), groups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
					children: groups.map((group) => {
						const teacherNames = group.teachers && group.teachers.length > 0 ? group.teachers.map((t) => t.name).join("، ") : "لم يعين محفظ بعد";
						const groupViewUrl = `/dashboard/groups/${currentSlug}/${group.number}`;
						const groupEditUrl = `/dashboard/groups/${currentSlug}/${group.number}/edit`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => navigate({ to: groupViewUrl }),
							className: "bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2 flex-row-reverse",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block",
											children: group.level === "Beginner" ? "مبتدئ" : group.level === "Advanced" ? "متقدم" : group.level === "Ijazah & Sanad" ? "إجازة وسند" : "متوسط"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-slate-500",
											children: group.gender === "male" ? "طلاب ذكور" : "طالبات إناث"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors",
										children: ["حلقة رقم ", group.number]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-slate-700 pt-1 border-t border-slate-100 flex-row-reverse",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-slate-900 truncate text-right",
											children: ["المعلم: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-slate-700",
												children: teacherNames
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-slate-700 flex-row-reverse",
										children: [group.sessionTime?.startType === "prayer" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "w-4 h-4 text-amber-600 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-slate-800 truncate text-right",
											children: formatSessionTimeArabic(group.sessionTime, group.studyTime)
										})]
									}),
									group.days && group.days.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1 flex-row-reverse",
										children: group.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium",
											children: DAY_TRANSLATIONS[d] || d
										}, d))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs pt-2 border-t border-slate-100 flex-row-reverse",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-slate-600 flex items-center gap-1.5 flex-row-reverse",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "الطلاب المسجلين:" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md",
											children: [group.studentsCount || 0, " طلاب"]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-row-reverse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-emerald-700 flex items-center gap-0.5 group-hover:-translate-x-0.5 transition-transform flex-row-reverse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "عرض تفاصيل الحلقة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5 transform rotate-180" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 flex-row-reverse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: groupEditUrl,
										onClick: (e) => e.stopPropagation(),
										title: "تعديل الحلقة",
										className: "p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (e) => handleDeleteGroup(group, e),
										disabled: deletingId === group.id,
										title: "حذف الحلقة",
										className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})]
								})]
							})]
						}, group.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-bold text-slate-700",
							children: [
								"لا توجد أي حلقات مسجلة تحت مسار \"",
								groupTypeData.name,
								"\" بعد."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "أضف أول حلقة في هذا المسار لتحديد موعد الدرس، القاعة، وتعيين المحفظ والطلاب."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: `/dashboard/groups/${currentSlug}/new`,
							className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة أول حلقة دراسية" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkTimingModal, {
				isOpen: isBulkTimingOpen,
				onClose: () => setIsBulkTimingOpen(false),
				groups,
				groupTypeName: groupTypeData?.name,
				onSuccess: loadData
			})
		]
	});
}
//#endregion
export { GroupTypeGroupsPage as component };
