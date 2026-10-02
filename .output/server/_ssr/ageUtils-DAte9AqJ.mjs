//#region node_modules/.nitro/vite/services/ssr/assets/ageUtils-DAte9AqJ.js
/**
* Calculates a person's real age in full years relative to the current date.
* Supports:
* - ISO date strings: "2012-05-14"
* - Date objects
* - Timestamps or birth date strings stored in age or dateOfBirth columns
* - Fallback to numeric value if an older integer is passed
*/
function calculateAge(birthDateInput) {
	if (birthDateInput === null || birthDateInput === void 0 || birthDateInput === "") return null;
	if (typeof birthDateInput === "number") return birthDateInput >= 0 ? birthDateInput : null;
	const str = String(birthDateInput).trim();
	if (/^\d+$/.test(str)) {
		const num = parseInt(str, 10);
		return isNaN(num) ? null : num;
	}
	const birthDate = new Date(str);
	if (isNaN(birthDate.getTime())) return null;
	const today = /* @__PURE__ */ new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) age--;
	return age >= 0 ? age : null;
}
/**
* Returns formatted age in Arabic, e.g. "14 سنة" or fallback string.
*/
function formatArabicAge(birthDateInput, fallback = "غير محدد") {
	const age = calculateAge(birthDateInput);
	if (age === null) return fallback;
	return `${age} سنة`;
}
//#endregion
export { formatArabicAge as n, calculateAge as t };
