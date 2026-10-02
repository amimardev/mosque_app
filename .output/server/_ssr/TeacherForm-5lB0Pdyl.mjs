import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { t as useForm } from "../_libs/@tanstack/react-form+[...].mjs";
import { S as Phone, _ as ShieldAlert, nt as ArrowRight, o as UserCheck, y as Save } from "../_libs/lucide-react.mjs";
import { a as useAuth, i as Button$1 } from "./router-DHZqPWB-.mjs";
import { t as Input } from "./input-74l4de9A.mjs";
import { n as FormLabel, r as FormMessage, t as FormItem } from "./form-Bd2PJ9L3.mjs";
import { t as Textarea } from "./textarea-BnSMNRzM.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D8jYswLp.mjs";
import { t as AvatarPicker } from "./AvatarPicker-B0TjrBex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TeacherForm-5lB0Pdyl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TeacherForm = ({ initialData, groups, onSave, onCancel, title, subtitle }) => {
	const { user } = useAuth();
	const [teacherId] = (0, import_react.useState)(() => initialData?.id || `tch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const form = useForm({
		defaultValues: {
			name: initialData?.name || "",
			avatar: initialData?.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${initialData?.id || teacherId}`,
			specialization: initialData?.specialization || "حفظ القرآن والتجويد",
			phone: initialData?.phone || "",
			email: initialData?.email || "",
			password: "",
			isAdmin: !!initialData?.isAdmin,
			bio: initialData?.bio || "",
			status: initialData?.status || "active",
			groupIds: initialData?.assignedGroups ? initialData.assignedGroups.map((g) => g.id) : []
		},
		onSubmit: async ({ value }) => {
			if (!value.name.trim()) {
				setError("الاسم الكامل للمعلم مطلوب");
				return;
			}
			setIsSubmitting(true);
			setError("");
			try {
				await onSave({
					id: teacherId,
					name: value.name.trim(),
					avatar: value.avatar.trim() || `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(value.name)}`,
					specialization: value.specialization.trim(),
					phone: value.phone.trim() || void 0,
					email: value.email.trim() || void 0,
					bio: value.bio.trim() || void 0,
					status: value.status,
					groupIds: value.groupIds,
					password: value.password.trim() || void 0,
					isAdmin: value.isAdmin
				});
			} catch (err) {
				setError(err.message || "فشل في حفظ سجل المعلم");
			} finally {
				setIsSubmitting(false);
			}
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto space-y-6 text-right pb-16",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				})
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. الملف الشخصي وصورة المعلم" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "avatar",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarPicker, {
									id: teacherId,
									type: "teacher",
									value: field.state.value,
									onChange: (url) => field.handleChange(url)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "name",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
											htmlFor: field.name,
											children: ["الاسم الكامل ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
											placeholder: "مثال: الشيخ عبد الرحمن أحمد",
											className: "text-right font-medium",
											required: true
										}),
										field.state.meta.errors && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { children: field.state.meta.errors.join(", ") })
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
									name: "specialization",
									children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
										htmlFor: field.name,
										children: ["التخصص العلمي والقراءات ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-500",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: field.name,
										name: field.name,
										value: field.state.value,
										onBlur: field.handleBlur,
										onChange: (e) => field.handleChange(e.target.value),
										placeholder: "مثال: القراءات العشر الصغرى، ورش وعاصم",
										className: "text-right font-medium",
										required: true
									})] })
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. معلومات الاتصال وحالة التعليم" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "phone",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "رقم الجوال"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: field.name,
											name: field.name,
											type: "tel",
											value: field.state.value,
											onBlur: field.handleBlur,
											onChange: (e) => field.handleChange(e.target.value),
											placeholder: "مثال: 0555123456",
											className: "font-mono text-left",
											dir: "ltr"
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "email",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "البريد الإلكتروني"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: field.name,
											name: field.name,
											type: "email",
											value: field.state.value,
											onBlur: field.handleBlur,
											onChange: (e) => field.handleChange(e.target.value),
											placeholder: "teacher@madrasa.org",
											className: "font-mono text-left",
											dir: "ltr"
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
										name: "status",
										children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											htmlFor: field.name,
											children: "الحالة والتوفر"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: field.state.value,
											onValueChange: (val) => field.handleChange(val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: field.name,
												className: "text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الحالة" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "active",
												children: "معلم منتظم ونشط"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "on_leave",
												children: "في إجازة مؤقتة"
											})] })]
										})] })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "bio",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									htmlFor: field.name,
									children: "السيرة العلمية، الإجازات، والمتون المحفوظة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: field.name,
									name: field.name,
									rows: 4,
									value: field.state.value,
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "اكتب نبذة عن شيوخ المعلم، الأسانيد التي يحملها، والمتون المجاز فيها (مثل الشاطبية، الجزرية)...",
									className: "text-right leading-relaxed"
								})] })
							})
						]
					}),
					user?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-4 border-t border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. بيانات الدخول وحساب المشرف" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "password",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									htmlFor: field.name,
									children: "تعيين كلمة مرور الحساب (أدخل لتغييرها)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: field.name,
									name: field.name,
									type: "password",
									value: field.state.value,
									onBlur: field.handleBlur,
									onChange: (e) => field.handleChange(e.target.value),
									placeholder: "مثال: password123 (اتركها فارغة لعدم التعديل)",
									className: "font-mono text-left",
									dir: "ltr"
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
								name: "isAdmin",
								children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center pt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-3 cursor-pointer select-none",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: field.state.value,
											onChange: (e) => field.handleChange(e.target.checked),
											className: "w-4 h-4 text-emerald-600 bg-slate-50 border-slate-300 rounded-lg focus:ring-emerald-500"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs sm:text-sm font-bold text-slate-800",
											children: "منح المعلم صلاحيات مدير المدرسة (Admin)"
										})]
									})
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-6 border-t border-slate-100 flex items-center justify-end gap-3 flex-row-reverse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							type: "submit",
							disabled: isSubmitting,
							className: "px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري حفظ البيانات..." : "حفظ بيانات الشيخ" })]
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
export { TeacherForm as t };
