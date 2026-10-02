import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as api } from "./router-DHZqPWB-.mjs";
import { t as GroupForm } from "./GroupForm-SyzQuDjA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-D2nJ2cV-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditGroupUnderTypePage() {
	const { groupType: groupTypeParam, groupNumber: groupNumberParam } = useParams({ from: "/dashboard/groups/$groupType/$groupNumber/edit" });
	const navigate = useNavigate();
	const [group, setGroup] = (0, import_react.useState)(null);
	const [teachers, setTeachers] = (0, import_react.useState)([]);
	const [groupTypes, setGroupTypes] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadData() {
			try {
				setIsLoading(true);
				const [groupRes, teachersRes, typesRes] = await Promise.all([
					api.get(`/api/groups/by-type-and-number/${encodeURIComponent(groupTypeParam)}/${encodeURIComponent(groupNumberParam)}`),
					api.get("/api/teachers"),
					api.get("/api/group-types")
				]);
				setGroup(groupRes.data.group || null);
				setTeachers(teachersRes.data.teachers || []);
				setGroupTypes(typesRes.data.groupTypes || []);
			} catch (err) {
				console.error("Failed to load group for edit:", err);
				setError(err.response?.data?.error || err.message || "فشل في تحميل بيانات الحلقة");
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, [groupTypeParam, groupNumberParam]);
	const handleSave = async (updatedData) => {
		if (!group) return;
		(await api.put(`/api/groups/${group.id}`, updatedData)).data.group;
		const targetTypeSlug = updatedData.typeId ? groupTypes.find((t) => t.id === updatedData.typeId)?.slug || groupTypeParam : group.typeSlug || groupTypeParam;
		const targetNumber = updatedData.number !== void 0 ? updatedData.number : group.number;
		navigate({ to: `/dashboard/groups/${encodeURIComponent(targetTypeSlug)}/${encodeURIComponent(targetNumber)}` });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل بيانات الحلقة للتحرير..."
	});
	if (error || !group) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center space-y-4 text-right",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-slate-600 font-bold",
			children: "الحلقة غير موجودة أو تعذر تحميلها."
		})
	});
	const currentTypeSlug = encodeURIComponent(group.typeSlug || groupTypeParam);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupForm, {
		initialData: group,
		teachers,
		groupTypes,
		preselectedTypeId: group.typeId || void 0,
		onSave: handleSave,
		onCancel: () => navigate({ to: `/dashboard/groups/${currentTypeSlug}/${encodeURIComponent(group.number)}` }),
		title: `تعديل بيانات حلقة رقم ${group.number}`,
		subtitle: `المسار الحالي: ${group.type}`
	});
}
//#endregion
export { EditGroupUnderTypePage as component };
