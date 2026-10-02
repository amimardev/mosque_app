import { o as __toESM } from "../_runtime.mjs";
import { a as DialogClose, at as require_react, i as DialogPopup, it as require_jsx_runtime, n as DialogRoot, o as DialogBackdrop, r as DialogPortal, t as DialogTitle } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, _ as Outlet, p as useLocation, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "../_libs/cn.mjs";
import { J as ChevronRight, P as LayoutDashboard, W as Clock, Y as ChevronLeft, b as RefreshCw, et as BookOpen, g as ShieldCheck, k as LogOut, n as Users, o as UserCheck, r as User, t as X, tt as Award, w as PanelLeft } from "../_libs/lucide-react.mjs";
import { a as useAuth, i as Button$1, r as api } from "./router-D9XCqWvD.mjs";
import { t as ScrollArea } from "./scroll-area-Ci2SgH4c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DZFs5hkJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Sheet({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogRoot, {
		"data-slot": "sheet",
		...props
	});
}
function SheetPortal({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogPortal, {
		"data-slot": "sheet-portal",
		...props
	});
}
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBackdrop, {
		"data-slot": "sheet-overlay",
		className: cn("fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPopup, {
		"data-slot": "sheet-content",
		"data-side": side,
		className: cn("fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			"data-slot": "sheet-close",
			render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button$1, {
				variant: "ghost",
				className: "absolute top-3 right-3",
				size: "icon-sm"
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "sheet-header",
		className: cn("flex flex-col gap-0.5 p-4", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
		"data-slot": "sheet-title",
		className: cn("text-base font-medium text-foreground", className),
		...props
	});
}
function DashboardLayout() {
	const { user, isLoading, logout } = useAuth();
	const navigate = useNavigate();
	const [isMobileSheetOpen, setIsMobileSheetOpen] = (0, import_react.useState)(false);
	const [isDesktopCollapsed, setIsDesktopCollapsed] = (0, import_react.useState)(false);
	const [counts, setCounts] = (0, import_react.useState)({
		students: 0,
		parents: 0,
		teachers: 0,
		groups: 0,
		ratings: 0
	});
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const currentPath = useLocation().pathname;
	(0, import_react.useEffect)(() => {
		if (!isLoading && !user) navigate({ to: "/login" });
	}, [user, isLoading]);
	(0, import_react.useEffect)(() => {
		if (user && user.role === "parent" && (currentPath === "/dashboard" || currentPath === "/dashboard/")) navigate({ to: "/dashboard/sessions" });
	}, [user, currentPath]);
	const fetchCounts = (0, import_react.useCallback)(async () => {
		try {
			setIsRefreshing(true);
			const res = await api.get("/api/stats/counts");
			if (res.data && res.data.counts) setCounts(res.data.counts);
		} catch (err) {
			console.warn("Failed to fetch counts from /api/stats/counts:", err?.message || err);
			try {
				const statsRes = await api.get("/api/stats");
				if (statsRes.data?.stats) setCounts({
					students: statsRes.data.stats.totalStudents || 0,
					parents: 0,
					teachers: statsRes.data.stats.totalTeachers || 0,
					groups: statsRes.data.stats.totalGroups || 0,
					ratings: 0
				});
			} catch (fallbackErr) {}
		} finally {
			setIsRefreshing(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (user) fetchCounts();
	}, [fetchCounts, user]);
	const navItems = [
		{
			to: "/dashboard",
			label: "لوحة التحكم",
			icon: LayoutDashboard,
			count: null,
			exact: true
		},
		{
			to: "/dashboard/students",
			label: "قائمة الطلاب",
			icon: User,
			count: counts.students,
			exact: false
		},
		{
			to: "/dashboard/parents",
			label: "أولياء الأمور",
			icon: Users,
			count: counts.parents,
			exact: false
		},
		{
			to: "/dashboard/teachers",
			label: "المعلمون والمشايخ",
			icon: UserCheck,
			count: counts.teachers,
			exact: false
		},
		{
			to: "/dashboard/groups",
			label: "الحلقات الدراسية",
			icon: Clock,
			count: counts.groups,
			exact: false
		},
		{
			to: "/dashboard/sessions",
			label: "الحصص واللقاءات اليومية",
			icon: Clock,
			count: null,
			exact: false
		},
		{
			to: "/dashboard/ratings",
			label: "التقييمات الشهرية",
			icon: Award,
			count: counts.ratings,
			exact: false
		}
	].filter((item) => {
		if (!user) return false;
		if (user.role === "parent") return item.to === "/dashboard/sessions";
		if (user.role === "teacher") return item.to !== "/dashboard/parents" && item.to !== "/dashboard/teachers";
		return true;
	});
	const isNavActive = (item) => {
		if (item.exact) return currentPath === item.to || currentPath === `${item.to}/`;
		return currentPath.startsWith(item.to);
	};
	const getPageTitle = () => {
		if (currentPath === "/dashboard" || currentPath === "/dashboard/") return "لوحة تحكم المدرسة القرآنية";
		if (currentPath.startsWith("/dashboard/students/new")) return "تسجيل طالب جديد";
		if (currentPath.includes("/students/") && currentPath.endsWith("/edit")) return "تعديل ملف الطالب";
		if (currentPath.startsWith("/dashboard/students/")) return "ملف الطالب وتفاصيل الحفظ";
		if (currentPath.startsWith("/dashboard/students")) return "دليل الطلاب";
		if (currentPath.startsWith("/dashboard/parents")) return "أولياء الأمور وقنوات التواصل";
		if (currentPath.startsWith("/dashboard/teachers/new")) return "إضافة معلم جديد";
		if (currentPath.includes("/teachers/") && currentPath.endsWith("/edit")) return "تعديل ملف المعلم";
		if (currentPath.startsWith("/dashboard/teachers/")) return "ملف المعلم والحلقات المسندة";
		if (currentPath.startsWith("/dashboard/teachers")) return "المعلمون والمشايخ";
		if (currentPath.startsWith("/dashboard/sessions")) return "جدول الحصص واللقاءات اليومية";
		if (currentPath.startsWith("/dashboard/groups/new")) return "إنشاء حلقة دراسية جديدة";
		if (currentPath.includes("/groups/") && currentPath.endsWith("/edit")) return "تعديل تفاصيل الحلقة";
		if (currentPath.startsWith("/dashboard/groups/")) return "تفاصيل الحلقة والطلاب المسجلين";
		if (currentPath.startsWith("/dashboard/groups")) return "حلقات تحفيظ القرآن";
		if (currentPath.startsWith("/dashboard/ratings/new")) return "إجراء تقييم شهري جديد";
		if (currentPath.startsWith("/dashboard/ratings")) return "جدول التقييمات الشهرية";
		return "بوابة المدرسة القرآنية";
	};
	const renderNavMenu = (isMobile = false) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full bg-white border-l border-slate-200 text-slate-800 select-none text-right",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-3 ${!isMobile && isDesktopCollapsed ? "justify-center" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					onClick: () => {
						if (isMobile) setIsMobileSheetOpen(false);
					},
					className: "flex items-center gap-3 min-w-0 group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0 font-extrabold group-hover:bg-emerald-700 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-5 h-5" })
					}), (isMobile || !isDesktopCollapsed) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-base font-extrabold text-slate-900 tracking-tight truncate font-sans",
							children: "البوابة القرآنية"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-500 truncate",
							children: "نظام إدارة حلقات تحفيظ القرآن الكريم"
						})]
					})]
				}), isMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setIsMobileSheetOpen(false),
					className: "w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer shrink-0",
					"aria-label": "إغلاق القائمة",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto px-3 py-4 space-y-1.5",
				children: [(isMobile || !isDesktopCollapsed) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider",
					children: "قائمة التنقل الرئيسية"
				}), navItems.map((item) => {
					const Icon = item.icon;
					const isActive = isNavActive(item);
					const isCollapsed = !isMobile && isDesktopCollapsed;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: () => {
							if (isMobile) setIsMobileSheetOpen(false);
						},
						title: isCollapsed ? item.label : void 0,
						className: `w-full flex items-center transition-all duration-200 group cursor-pointer ${isCollapsed ? "justify-center p-3 rounded-xl" : "justify-between px-3.5 py-3 rounded-2xl text-xs font-bold"} ${isActive ? "bg-emerald-600 text-white shadow-sm font-bold" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-500 group-hover:text-emerald-700"}` }), !isCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: item.label
							})]
						}), !isCollapsed && item.count !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? "bg-emerald-800 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"}`,
							children: item.count
						})]
					}, item.to);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 border-t border-slate-200/80 bg-slate-50 space-y-2",
				children: [user && (isMobile || !isDesktopCollapsed) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-600 shrink-0 bg-slate-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: user.avatar || "https://api.dicebear.com/7.x/micah/svg",
								alt: user.name,
								className: "w-full h-full object-cover"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-slate-900 truncate block",
								children: user.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-emerald-700 flex items-center gap-1 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3" }), user.role === "admin" ? "المشرف العام" : user.role === "teacher" ? "المعلم الفاضل" : "ولي الأمر"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: logout,
						className: "w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تسجيل الخروج" })]
					})]
				}) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-600 bg-slate-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: user.avatar || "https://api.dicebear.com/7.x/micah/svg",
							alt: user.name,
							className: "w-full h-full object-cover"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: logout,
						className: "p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer",
						title: "تسجيل الخروج",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" })
					})]
				}) : null, !isMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setIsDesktopCollapsed(!isDesktopCollapsed),
					className: "hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors text-xs font-semibold gap-1.5 cursor-pointer",
					title: isDesktopCollapsed ? "توسيع القائمة" : "تصغير القائمة",
					children: isDesktopCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تصغير القائمة" })] })
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex font-sans antialiased",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: `hidden lg:flex flex-col shrink-0 border-l border-slate-200/80 transition-all duration-300 ${isDesktopCollapsed ? "w-20" : "w-64"}`,
				children: renderNavMenu(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: isMobileSheetOpen,
				onOpenChange: setIsMobileSheetOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "right",
					className: "p-0 w-72 sm:w-80 bg-white border-l border-slate-200 text-slate-900 [&>button]:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
						className: "sr-only",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "قائمة التنقل للمدرسة القرآنية" })
					}), renderNavMenu(true)]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col min-w-0 h-full overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "shrink-0 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setIsMobileSheetOpen(true),
							className: "lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer",
							"aria-label": "فتح قائمة التنقل",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "w-5 h-5 text-emerald-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-slate-800",
								children: "القائمة"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-sans",
								children: getPageTitle()
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-slate-400 hidden sm:block",
							children: "إدارة المدرسة القرآنية وحلقات المسجد • العام الدراسي 2026/2027"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: fetchCounts,
							title: "تحديث بيانات البوابة",
							className: "p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/60 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${isRefreshing ? "animate-spin text-emerald-600" : ""}` })
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "flex-1 h-[calc(100vh-4rem)] w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})
				})]
			})
		]
	});
}
//#endregion
export { DashboardLayout as component };
