import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { C as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as api } from "./router-Bezq88tF.mjs";
import { t as TeacherForm } from "./TeacherForm-Bl2l713e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-ClXEOvVW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewTeacherPage() {
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
	const handleSave = async (teacherData) => {
		await api.post("/api/teachers", teacherData);
		navigate({ to: "/dashboard/teachers" });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-slate-400 text-xs",
		children: "جاري تحميل النموذج..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherForm, {
		groups,
		onSave: handleSave,
		onCancel: () => navigate({ to: "/dashboard/teachers" }),
		title: "تسجيل معلم / شيخ جديد",
		subtitle: "إدخال معلومات الاتصال للشيخ، تخصص القراءات والإجازات، وحساب الدخول الخاص به."
	});
}
//#endregion
export { NewTeacherPage as component };
