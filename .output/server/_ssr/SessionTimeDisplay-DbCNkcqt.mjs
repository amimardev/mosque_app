import { o as __toESM } from "../_runtime.mjs";
import { at as require_react, it as require_jsx_runtime } from "../_libs/@base-ui/react+[...].mjs";
import { n as calculateSessionDisplayTime, r as getAlgeriaPrayerTimes } from "./prayerTimes-Cw4SB2zl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SessionTimeDisplay-DbCNkcqt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Custom React Hook to get calculated display time for any session/group entry
*/
function useSessionTimeDisplay(entry) {
	const [timings, setTimings] = (0, import_react.useState)(void 0);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		getAlgeriaPrayerTimes().then((data) => {
			if (isMounted && data?.timings) setTimings(data.timings);
		});
		return () => {
			isMounted = false;
		};
	}, []);
	return (0, import_react.useMemo)(() => {
		return calculateSessionDisplayTime(entry, timings);
	}, [entry, timings]);
}
/**
* Universal Reusable Component to calculate and display the time of any session / group entry
* using real AlAdhan API prayer timings for Algeria.
*/
var SessionTimeDisplay = ({ entry, className = "", format = "full" }) => {
	const result = useSessionTimeDisplay(entry);
	let text = result.displayText;
	if (format === "slot") text = result.timeSlot;
	if (format === "12h") text = result.formatted12h;
	if (format === "description") text = result.arabicDescription;
	const fallback = entry?.studyTime || entry?.sessionTimeText || entry?.timeSlot || "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: text || fallback
	});
};
//#endregion
export { SessionTimeDisplay as t };
