//#region node_modules/.nitro/vite/services/ssr/assets/types-D-Kr0J12.js
var PRAYER_OPTIONS = [
	{
		id: "fajr",
		nameAr: "صلاة الفجر",
		shortAr: "الفجر"
	},
	{
		id: "dhuhr",
		nameAr: "صلاة الظهر",
		shortAr: "الظهر"
	},
	{
		id: "asr",
		nameAr: "صلاة العصر",
		shortAr: "العصر"
	},
	{
		id: "maghrib",
		nameAr: "صلاة المغرب",
		shortAr: "المغرب"
	},
	{
		id: "isha",
		nameAr: "صلاة العشاء",
		shortAr: "العشاء"
	}
];
var PRAYER_LABELS = {
	fajr: "الفجر",
	dhuhr: "الظهر",
	asr: "العصر",
	maghrib: "المغرب",
	isha: "العشاء"
};
var OFFSET_HOURS_OPTIONS = [
	{
		value: 0,
		label: "بدون إضافة (+0)"
	},
	{
		value: 1,
		label: "+ ساعة واحدة (+1)"
	},
	{
		value: 2,
		label: "+ ساعتان (+2)"
	},
	{
		value: 3,
		label: "+ 3 ساعات (+3)"
	},
	{
		value: 4,
		label: "+ 4 ساعات (+4)"
	}
];
function formatSessionTimeArabic(session, fallback) {
	if (!session) return fallback || "";
	let startPart = "";
	if (session.startType === "prayer" && session.startPrayer) {
		const prayerName = PRAYER_LABELS[session.startPrayer] || session.startPrayer;
		const offset = session.startOffsetHours ?? 0;
		if (offset > 0) startPart = `بعد صلاة ${prayerName} + ${offset === 1 ? "ساعة" : offset === 2 ? "ساعتين" : `${offset} ساعات`}`;
		else startPart = `بعد صلاة ${prayerName}`;
	} else startPart = session.startTime ? session.startTime : "--:--";
	let endPart = "";
	if (session.endType === "prayer" && session.endPrayer) {
		const prayerName = PRAYER_LABELS[session.endPrayer] || session.endPrayer;
		const offset = session.endOffsetHours ?? 0;
		if (offset > 0) endPart = `صلاة ${prayerName} + ${offset === 1 ? "ساعة" : offset === 2 ? "ساعتين" : `${offset} ساعات`}`;
		else endPart = `صلاة ${prayerName}`;
	} else endPart = session.endTime || "--:--";
	return `من ${startPart} إلى ${endPart}`;
}
//#endregion
export { PRAYER_OPTIONS as n, formatSessionTimeArabic as r, OFFSET_HOURS_OPTIONS as t };
