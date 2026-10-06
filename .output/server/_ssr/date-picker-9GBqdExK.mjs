import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { X as ChevronLeft, Y as ChevronRight, et as Calendar, t as X } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/date-picker-9GBqdExK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-auto rounded-2xl border border-slate-200 bg-white p-3 text-slate-950 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var MONTH_NAMES_AR = [
	"يناير (1)",
	"فبراير (2)",
	"مارس (3)",
	"أبريل (4)",
	"مايو (5)",
	"يونيو (6)",
	"يوليو (7)",
	"أغسطس (8)",
	"سبتمبر (9)",
	"أكتوبر (10)",
	"نوفمبر (11)",
	"ديسمبر (12)"
];
var WEEKDAYS_AR = [
	"أحد",
	"إثنين",
	"ثلاثاء",
	"أربعاء",
	"خميس",
	"جمعة",
	"سبت"
];
function DatePicker({ value, onChange, placeholder = "اختر التاريخ", className, minDate = "2000-01-01", maxDate = "2035-12-31", disabled = false }) {
	const [isOpen, setIsOpen] = import_react.useState(false);
	const initialDate = import_react.useMemo(() => {
		if (value && !isNaN(new Date(value).getTime())) return new Date(value);
		return /* @__PURE__ */ new Date();
	}, [value]);
	const [currentYear, setCurrentYear] = import_react.useState(initialDate.getFullYear());
	const [currentMonth, setCurrentMonth] = import_react.useState(initialDate.getMonth());
	import_react.useEffect(() => {
		if (value && !isNaN(new Date(value).getTime())) {
			const d = new Date(value);
			setCurrentYear(d.getFullYear());
			setCurrentMonth(d.getMonth());
		}
	}, [value]);
	const years = import_react.useMemo(() => {
		const maxYear = (/* @__PURE__ */ new Date()).getFullYear() + 6;
		const minYear = 2e3;
		const list = [];
		for (let y = maxYear; y >= minYear; y--) list.push(y);
		return list;
	}, []);
	const daysInMonth = import_react.useMemo(() => {
		return new Date(currentYear, currentMonth + 1, 0).getDate();
	}, [currentYear, currentMonth]);
	const firstDayOfWeek = import_react.useMemo(() => {
		return new Date(currentYear, currentMonth, 1).getDay();
	}, [currentYear, currentMonth]);
	const handlePrevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear((y) => y - 1);
		} else setCurrentMonth((m) => m - 1);
	};
	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear((y) => y + 1);
		} else setCurrentMonth((m) => m + 1);
	};
	const handleSelectDay = (day) => {
		const formattedMonth = String(currentMonth + 1).padStart(2, "0");
		const formattedDay = String(day).padStart(2, "0");
		onChange(`${currentYear}-${formattedMonth}-${formattedDay}`);
		setIsOpen(false);
	};
	const handleClear = (e) => {
		e.stopPropagation();
		onChange("");
	};
	const displayString = import_react.useMemo(() => {
		if (!value) return null;
		const parts = value.split("-");
		if (parts.length === 3) {
			const y = parseInt(parts[0], 10);
			const m = parseInt(parts[1], 10) - 1;
			const d = parseInt(parts[2], 10);
			if (!isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 0 && m < 12) return `${d} ${MONTH_NAMES_AR[m].split(" ")[0]} ${y}`;
		}
		return value;
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open: isOpen,
		onOpenChange: setIsOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			disabled,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cn("w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium transition-all text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer hover:bg-slate-100/70", !value && "text-slate-400", className),
				dir: "rtl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 truncate",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("truncate font-bold", value ? "text-slate-800" : "text-slate-400 font-normal"),
						children: displayString || placeholder
					})]
				}), value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					onClick: handleClear,
					className: "p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors",
					title: "مسح التاريخ",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
			className: "w-72 sm:w-80 p-3 bg-white shadow-2xl rounded-2xl border border-slate-200",
			align: "start",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				dir: "rtl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1 pb-2 border-b border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleNextMonth,
								className: "p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer",
								title: "الشهر التالي",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: currentMonth,
									onChange: (e) => setCurrentMonth(parseInt(e.target.value, 10)),
									className: "bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer",
									children: MONTH_NAMES_AR.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: idx,
										children: m
									}, idx))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: currentYear,
									onChange: (e) => setCurrentYear(parseInt(e.target.value, 10)),
									className: "bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer",
									children: years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: y,
										children: y
									}, y))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handlePrevMonth,
								className: "p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer",
								title: "الشهر السابق",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 text-center",
						children: WEEKDAYS_AR.map((day, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-extrabold text-slate-400 py-1",
							children: day
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-7 gap-1 text-center",
						children: [Array.from({ length: firstDayOfWeek }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8" }, `empty-${idx}`)), Array.from({ length: daysInMonth }).map((_, idx) => {
							const dayNum = idx + 1;
							const formattedMonth = String(currentMonth + 1).padStart(2, "0");
							const formattedDay = String(dayNum).padStart(2, "0");
							const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;
							const isSelected = value === dateKey;
							const isToday = (/* @__PURE__ */ new Date()).toISOString().split("T")[0] === dateKey;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleSelectDay(dayNum),
								className: cn("h-8 w-8 mx-auto text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer font-mono", isSelected ? "bg-emerald-600 text-white font-extrabold shadow-sm" : isToday ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"),
								children: dayNum
							}, dayNum);
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-400 font-mono",
							children: value || "لم يتم التحديد"
						}), value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								onChange("");
								setIsOpen(false);
							},
							className: "text-rose-600 hover:underline font-bold",
							children: "إلغاء التحديد"
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { DatePicker as t };
