import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { t as useForm } from "../_libs/@tanstack/react-form+[...].mjs";
import { t as calculateAge } from "./ageUtils-DAte9AqJ.mjs";
import { S as Phone, et as BookOpen, n as Users, nt as ArrowRight, o as UserCheck, r as User, y as Save } from "../_libs/lucide-react.mjs";
import { i as Button$1, r as api } from "./router-D9XCqWvD.mjs";
import { t as Input } from "./input-74l4de9A.mjs";
import { n as FormLabel, r as FormMessage, t as FormItem } from "./form-Bd2PJ9L3.mjs";
import { t as Textarea } from "./textarea-BnSMNRzM.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D8jYswLp.mjs";
import { t as QURAN_SURAHS } from "./quranData-CM-Mrj3O.mjs";
import { t as DatePicker } from "./date-picker-9GBqdExK.mjs";
import { t as AvatarPicker } from "./AvatarPicker-Ketsvjy2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StudentForm-w3FP_bem.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SurahAyahPicker = ({ surahNumber: propSurahNumber, currentSurahNumber, ayah: propAyah, currentAyah, onSurahChange, onAyahChange, label = "مستوى الحفظ الحالي (السورة والآية)" }) => {
	const activeSurahNumber = propSurahNumber ?? currentSurahNumber ?? 1;
	const activeAyah = propAyah ?? currentAyah ?? 1;
	const currentSurah = (0, import_react.useMemo)(() => {
		return QURAN_SURAHS.find((s) => s.number === activeSurahNumber) || QURAN_SURAHS[0];
	}, [activeSurahNumber]);
	const maxAyahs = currentSurah?.totalAyahs || 286;
	const [ayahStr, setAyahStr] = (0, import_react.useState)(String(activeAyah));
	(0, import_react.useEffect)(() => {
		setAyahStr(String(activeAyah));
	}, [activeAyah]);
	const handleSurahSelect = (e) => {
		const num = parseInt(e.target.value, 10);
		const matched = QURAN_SURAHS.find((s) => s.number === num);
		if (matched) {
			onSurahChange(matched.number, matched.nameEnglish);
			if (activeAyah > matched.totalAyahs) {
				onAyahChange(matched.totalAyahs);
				setAyahStr(String(matched.totalAyahs));
			}
		}
	};
	const handleAyahChange = (e) => {
		const val = e.target.value;
		setAyahStr(val);
		if (val === "") return;
		const num = parseInt(val, 10);
		if (!isNaN(num) && num >= 1) {
			if (num > maxAyahs) onAyahChange(maxAyahs);
			else onAyahChange(num);
		}
	};
	const handleAyahBlur = () => {
		const num = parseInt(ayahStr, 10);
		if (isNaN(num) || num < 1) {
			onAyahChange(1);
			setAyahStr("1");
		} else if (num > maxAyahs) {
			onAyahChange(maxAyahs);
			setAyahStr(String(maxAyahs));
		} else {
			onAyahChange(num);
			setAyahStr(String(num));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 flex-row-reverse justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: activeSurahNumber,
							onChange: handleSurahSelect,
							className: "w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-right",
							children: QURAN_SURAHS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.number,
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
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-500 shrink-0 font-medium",
							children: "رقم الآية:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 1,
							max: maxAyahs,
							value: ayahStr,
							onChange: handleAyahChange,
							onBlur: handleAyahBlur,
							className: "w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800 text-center"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] text-slate-400 block mt-1 text-right",
						children: [
							"الحد الأقصى: ",
							maxAyahs,
							" آية"
						]
					})]
				})]
			}),
			currentSurah && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs px-3 py-1.5 bg-emerald-50/80 border border-emerald-100 rounded-lg text-emerald-800",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-arabic text-sm font-semibold",
						children: ["سورة ", currentSurah.nameArabic]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium",
						children: [
							"سورة رقم ",
							currentSurah.number,
							" • ",
							currentSurah.type === "Meccan" ? "مكية" : "مدنية"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-md font-semibold text-[11px]",
						children: [
							"الآية ",
							activeAyah,
							" من ",
							maxAyahs
						]
					})
				]
			})
		]
	});
};
var StudentForm = ({ initialData, groups, onSave, onCancel, title, subtitle }) => {
	const [studentId] = (0, import_react.useState)(() => initialData?.id || `std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);
	const [parents, setParents] = (0, import_react.useState)([]);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadParents() {
			try {
				const res = await api.get("/api/parents");
				setParents(res.data.parents || []);
			} catch (err) {
				console.error("Failed to load parents:", err);
			}
		}
		loadParents();
	}, []);
	const form = useForm({
		defaultValues: {
			name: initialData?.name || "",
			avatar: initialData?.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${initialData?.id || studentId}`,
			gender: initialData?.gender || "male",
			dateOfBirth: initialData?.dateOfBirth || (typeof initialData?.age === "string" && initialData.age.includes("-") ? initialData.age : ""),
			parentId: initialData?.parentId || "",
			email: initialData?.email || "",
			groupIds: initialData?.groupId ? initialData.groupId.split(",").map((id) => id.trim()).filter(Boolean) : [],
			currentSurahNumber: initialData?.currentSurahNumber || 1,
			currentSurahName: initialData?.currentSurahName || "Al-Fatihah",
			currentAyah: initialData?.currentAyah || 1,
			targetJuz: initialData?.targetJuz ?? 30,
			memorizedJuzCount: initialData?.memorizedJuzCount ?? 1,
			status: initialData?.status || "active",
			notes: initialData?.notes || ""
		},
		onSubmit: async ({ value }) => {
			if (!value.name.trim()) {
				setError("الاسم الكامل للطالب مطلوب");
				return;
			}
			setIsSubmitting(true);
			setError("");
			try {
				await onSave({
					id: studentId,
					name: value.name.trim(),
					avatar: value.avatar.trim() || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(value.name)}`,
					gender: value.gender,
					dateOfBirth: value.dateOfBirth || void 0,
					age: value.dateOfBirth || void 0,
					parentId: value.parentId || void 0,
					email: value.email.trim() || void 0,
					groupId: value.groupIds.join(",") || void 0,
					currentSurahNumber: Number(value.currentSurahNumber),
					currentSurahName: value.currentSurahName,
					currentAyah: Number(value.currentAyah),
					targetJuz: Number(value.targetJuz) || 30,
					memorizedJuzCount: Number(value.memorizedJuzCount) || 0,
					status: value.status,
					notes: value.notes.trim() || void 0
				});
			} catch (err) {
				setError(err.message || "Failed to save student record");
			} finally {
				setIsSubmitting(false);
			}
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto space-y-6 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
						type: "button",
						variant: "outline",
						size: "icon",
						onClick: onCancel,
						className: "rounded-xl shadow-2xs",
						title: "رجوع",
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
				})
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium text-right",
				dir: "rtl",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				},
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8 text-right",
				dir: "rtl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. هوية الطالب وبياناته الشخصية" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "avatar",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarPicker, {
									id: studentId,
									type: "student",
									value: field.state.value,
									onChange: (url) => field.handleChange(url)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "name",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
												htmlFor: field.name,
												children: ["الاسم الكامل للطالب ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: field.name,
												name: field.name,
												value: field.state.value,
												onBlur: field.handleBlur,
												onChange: (e) => field.handleChange(e.target.value),
												placeholder: "مثال: زيد بن حارثة",
												className: "text-right font-medium",
												required: true
											}),
											field.state.meta.errors && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { children: field.state.meta.errors.join(", ") })
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
											name: "gender",
											children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
												htmlFor: field.name,
												children: "جنس الطالب / الطالبة"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: field.state.value,
												onValueChange: (val) => {
													field.handleChange(val);
													const validGroupIds = form.getFieldValue("groupIds").filter((gid) => {
														const grp = groups.find((g) => g.id === gid);
														return grp && grp.gender === val;
													});
													form.setFieldValue("groupIds", validGroupIds);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: field.name,
													className: "text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الجنس" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "male",
													children: "طالب (ذكر)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "female",
													children: "طالبة (أنثى)"
												})] })]
											})] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
											name: "dateOfBirth",
											children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between mb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
													htmlFor: field.name,
													className: "mb-0",
													children: "تاريخ الميلاد"
												}), field.state.value && calculateAge(field.state.value) !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60",
													children: [
														"العمر: ",
														calculateAge(field.state.value),
														" سنة"
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePicker, {
												value: field.state.value,
												onChange: (val) => field.handleChange(val),
												placeholder: "اختر تاريخ ميلاد الطالب"
											})] })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "status",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "حالة القبول والانتظام"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: field.state.value,
											onValueChange: (val) => field.handleChange(val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: field.name,
												className: "text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الحالة" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "active",
													children: "طالب نشط ومنتظم"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "graduated",
													children: "متخرج"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "paused",
													children: "موقوف مؤقتاً"
												})
											] })]
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "email",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "البريد الإلكتروني للطالب (اختياري)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: field.name,
											name: field.name,
											type: "email",
											value: field.state.value,
											onBlur: field.handleBlur,
											onChange: (e) => field.handleChange(e.target.value),
											placeholder: "student@example.com",
											className: "text-right font-mono",
											dir: "ltr"
										})] })
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. مرحلة الحفظ الحالية (السورة والآية)" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
								selector: (state) => [state.values.currentSurahNumber, state.values.currentAyah],
								children: ([surahNum, ayahNum]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurahAyahPicker, {
									surahNumber: Number(surahNum) || 1,
									currentSurahNumber: Number(surahNum) || 1,
									ayah: Number(ayahNum) || 1,
									currentAyah: Number(ayahNum) || 1,
									onSurahChange: (num, name) => {
										form.setFieldValue("currentSurahNumber", num);
										form.setFieldValue("currentSurahName", name);
									},
									onAyahChange: (ayah) => form.setFieldValue("currentAyah", ayah)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "memorizedJuzCount",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										htmlFor: field.name,
										children: "عدد الأجزاء المحفوظة"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: field.name,
										name: field.name,
										type: "number",
										min: 0,
										max: 30,
										value: field.state.value,
										onBlur: field.handleBlur,
										onChange: (e) => field.handleChange(Number(e.target.value)),
										className: "text-center font-bold"
									})] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "targetJuz",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										htmlFor: field.name,
										children: "الهدف المنشود (الأجزاء المستهدفة)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: field.name,
										name: field.name,
										type: "number",
										min: 1,
										max: 30,
										value: field.state.value,
										onBlur: field.handleBlur,
										onChange: (e) => field.handleChange(Number(e.target.value)),
										className: "text-center font-bold"
									})] })
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. معلومات ولي الأمر والاتصال (ربط المفتاح الخارجي)" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "parentId",
								children: (field) => {
									const currentParentId = field.state.value;
									const selectedParent = parents.find((p) => p.id === currentParentId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "ولي أمر الطالب (اختيار من قائمة أولياء الأمور المسجلين):"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: currentParentId || "none",
											onValueChange: (val) => field.handleChange(val === "none" ? "" : val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: field.name,
												className: "w-full bg-white text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "-- بدون ولي أمر محدد (يمكن التعيين لاحقاً) --" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "none",
												children: "-- بدون ولي أمر محدد (يمكن التعيين لاحقاً) --"
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
											className: "p-3.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-5 h-5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-extrabold text-slate-900 text-xs sm:text-sm",
													children: selectedParent.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-slate-500 flex items-center gap-1 font-mono mt-0.5",
													dir: "ltr",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3 h-3 text-emerald-600" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedParent.phone }),
														selectedParent.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-slate-400 font-sans",
															children: ["• ", selectedParent.email]
														})
													]
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shrink-0",
												children: "مرتبط بالمفتاح الخارجي"
											})]
										})]
									});
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "notes",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									htmlFor: field.name,
									children: "ملاحظات وتوجيهات للمعلم (اختياري)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: field.name,
									name: field.name,
									rows: 3,
									value: field.state.value,
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "أي ملاحظات خاصة بالتجويد، مخارج الحروف، جدول المراجعة...",
									className: "text-right"
								})] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4. الحلقات القرآنية المسندة للطالب" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Subscribe, {
							selector: (state) => [state.values.gender, state.values.groupIds],
							children: ([studentGender, groupIds]) => {
								const currentGender = studentGender;
								const selectedIds = groupIds || [];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: groups.filter((g) => g.gender === currentGender).map((grp) => {
											const isSelected = selectedIds.includes(grp.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												onClick: () => {
													if (isSelected) form.setFieldValue("groupIds", selectedIds.filter((id) => id !== grp.id));
													else form.setFieldValue("groupIds", [...selectedIds, grp.id]);
												},
												className: `p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-right ${isSelected ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-2xs" : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/60"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-extrabold text-xs sm:text-sm text-slate-900",
														children: [
															"حلقة رقم ",
															grp.number,
															" (",
															grp.type,
															")"
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-slate-500",
														children: grp.studyTime
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"}`,
													children: isSelected && "✓"
												})]
											}, grp.id);
										})
									})
								});
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-6 border-t border-slate-100 flex items-center justify-start gap-3 flex-row-reverse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							type: "submit",
							disabled: isSubmitting,
							className: "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الحفظ..." : "حفظ بيانات الطالب" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
							type: "button",
							variant: "outline",
							onClick: onCancel,
							className: "px-5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer",
							children: "إلغاء"
						})]
					})
				]
			})
		]
	});
};
//#endregion
export { StudentForm as t };
