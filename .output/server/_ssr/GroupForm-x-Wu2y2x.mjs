import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { t as useForm } from "../_libs/@tanstack/react-form+[...].mjs";
import { W as Clock, g as ShieldCheck, i as UserMinus, n as Users, nt as ArrowRight, o as UserCheck, t as X, tt as Award, v as Search, x as Plus, y as Save } from "../_libs/lucide-react.mjs";
import { i as Button$1, r as api } from "./router-Bezq88tF.mjs";
import { r as formatSessionTimeArabic } from "./types-D-Kr0J12.mjs";
import { t as Input } from "./input-74l4de9A.mjs";
import { n as FormLabel, t as FormItem } from "./form-Bd2PJ9L3.mjs";
import { n as calculateSessionDisplayTime } from "./prayerTimes-C2HEDTVf.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D8jYswLp.mjs";
import { t as SessionTimePicker } from "./SessionTimePicker-C-p9kA5Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GroupForm-x-Wu2y2x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMMON_DAYS = [
	"Saturday",
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday"
];
var DAY_TRANSLATIONS = {
	"Saturday": "السبت",
	"Sunday": "الأحد",
	"Monday": "الاثنين",
	"Tuesday": "الثلاثاء",
	"Wednesday": "الأربعاء",
	"Thursday": "الخميس",
	"Friday": "الجمعة"
};
var DEFAULT_STUDENTS = [];
var DEFAULT_GROUP_TYPES = [];
var GroupForm = ({ initialData, teachers, students = DEFAULT_STUDENTS, groupTypes = DEFAULT_GROUP_TYPES, preselectedTypeId, onSave, onCancel, title, subtitle }) => {
	const [availableTypes, setAvailableTypes] = (0, import_react.useState)(groupTypes);
	const [availableStudents, setAvailableStudents] = (0, import_react.useState)(students);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [showTeacherSearch, setShowTeacherSearch] = (0, import_react.useState)(false);
	const [teacherQuery, setTeacherQuery] = (0, import_react.useState)("");
	const [showStudentSearch, setShowStudentSearch] = (0, import_react.useState)(false);
	const [studentQuery, setStudentQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		if (groupTypes && groupTypes.length > 0) {
			setAvailableTypes(groupTypes);
			return;
		}
		async function loadGroupTypes() {
			try {
				const res = await api.get("/api/group-types");
				if (!isMounted) return;
				setAvailableTypes(res.data.groupTypes || []);
			} catch (e) {
				console.error("Failed to load group types:", e);
			}
		}
		loadGroupTypes();
		return () => {
			isMounted = false;
		};
	}, [groupTypes.length]);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		if (students && students.length > 0) {
			setAvailableStudents(students);
			return;
		}
		async function loadAllStudents() {
			try {
				const res = await api.get("/api/students");
				if (!isMounted) return;
				setAvailableStudents(res.data.students || []);
			} catch (e) {
				console.error("Failed to load students for group form:", e);
			}
		}
		loadAllStudents();
		return () => {
			isMounted = false;
		};
	}, [students.length]);
	const initialTypeId = preselectedTypeId || initialData?.typeId || availableTypes[0]?.id || "";
	const initialStudentIds = initialData?.id && students.length > 0 ? students.filter((s) => s.groupId && s.groupId.split(",").map((id) => id.trim()).includes(initialData.id)).map((s) => s.id) : [];
	const form = useForm({
		defaultValues: {
			typeId: initialTypeId,
			number: initialData?.number ? String(initialData.number) : "",
			gender: initialData?.gender || "male",
			level: initialData?.level || "Intermediate",
			room: initialData?.room || "قاعة المحراب الرئيسية",
			capacity: initialData?.capacity ? Number(initialData.capacity) : 20,
			days: initialData?.days || [
				"Monday",
				"Wednesday",
				"Saturday"
			],
			sessionTime: {
				startType: initialData?.sessionTime?.startType || "prayer",
				startTime: initialData?.sessionTime?.startTime || "16:30",
				startPrayer: initialData?.sessionTime?.startPrayer || "asr",
				startOffsetHours: initialData?.sessionTime?.startOffsetHours ?? 0,
				endType: initialData?.sessionTime?.endType || "prayer",
				endTime: initialData?.sessionTime?.endTime || "18:00",
				endPrayer: initialData?.sessionTime?.endPrayer || "maghrib",
				endOffsetHours: initialData?.sessionTime?.endOffsetHours ?? 0
			},
			teacherIds: initialData?.teachers ? initialData.teachers.map((t) => t.id) : [],
			studentIds: initialStudentIds
		},
		onSubmit: async ({ value }) => {
			if (!value.number.trim()) {
				setError("رقم الحلقة مطلوب");
				return;
			}
			if (!value.typeId) {
				setError("يرجى اختيار نوع ومسار الحلقة الدراسية من القائمة");
				return;
			}
			if (value.days.length === 0) {
				setError("يرجى اختيار يوم واحد على الأقل من أيام الدراسة");
				return;
			}
			setIsSubmitting(true);
			setError("");
			const matchedType = availableTypes.find((t) => t.id === value.typeId);
			const computedDisplay = calculateSessionDisplayTime(value.sessionTime);
			try {
				await onSave({
					number: Number(value.number),
					typeId: value.typeId,
					type: matchedType?.name || initialData?.type || "عام",
					gender: value.gender,
					level: value.level,
					room: value.room.trim() || void 0,
					capacity: Number(value.capacity) || 20,
					days: value.days,
					studyTime: computedDisplay.displayText || formatSessionTimeArabic(value.sessionTime),
					timeSlot: computedDisplay.timeSlot,
					sessionTime: value.sessionTime,
					teacherIds: value.teacherIds,
					studentIds: value.studentIds
				});
			} catch (err) {
				setError(err.message || "فشل في حفظ بيانات الحلقة القرآنية");
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الحفظ..." : "حفظ بيانات الحلقة" })]
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl text-xs sm:text-sm",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. الهوية والمسار الدراسي للحلقة" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "typeId",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
										htmlFor: field.name,
										children: ["المسار / نوع الحلقة القرآنية ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: field.state.value,
										onValueChange: field.handleChange,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: field.name,
											className: "w-full bg-white text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر المسار الدراسي..." })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availableTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: t.id,
											children: t.name
										}, t.id)) })]
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "number",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
										htmlFor: field.name,
										children: ["رقم الحلقة ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: field.name,
										name: field.name,
										type: "number",
										min: 1,
										value: field.state.value,
										onBlur: field.handleBlur,
										onChange: (e) => field.handleChange(e.target.value),
										placeholder: "مثال: 1, 2, 3...",
										className: "text-right font-mono font-bold"
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "gender",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
										htmlFor: field.name,
										children: ["الفئة المستهدفة (الجنس) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: field.state.value,
										onValueChange: (val) => field.handleChange(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: field.name,
											className: "w-full bg-white text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الفئة" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "male",
											children: "حلقة ذكور (رجال وأشبال)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "female",
											children: "حلقة إناث (نساء وفتيات)"
										})] })]
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "level",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										htmlFor: field.name,
										children: "المستوى التعليمي"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: field.state.value,
										onValueChange: field.handleChange,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: field.name,
											className: "w-full bg-white text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر المستوى" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Beginner",
												children: "مبتدئ (تلقين وتأسيس)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Intermediate",
												children: "متوسط (حفظ وتثبيت)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Advanced",
												children: "متقدم (ضبط المتشابهات)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Ijazah & Sanad",
												children: "إجازة وسند متصل"
											})
										] })]
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "room",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										htmlFor: field.name,
										children: "القاعة / مكان التسميع"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: field.name,
										name: field.name,
										value: field.state.value,
										onBlur: field.handleBlur,
										onChange: (e) => field.handleChange(e.target.value),
										placeholder: "مثال: قاعة المحراب، الرواق الغربي...",
										className: "text-right"
									})] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "capacity",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										htmlFor: field.name,
										children: "الحد الأقصى للطلاب (السعة الاستيعابية)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: field.name,
										name: field.name,
										type: "number",
										min: 1,
										max: 100,
										value: field.state.value,
										onBlur: field.handleBlur,
										onChange: (e) => field.handleChange(Number(e.target.value)),
										className: "text-right font-mono font-bold"
									})] })
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. التوقيت الزمني وأيام انعقاد الحلقات" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "sessionTime",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionTimePicker, {
									value: field.state.value,
									onChange: (updated) => field.handleChange(updated),
									showPreview: true,
									label: "جدولة مواعيد الحصة (مرتبطة بالصلوات أو ساعات دقيقة)"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "days",
								children: (field) => {
									const currentDays = field.state.value;
									const toggleDay = (d) => {
										if (currentDays.includes(d)) field.handleChange(currentDays.filter((item) => item !== d));
										else field.handleChange([...currentDays, d]);
									};
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, { children: ["أيام الدراسة الأسبوعية ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2",
											children: COMMON_DAYS.map((d) => {
												const isSelected = currentDays.includes(d);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => toggleDay(d),
													className: `p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${isSelected ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"}`,
													children: DAY_TRANSLATIONS[d] || d
												}, d);
											})
										})]
									});
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. الشيوخ والمعلمون المسندون" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setShowTeacherSearch(true),
								className: "gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إسناد شيخ / معلم" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
							name: "teacherIds",
							children: (field) => {
								const currentIds = field.state.value;
								const assignedTeachers = teachers.filter((t) => currentIds.includes(t.id));
								const removeTeacher = (id) => {
									field.handleChange(currentIds.filter((i) => i !== id));
								};
								return assignedTeachers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: assignedTeachers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: t.avatar,
												alt: t.name,
												className: "w-9 h-9 rounded-xl object-cover shrink-0"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-xs font-bold text-slate-900 truncate",
													children: t.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-[10px] text-slate-500 truncate",
													children: t.specialization
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeTeacher(t.id),
											className: "p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
											title: "إلغاء الإسناد",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "w-4 h-4" })
										})]
									}, t.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400",
									children: "لم يتم إسناد شيوخ لهذه الحلقة بعد. اضغط \"إسناد شيخ\" للإضافة."
								});
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4. الطلاب المسجلون في الحلقة" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setShowStudentSearch(true),
								className: "gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تسجيل طالب" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
							name: "studentIds",
							children: (field) => {
								const currentIds = field.state.value;
								const assignedStudents = availableStudents.filter((s) => currentIds.includes(s.id));
								const removeStudent = (id) => {
									field.handleChange(currentIds.filter((i) => i !== id));
								};
								return assignedStudents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",
									children: assignedStudents.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: s.avatar,
												alt: s.name,
												className: "w-9 h-9 rounded-xl object-cover shrink-0"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-xs font-bold text-slate-900 truncate",
													children: s.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block text-[10px] text-slate-500 truncate",
													children: [
														"سورة ",
														s.currentSurahName,
														" (",
														s.currentAyah,
														")"
													]
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeStudent(s.id),
											className: "p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
											title: "إلغاء التسجيل",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "w-4 h-4" })
										})]
									}, s.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400",
									children: "لا يوجد طلاب مسجلون في هذه الحلقة حالياً. اضغط \"تسجيل طالب\" للإضافة."
								});
							}
						})]
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الحفظ..." : "حفظ بيانات الحلقة" })]
						})]
					})
				]
			}),
			showTeacherSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
				dir: "rtl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-100 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-base font-extrabold text-slate-900 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إسناد شيخ أو معلم للحلقة" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowTeacherSearch(false),
								className: "w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 border-b border-slate-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "text",
									value: teacherQuery,
									onChange: (e) => setTeacherQuery(e.target.value),
									placeholder: "ابحث عن الشيخ بالاسم الكامل...",
									className: "w-full pl-3.5 pr-10 py-2.5 bg-slate-50"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto p-4 space-y-2",
							children: (() => {
								const currentTeacherIds = form.getFieldValue("teacherIds");
								const matchedTeachers = teachers.filter((t) => t.name.toLowerCase().includes(teacherQuery.toLowerCase()) && !currentTeacherIds.includes(t.id));
								if (matchedTeachers.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-8 text-center text-xs text-slate-400 italic font-semibold",
									children: teacherQuery ? "لم يتم العثور على شيوخ بهذا الاسم." : "اكتب الاسم الكامل للبحث وتصفية النتائج."
								});
								return matchedTeachers.map((teacher) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => {
										form.setFieldValue("teacherIds", [...currentTeacherIds, teacher.id]);
										setShowTeacherSearch(false);
									},
									className: "p-3 bg-slate-50 border border-slate-150 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: teacher.avatar,
											alt: teacher.name,
											className: "w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200/80 shadow-2xs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors truncate",
												children: teacher.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[10px] text-slate-500 font-medium truncate",
												children: teacher.specialization
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-extrabold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
										children: "إسناد للحلقة +"
									})]
								}, teacher.id));
							})()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: () => setShowTeacherSearch(false),
								className: "rounded-xl",
								children: "إغلاق"
							})
						})
					]
				})
			}),
			showStudentSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
				dir: "rtl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-slate-100 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-base font-extrabold text-slate-900 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تسجيل طالب جديد في هذه الحلقة" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"تصفية الأمان: يتم إظهار ",
										form.getFieldValue("gender") === "male" ? "الطلاب الذكور" : "الطالبات الإناث",
										" فقط تلقائياً."
									] })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowStudentSearch(false),
								className: "w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 border-b border-slate-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "text",
									value: studentQuery,
									onChange: (e) => setStudentQuery(e.target.value),
									placeholder: "ابحث عن الطالب بالاسم الكامل...",
									className: "w-full pl-3.5 pr-10 py-2.5 bg-slate-50"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto p-4 space-y-2",
							children: (() => {
								const currentStudentIds = form.getFieldValue("studentIds");
								const currentGender = form.getFieldValue("gender");
								const matchedStudents = availableStudents.filter((s) => s.gender === currentGender && s.name.toLowerCase().includes(studentQuery.toLowerCase()) && !currentStudentIds.includes(s.id));
								if (matchedStudents.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-8 text-center text-xs text-slate-400 italic font-semibold",
									children: studentQuery ? "لم يتم العثور على طلاب بهذا الاسم متوافقين مع جنس الحلقة." : "اكتب الاسم الكامل للطالب للبحث وتصفية النتائج."
								});
								return matchedStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => {
										form.setFieldValue("studentIds", [...currentStudentIds, student.id]);
										setShowStudentSearch(false);
									},
									className: "p-3 bg-slate-50 border border-slate-150 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: student.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
											alt: student.name,
											className: "w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200/80 shadow-2xs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors truncate",
												children: student.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block text-[10px] text-slate-500 font-medium truncate",
												children: [
													"سورة ",
													student.currentSurahName,
													" (آية ",
													student.currentAyah,
													")"
												]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-extrabold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
										children: "تسجيل في الحلقة +"
									})]
								}, student.id));
							})()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: () => setShowStudentSearch(false),
								className: "rounded-xl",
								children: "إغلاق"
							})
						})
					]
				})
			})
		]
	});
};
//#endregion
export { GroupForm as t };
