import { it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { S as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-Bx1YxP-a.js
var import_jsx_runtime = require_jsx_runtime();
function RedirectToSessions() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/dashboard/sessions",
		replace: true
	});
}
//#endregion
export { RedirectToSessions as component };
