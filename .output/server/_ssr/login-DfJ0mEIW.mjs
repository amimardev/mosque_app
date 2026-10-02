import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Lock, K as CircleAlert, O as Mail, et as BookOpen, g as ShieldCheck, n as Users, r as User } from "../_libs/lucide-react.mjs";
import { a as useAuth } from "./router-D9XCqWvD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DfJ0mEIW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, login, isLoading } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) navigate({ to: "/dashboard" });
	}, [user]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !password) {
			setErrorMsg("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
			return;
		}
		setIsSubmitting(true);
		setErrorMsg("");
		try {
			if (await login(email, password)) navigate({ to: "/dashboard" });
			else setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة");
		} catch (err) {
			setErrorMsg("حدث خطأ أثناء تسجيل الدخول");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleQuickLogin = async (quickEmail, quickPass) => {
		setIsSubmitting(true);
		setErrorMsg("");
		try {
			if (await login(quickEmail, quickPass)) navigate({ to: "/dashboard" });
			else setErrorMsg("فشل الدخول التجريبي");
		} catch (err) {
			setErrorMsg("خطأ في الاتصال بالخادم");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 font-sans",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 sm:p-8 text-center border-b border-slate-100 bg-slate-50/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-emerald-600/10 mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-8 h-8" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl sm:text-2xl font-extrabold text-slate-900",
							children: "مدرستنا القرآنية"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 mt-1 font-medium",
							children: "نظام المتابعة، والتقويم اليومي للأداء والحصص"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 sm:p-8 space-y-6",
					children: [
						errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 mb-1.5",
									children: "البريد الإلكتروني"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "name@madrasa.iqra",
										className: "w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-left"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 mb-1.5",
									children: "كلمة المرور"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										required: true,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "••••••••",
										className: "w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-left font-mono"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" })]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSubmitting || isLoading,
									className: "w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md cursor-pointer transition-colors",
									children: isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative py-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-slate-200" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative flex justify-center text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-white px-3 text-slate-500 font-bold",
									children: "الحسابات التجريبية والولوج السريع"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleQuickLogin("admin@madrasa.iqra", "password123"),
									disabled: isSubmitting,
									className: "w-full p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-amber-200/60 text-amber-800 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] sm:text-xs",
											children: "مدير المدرسة / المشرف"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-amber-700 font-mono",
											children: "admin@madrasa.iqra"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-lg shrink-0",
										children: "مدير"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleQuickLogin("teacher@madrasa.iqra", "password123"),
									disabled: isSubmitting,
									className: "w-full p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-emerald-200/60 text-emerald-800 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] sm:text-xs",
											children: "الشيخ والمعلم"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-emerald-700 font-mono",
											children: "teacher@madrasa.iqra"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-lg shrink-0",
										children: "معلم"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleQuickLogin("parent@madrasa.iqra", "password123"),
									disabled: isSubmitting,
									className: "w-full p-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 rounded-2xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-xl bg-teal-200/60 text-teal-800 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] sm:text-xs",
											children: "ولي الأمر والمتابع"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-teal-700 font-mono",
											children: "parent@madrasa.iqra"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-lg shrink-0",
										children: "ولي أمر"
									})]
								})
							]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
