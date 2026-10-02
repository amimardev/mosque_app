import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useForm } from "../_libs/@tanstack/react-form+[...].mjs";
import { t as useStore } from "../_libs/tanstack__react-store.mjs";
import { r as User, v as Search, x as Plus } from "../_libs/lucide-react.mjs";
import { n as StudentCard, r as api } from "./router-Bezq88tF.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-D8jYswLp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students-r7lG0G8k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentsDirectoryPage() {
	const navigate = useNavigate();
	const [students, setStudents] = (0, import_react.useState)([]);
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const filterForm = useForm({ defaultValues: {
		searchQuery: "",
		groupFilter: "all",
		statusFilter: "all"
	} });
	const searchQuery = useStore(filterForm.store, (state) => state.values.searchQuery);
	const selectedGroupFilter = useStore(filterForm.store, (state) => state.values.groupFilter);
	const statusFilter = useStore(filterForm.store, (state) => state.values.statusFilter);
	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [studentsRes, groupsRes] = await Promise.all([api.get("/api/students"), api.get("/api/groups")]);
			setStudents(studentsRes.data.students || []);
			setGroups(groupsRes.data.groups || []);
		} catch (err) {
			console.error("Failed to load students:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const filteredStudents = (0, import_react.useMemo)(() => {
		return students.filter((student) => {
			const matchesSearch = searchQuery === "" || student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.parentName && student.parentName.toLowerCase().includes(searchQuery.toLowerCase()) || student.currentSurahName && student.currentSurahName.toLowerCase().includes(searchQuery.toLowerCase()) || student.parentPhone && student.parentPhone.includes(searchQuery);
			const matchesGroup = selectedGroupFilter === "all" || student.groupId && student.groupId.split(",").map((id) => id.trim()).includes(selectedGroupFilter);
			const matchesStatus = statusFilter === "all" || student.status === statusFilter;
			return matchesSearch && matchesGroup && matchesStatus;
		});
	}, [
		students,
		searchQuery,
		selectedGroupFilter,
		statusFilter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-6 h-6 text-emerald-600" }),
						"دليل وسجل الطلاب (",
						students.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: "مستويات الحفظ، الانتماء للحلقات، ومعلومات الاتصال لأولياء الأمور."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/students/new",
					className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all self-start sm:self-auto cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "تسجيل طالب جديد"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(filterForm.Field, {
							name: "searchQuery",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: field.state.value,
								onChange: (e) => field.handleChange(e.target.value),
								placeholder: "البحث باسم الطالب، ولي الأمر، أو السورة...",
								className: "w-full pr-10 pl-16 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-right"
							})
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => filterForm.setFieldValue("searchQuery", ""),
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer",
							children: "مسح"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-row-reverse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full sm:w-56 text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(filterForm.Field, {
							name: "groupFilter",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: field.state.value,
								onValueChange: (val) => field.handleChange(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full text-right text-xs bg-slate-50 border-slate-200 text-slate-700 rounded-xl h-10 px-3 flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر حلقة" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "جميع الحلقات"
									}), groups.map((grp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: grp.id,
										children: [
											"حلقة رقم ",
											grp.number,
											" (",
											grp.type,
											")"
										]
									}, grp.id))]
								})]
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full sm:w-40 text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(filterForm.Field, {
							name: "statusFilter",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: field.state.value,
								onValueChange: (val) => field.handleChange(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full text-right text-xs bg-slate-50 border-slate-200 text-slate-700 rounded-xl h-10 px-3 flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "حالة الطالب" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									className: "text-right",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "all",
											children: "جميع الحالات"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "active",
											children: "نشط"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "graduated",
											children: "متخرج"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "paused",
											children: "موقوف مؤقتاً"
										})
									]
								})]
							})
						})
					})]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-16 text-center text-slate-400 text-xs font-semibold",
				children: "جاري تحميل سجل الطلاب..."
			}) : filteredStudents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
				children: filteredStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentCard, {
					student,
					onClick: () => navigate({
						to: "/dashboard/students/$id",
						params: { id: student.id }
					})
				}, student.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 mb-3",
					children: "لم يتم العثور على أي طلاب يطابقون معايير البحث."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard/students/new",
					className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-block",
					children: "تسجيل طالب جديد"
				})]
			})
		]
	});
}
//#endregion
export { StudentsDirectoryPage as component };
