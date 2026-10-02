import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as api } from "./router-D9XCqWvD.mjs";
import { t as StudentForm } from "./StudentForm-w3FP_bem.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-C7lHxB3F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewStudentPage() {
	const navigate = useNavigate();
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadGroups() {
			try {
				const res = await api.get("/api/groups");
				setGroups(res.data.groups || []);
			} catch (e) {
				console.error("Failed to load groups:", e);
			} finally {
				setIsLoading(false);
			}
		}
		loadGroups();
	}, []);
	const handleSave = async (studentData) => {
		await api.post("/api/students", studentData);
		navigate({ to: "/dashboard/students" });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-slate-400 text-xs font-semibold",
		children: "جاري تحميل النموذج..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentForm, {
		groups,
		onSave: handleSave,
		onCancel: () => navigate({ to: "/dashboard/students" }),
		title: "تسجيل طالب جديد في المدرسة",
		subtitle: "أدخل بيانات الطالب الشخصية، وحدد موضع الحفظ القرآني الحالي، وأسنده إلى الحلقة المناسبة."
	});
}
//#endregion
export { NewStudentPage as component };
