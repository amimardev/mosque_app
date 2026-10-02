import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useForm } from "../_libs/@tanstack/react-form+[...].mjs";
import { t as useStore } from "../_libs/tanstack__react-store.mjs";
import { o as UserCheck, v as Search, x as Plus } from "../_libs/lucide-react.mjs";
import { r as api } from "./router-D9XCqWvD.mjs";
import { t as TeacherCard } from "./TeacherCard-Px83atan.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teachers-DrfVgojp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeachersDirectoryPage() {
	const navigate = useNavigate();
	const [teachers, setTeachers] = (0, import_react.useState)([]);
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const searchForm = useForm({ defaultValues: { searchQuery: "" } });
	const searchQuery = useStore(searchForm.store, (state) => state.values.searchQuery);
	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [teachersRes, groupsRes] = await Promise.all([api.get("/api/teachers"), api.get("/api/groups")]);
			setTeachers(teachersRes.data.teachers || []);
			setGroups(groupsRes.data.groups || []);
		} catch (err) {
			console.error("Failed to load teachers:", err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const filteredTeachers = (0, import_react.useMemo)(() => {
		return teachers.filter((teacher) => {
			if (!searchQuery) return true;
			const lower = searchQuery.toLowerCase();
			return teacher.name.toLowerCase().includes(lower) || teacher.specialization && teacher.specialization.toLowerCase().includes(lower) || teacher.email && teacher.email.toLowerCase().includes(lower) || teacher.phone && teacher.phone.includes(searchQuery);
		});
	}, [teachers, searchQuery]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-16 text-right",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-row-reverse justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-6 h-6 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"دليل الشيوخ والمعلمين (",
						teachers.length,
						")"
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: "شيوخ المقارئ المعتمدين، إجازات الرواية والقراءات، والحلقات الدراسية المسندة."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard/teachers/new",
					className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all self-start sm:self-auto cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "إضافة معلم جديد"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(searchForm.Field, {
							name: "searchQuery",
							children: (field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: field.state.value,
								onChange: (e) => field.handleChange(e.target.value),
								placeholder: "البحث عن المعلمين بالاسم الكامل، التخصص، أو الهاتف...",
								className: "w-full pr-10 pl-16 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-right"
							})
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => searchForm.setFieldValue("searchQuery", ""),
							className: "absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer",
							children: "مسح"
						})
					]
				})
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-16 text-center text-slate-400 text-xs font-semibold",
				children: "جاري تحميل دليل الشيوخ..."
			}) : filteredTeachers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5",
				children: filteredTeachers.map((teacher) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherCard, {
					teacher,
					onClick: () => navigate({
						to: "/dashboard/teachers/$id",
						params: { id: teacher.id }
					})
				}, teacher.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500 mb-3",
					children: "لم يتم العثور على أي شيوخ يطابقون معايير البحث."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard/teachers/new",
					className: "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-block animate-pulse",
					children: "إضافة معلم جديد"
				})]
			})
		]
	});
}
//#endregion
export { TeachersDirectoryPage as component };
