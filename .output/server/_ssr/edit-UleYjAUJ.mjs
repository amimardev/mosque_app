import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate, T as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as api } from "./router-DHZqPWB-.mjs";
import { t as StudentForm } from "./StudentForm-24v8tjms.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-UleYjAUJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditStudentPage() {
	const { id } = useParams({ from: "/dashboard/students/$id/edit" });
	const navigate = useNavigate();
	const [student, setStudent] = (0, import_react.useState)(null);
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadData() {
			try {
				setIsLoading(true);
				const [studentRes, groupsRes] = await Promise.all([api.get(`/api/students/${id}`), api.get("/api/groups")]);
				setStudent(studentRes.data.student || null);
				setGroups(groupsRes.data.groups || []);
			} catch (err) {
				console.error("Failed to load edit student data:", err);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, [id]);
	const handleSave = async (studentData) => {
		await api.put(`/api/students/${id}`, studentData);
		navigate({
			to: "/dashboard/students/$id",
			params: { id }
		});
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل بيانات الطالب..."
	});
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-rose-500 font-bold",
		children: "لم يتم العثور على سجل الطالب."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentForm, {
		initialData: student,
		groups,
		onSave: handleSave,
		onCancel: () => navigate({
			to: "/dashboard/students/$id",
			params: { id }
		}),
		title: `تعديل ملف الطالب: ${student.name}`,
		subtitle: "تحديث البيانات الشخصية للطالب، الحلقة الدراسية، أو مستوى الحفظ القرآني الحالي."
	});
}
//#endregion
export { EditStudentPage as component };
