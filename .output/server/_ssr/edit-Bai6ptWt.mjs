import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as api } from "./router-DHZqPWB-.mjs";
import { t as TeacherForm } from "./TeacherForm-5lB0Pdyl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-Bai6ptWt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditTeacherPage() {
	const { id } = useParams({ from: "/dashboard/teachers/$id/edit" });
	const navigate = useNavigate();
	const [teacher, setTeacher] = (0, import_react.useState)(null);
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadData() {
			try {
				setIsLoading(true);
				const [teacherRes, groupsRes] = await Promise.all([api.get(`/api/teachers/${id}`), api.get("/api/groups")]);
				setTeacher(teacherRes.data.teacher || null);
				setGroups(groupsRes.data.groups || []);
			} catch (err) {
				console.error("Failed to load edit teacher data:", err);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, [id]);
	const handleSave = async (teacherData) => {
		await api.put(`/api/teachers/${id}`, teacherData);
		navigate({
			to: "/dashboard/teachers/$id",
			params: { id }
		});
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل بيانات الشيخ..."
	});
	if (!teacher) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-rose-500 font-bold",
		children: "المعلم غير موجود."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherForm, {
		initialData: teacher,
		groups,
		onSave: handleSave,
		onCancel: () => navigate({
			to: "/dashboard/teachers/$id",
			params: { id }
		}),
		title: `تعديل بيانات الشيخ: ${teacher.name}`,
		subtitle: "تحديث التخصص العلمي، الإجازات، معلومات الاتصال، أو كلمة مرور الدخول."
	});
}
//#endregion
export { EditTeacherPage as component };
