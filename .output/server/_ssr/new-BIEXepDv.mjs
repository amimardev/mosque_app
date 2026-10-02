import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as api } from "./router-DHZqPWB-.mjs";
import { t as GroupForm } from "./GroupForm-SyzQuDjA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-BIEXepDv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewGroupUnderTypePage() {
	const { groupType: groupTypeParam } = useParams({ from: "/dashboard/groups/$groupType/new" });
	const navigate = useNavigate();
	const [teachers, setTeachers] = (0, import_react.useState)([]);
	const [groupTypes, setGroupTypes] = (0, import_react.useState)([]);
	const [currentGroupType, setCurrentGroupType] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadData() {
			try {
				setIsLoading(true);
				const [teachersRes, typesRes] = await Promise.all([api.get("/api/teachers"), api.get("/api/group-types")]);
				const allTeachers = teachersRes.data.teachers || [];
				const allTypes = typesRes.data.groupTypes || [];
				setTeachers(allTeachers);
				setGroupTypes(allTypes);
				const match = allTypes.find((t) => t.slug === groupTypeParam || t.id === groupTypeParam || t.name === groupTypeParam);
				setCurrentGroupType(match || null);
			} catch (e) {
				console.error("Failed to load data for new group:", e);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, [groupTypeParam]);
	const handleSave = async (groupData) => {
		await api.post("/api/groups", groupData);
		navigate({ to: `/dashboard/groups/${encodeURIComponent(groupTypeParam)}` });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل النموذج..."
	});
	const currentSlug = encodeURIComponent(currentGroupType?.slug || groupTypeParam);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupForm, {
		teachers,
		groupTypes,
		preselectedTypeId: currentGroupType?.id || groupTypeParam,
		onSave: handleSave,
		onCancel: () => navigate({ to: `/dashboard/groups/${currentSlug}` }),
		title: `إنشاء حلقة جديدة في مسار: ${currentGroupType?.name || groupTypeParam}`,
		subtitle: "تحديد رقم الحلقة، جدول التوقيت الدراسي، قاعة التدريس، وتعيين المشايخ والطلاب."
	});
}
//#endregion
export { NewGroupUnderTypePage as component };
