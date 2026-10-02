import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useForm } from "../_libs/@tanstack/react-form+[...].mjs";
import { D as MapPin, E as MessageSquare, G as CircleCheck, I as KeyRound, K as CircleAlert, O as Mail, S as Phone, U as FileText, a as UserPlus, l as Trash2, n as Users, p as SquarePen, r as User, t as X, v as Search, y as Save, z as GraduationCap } from "../_libs/lucide-react.mjs";
import { a as useAuth, i as Button$1, r as api } from "./router-DHZqPWB-.mjs";
import { t as Input } from "./input-74l4de9A.mjs";
import { n as FormLabel, t as FormItem } from "./form-Bd2PJ9L3.mjs";
import { t as Textarea } from "./textarea-BnSMNRzM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parents-C0XgR6tP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ParentModal = ({ isOpen, onClose, parentToEdit, onSuccess }) => {
	if (!isOpen) return null;
	const { user } = useAuth();
	const isEditing = Boolean(parentToEdit?.id);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [successMsg, setSuccessMsg] = (0, import_react.useState)("");
	const form = useForm({
		defaultValues: {
			name: parentToEdit?.name || "",
			phone: parentToEdit?.phone || "",
			email: parentToEdit?.email || "",
			password: "",
			address: parentToEdit?.address || "",
			notes: parentToEdit?.notes || ""
		},
		onSubmit: async ({ value }) => {
			if (!value.name.trim()) {
				setError("يرجى إدخال اسم ولي الأمر");
				return;
			}
			if (!value.phone.trim()) {
				setError("يرجى إدخال رقم هاتف ولي الأمر");
				return;
			}
			setIsSubmitting(true);
			setError("");
			setSuccessMsg("");
			try {
				const payload = {
					name: value.name.trim(),
					phone: value.phone.trim(),
					email: value.email.trim() || null,
					password: value.password.trim() || void 0,
					address: value.address.trim() || null,
					notes: value.notes.trim() || null
				};
				if (isEditing && parentToEdit) {
					await api.put(`/api/parents/${parentToEdit.id}`, payload);
					setSuccessMsg("تم تعديل بيانات ولي الأمر بنجاح");
				} else {
					await api.post("/api/parents", payload);
					setSuccessMsg("تمت إضافة ولي الأمر بنجاح");
				}
				await onSuccess();
				setTimeout(() => {
					onClose();
				}, 700);
			} catch (err) {
				console.error("Failed to save parent:", err);
				setError(err.response?.data?.error || err.message || "فشل في حفظ بيانات ولي الأمر");
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
						children: isEditing ? "تعديل بيانات ولي الأمر" : "إضافة ولي أمر جديد"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500",
						children: "تسجيل بيانات التواصل الخاصة بأولياء أمور طلاب المدرسة"
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
						name: "name",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
							htmlFor: field.name,
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["اسم ولي الأمر الكامل: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-500",
								children: "*"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: field.name,
							name: field.name,
							value: field.state.value,
							onBlur: field.handleBlur,
							onChange: (e) => field.handleChange(e.target.value),
							placeholder: "مثال: د. عبد الرحمن بن محمد",
							className: "bg-slate-50 font-semibold"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
						name: "phone",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
							htmlFor: field.name,
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["رقم الهاتف للجوال / واتساب: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-rose-500",
								children: "*"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: field.name,
							name: field.name,
							value: field.state.value,
							onBlur: field.handleBlur,
							onChange: (e) => field.handleChange(e.target.value),
							placeholder: "مثال: +213 550 12 34 56",
							className: "bg-slate-50 font-semibold font-mono",
							dir: "ltr"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
						name: "email",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
							htmlFor: field.name,
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3.5 h-3.5 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "البريد الإلكتروني (اختياري):" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: field.name,
							name: field.name,
							type: "email",
							value: field.state.value,
							onBlur: field.handleBlur,
							onChange: (e) => field.handleChange(e.target.value),
							placeholder: "parent@example.com",
							className: "bg-slate-50 font-semibold"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
						name: "address",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
							htmlFor: field.name,
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العنوان السكني (اختياري):" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: field.name,
							name: field.name,
							value: field.state.value,
							onBlur: field.handleBlur,
							onChange: (e) => field.handleChange(e.target.value),
							placeholder: "المدينة، الحي أو الشارع...",
							className: "bg-slate-50 font-semibold"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
						name: "notes",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
							htmlFor: field.name,
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ملاحظات إضافية:" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: field.name,
							name: field.name,
							rows: 2,
							value: field.state.value,
							onBlur: field.handleBlur,
							onChange: (e) => field.handleChange(e.target.value),
							placeholder: "أي ملاحظات حول التواصل أو متابعة أوقات الحضور...",
							className: "bg-slate-50 text-xs"
						})] })
					}),
					user?.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(form.Field, {
						name: "password",
						children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormLabel, {
							htmlFor: field.name,
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3.5 h-3.5 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعيين كلمة مرور لولوج ولي الأمر (أدخل لتغييرها):" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: field.name,
							name: field.name,
							type: "password",
							value: field.state.value,
							onBlur: field.handleBlur,
							onChange: (e) => field.handleChange(e.target.value),
							placeholder: "مثال: password123 (اتركها فارغة لعدم التعديل)",
							className: "bg-slate-50 font-mono text-left"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-slate-100 flex items-center justify-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button$1, {
							type: "submit",
							disabled: isSubmitting,
							className: "bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl gap-2 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات" : "إضافة ولي الأمر" })]
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
function MasterParentsDirectoryPage() {
	useNavigate();
	const [parents, setParents] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [selectedParentToEdit, setSelectedParentToEdit] = (0, import_react.useState)(null);
	const [parentToDelete, setParentToDelete] = (0, import_react.useState)(null);
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	const [deleteError, setDeleteError] = (0, import_react.useState)("");
	const loadParents = async () => {
		try {
			setIsLoading(true);
			const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
			const res = await api.get(`/api/parents${params}`);
			setParents(res.data.parents || []);
		} catch (err) {
			console.error("Failed to load parents:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadParents();
	}, []);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		loadParents();
	};
	const handleOpenNewParentModal = () => {
		setSelectedParentToEdit(null);
		setIsModalOpen(true);
	};
	const handleOpenEditParentModal = (parent) => {
		setSelectedParentToEdit(parent);
		setIsModalOpen(true);
	};
	const handleConfirmDeleteParent = async () => {
		if (!parentToDelete) return;
		try {
			setIsDeleting(true);
			setDeleteError("");
			await api.delete(`/api/parents/${parentToDelete.id}`);
			setParentToDelete(null);
			await loadParents();
		} catch (err) {
			console.error("Failed to delete parent:", err);
			setDeleteError(err.response?.data?.error || err.message || "حدث خطأ أثناء حذف ولي الأمر");
		} finally {
			setIsDeleting(false);
		}
	};
	const totalParents = parents.length;
	const totalChildrenLinked = parents.reduce((acc, p) => acc + (p.studentsCount || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[11px] font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "دليل التواصل مع أولياء الأمور" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight",
								children: "أولياء الأمور وقنوات التواصل"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 max-w-2xl leading-relaxed",
								children: "إدارة أسماء ورقم هاتف كل ولي أمر، وربط كل ولي أمر بأبنائه المسجلين في حلقات المدرسة القرآنية."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 flex-wrap sm:justify-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-teal-50 border border-teal-200 rounded-2xl text-center min-w-[100px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-teal-800 font-bold block",
									children: "إجمالي أولياء الأمور"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg font-extrabold text-teal-950 font-mono",
									children: totalParents
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center min-w-[100px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-emerald-800 font-bold block",
									children: "الأبناء المسجلون"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg font-extrabold text-emerald-950 font-mono",
									children: totalChildrenLinked
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleOpenNewParentModal,
								className: "px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إضافة ولي أمر جديد" })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSearchSubmit,
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "ابحث باسم ولي الأمر، رقم الهاتف، أو اسم الطالب الابن...",
							className: "w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer",
						children: "بحث"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-16 text-center text-slate-400 text-xs font-bold",
					children: "جاري تحميل سجل أولياء الأمور..."
				}) : parents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:hidden space-y-3 p-3 sm:p-4 bg-slate-50/50",
					children: parents.map((parent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 border-b border-slate-100 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0 border border-teal-200",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-5 h-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-extrabold text-slate-900 text-sm",
										children: parent.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400 font-mono block",
										children: ["معرف: ", parent.id]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleOpenEditParentModal(parent),
										title: "تعديل بيانات ولي الأمر",
										className: "p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setDeleteError("");
											setParentToDelete(parent);
										},
										title: "حذف ولي الأمر",
										className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${parent.phone}`,
									className: "inline-flex items-center gap-1.5 font-mono font-bold text-slate-800 hover:text-teal-700",
									dir: "ltr",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-teal-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: parent.phone })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `https://wa.me/${parent.phone.replace(/[^0-9]/g, "")}`,
									target: "_blank",
									rel: "noreferrer",
									className: "px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs hover:bg-emerald-200 transition-colors inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "واتساب" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold text-slate-500 block",
									children: "الأبناء المسجلون:"
								}), parent.students && parent.students.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: parent.students.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: `/dashboard/students/${st.id}`,
										className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 hover:text-teal-900 transition-colors font-bold text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "w-3.5 h-3.5 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: st.name })]
									}, st.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400 text-xs italic",
									children: "لا يوجد أبناء مرتبطون بعد"
								})]
							}),
							(parent.email || parent.address || parent.notes) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-0.5",
								children: [
									parent.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3 h-3 text-slate-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: parent.email })]
									}),
									parent.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3 h-3 text-slate-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: parent.address })]
									}),
									parent.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-500 italic mt-1",
										children: parent.notes
									})
								]
							})
						]
					}, parent.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:block overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-right text-xs border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-slate-50/80 border-b border-slate-200 text-slate-700 font-extrabold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "ولي الأمر"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "رقم الهاتف"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "الأبناء المسجلون"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "البريد والعنوان"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4",
									children: "ملاحظات"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3.5 px-4 text-center",
									children: "إجراءات"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-100",
							children: parents.map((parent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-50/80 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 font-extrabold text-slate-900",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-200",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-extrabold text-slate-900 text-xs sm:text-sm",
												children: parent.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-slate-400 font-mono",
												children: ["معرف: ", parent.id]
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 font-mono font-bold text-slate-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `tel:${parent.phone}`,
												className: "inline-flex items-center gap-1 text-slate-800 hover:text-teal-700 hover:underline",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3.5 h-3.5 text-teal-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													dir: "ltr",
													children: parent.phone
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: `https://wa.me/${parent.phone.replace(/[^0-9]/g, "")}`,
												target: "_blank",
												rel: "noreferrer",
												title: "تواصل عبر واتساب",
												className: "px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] hover:bg-emerald-200 transition-colors",
												children: "واتساب"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4",
										children: parent.students && parent.students.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1.5",
											children: parent.students.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: `/dashboard/students/${st.id}`,
												className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 hover:text-teal-900 transition-colors font-bold text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "w-3 h-3 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: st.name })]
											}, st.id))
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-400 text-[11px] italic",
											children: "لا يوجد أبناء مرتبطون بعد"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-slate-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											parent.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[11px] font-medium text-slate-700",
												children: parent.email
											}),
											parent.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[10px] text-slate-500",
												children: parent.address
											}),
											!parent.email && !parent.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-400 text-[11px]",
												children: "-"
											})
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-slate-600 max-w-xs truncate",
										children: parent.notes || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3.5 px-4 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleOpenEditParentModal(parent),
												title: "تعديل بيانات ولي الأمر",
												className: "p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-4 h-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setDeleteError("");
													setParentToDelete(parent);
												},
												title: "حذف ولي الأمر",
												className: "p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
											})]
										})
									})
								]
							}, parent.id))
						})]
					})
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center space-y-3 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-slate-800",
							children: "لا يوجد أولياء أمور مسجلون حالياً."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 max-w-sm mx-auto",
							children: "اضغط على \"إضافة ولي أمر جديد\" لإنشاء سجل لولي الأمر وربطه بالطلاب."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParentModal, {
				isOpen: isModalOpen,
				onClose: () => setIsModalOpen(false),
				parentToEdit: selectedParentToEdit,
				onSuccess: loadParents
			}),
			parentToDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
				dir: "rtl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-extrabold text-slate-900",
								children: "تأكيد حذف ولي الأمر"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500",
								children: "إجراء غير قابل للتراجع"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setParentToDelete(null),
							className: "w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 space-y-4",
						children: [
							deleteError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: deleteError })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs sm:text-sm text-slate-700 leading-relaxed font-medium",
								children: [
									"هل أنت متأكد من حذف سجل ولي الأمر ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-slate-900 font-extrabold",
										children: [
											"\"",
											parentToDelete.name,
											"\""
										]
									}),
									"؟"
								]
							}),
							parentToDelete.studentsCount && parentToDelete.studentsCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-extrabold block text-amber-950",
									children: "تنبيه هام:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "leading-relaxed",
									children: [
										"هذا ولي الأمر مرتبط بـ ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "font-mono font-bold text-amber-900",
											children: parentToDelete.studentsCount
										}),
										" من الطلاب. عند الحذف سيتم إلغاء ارتباط الطلاب بولي الأمر مع الحفاظ على سجلات الطلاب."
									]
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setParentToDelete(null),
									disabled: isDeleting,
									className: "px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer",
									children: "إلغاء"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleConfirmDeleteParent,
									disabled: isDeleting,
									className: "px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isDeleting ? "جاري الحذف..." : "نعم، تأكيد الحذف" })]
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
export { MasterParentsDirectoryPage as component };
