import { r as api } from "./router-DHZqPWB-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prayerTimes-Cw4SB2zl.js
var clientPrayerCache = /* @__PURE__ */ new Map();
/**
* Fetch prayer times for Algeria (Algiers, Method 19)
*/
async function getAlgeriaPrayerTimes(dateStr) {
	const cacheKey = dateStr || "today";
	if (clientPrayerCache.has(cacheKey)) return clientPrayerCache.get(cacheKey);
	try {
		const res = await api.get("/api/prayer-times", { params: dateStr ? { date: dateStr } : {} });
		if (res.data?.success && res.data.data) {
			clientPrayerCache.set(cacheKey, res.data.data);
			return res.data.data;
		}
	} catch (err) {
		console.warn("Failed to load from /api/prayer-times proxy, trying direct AlAdhan API...", err);
	}
	try {
		const today = /* @__PURE__ */ new Date();
		const d = String(today.getDate()).padStart(2, "0");
		const m = String(today.getMonth() + 1).padStart(2, "0");
		const y = today.getFullYear();
		const formatted = dateStr || `${d}-${m}-${y}`;
		const res = await api.get(`https://api.aladhan.com/v1/timingsByCity/${formatted}?city=Algiers&country=Algeria&method=19`);
		if (res.data?.data) {
			clientPrayerCache.set(cacheKey, res.data.data);
			return res.data.data;
		}
	} catch (err) {
		console.error("Failed to fetch from AlAdhan direct:", err);
	}
	return {
		timings: {
			Fajr: "05:17",
			Sunrise: "06:43",
			Dhuhr: "12:37",
			Asr: "15:59",
			Sunset: "18:31",
			Maghrib: "18:31",
			Isha: "19:52"
		},
		date: {
			readable: "01 Oct 2026",
			hijri: {
				day: "20",
				month: {
					ar: "رَبيع الثاني",
					en: "Rabi al-Thani"
				},
				year: "1448",
				date: "20-04-1448",
				weekday: {
					ar: "الخميس",
					en: "Thursday"
				}
			},
			gregorian: { date: "01-10-2026" }
		}
	};
}
/**
* Get prayer time for a specific prayer in 24h format (HH:MM)
*/
function getPrayerTime(prayer, timings) {
	switch (prayer) {
		case "fajr": return timings.Fajr?.split(" ")[0] || "05:17";
		case "dhuhr": return timings.Dhuhr?.split(" ")[0] || "12:37";
		case "asr": return timings.Asr?.split(" ")[0] || "15:59";
		case "maghrib": return timings.Maghrib?.split(" ")[0] || "18:31";
		case "isha": return timings.Isha?.split(" ")[0] || "19:52";
		default: return "16:00";
	}
}
/**
* Add hours and minutes to a HH:MM time string
*/
function addTimeToTimeStr(timeStr, offsetHours = 0, offsetMinutes = 0) {
	if (!timeStr) return "00:00";
	const [hStr, mStr] = timeStr.split(" ")[0].split(":");
	let h = parseInt(hStr, 10);
	let m = parseInt(mStr, 10);
	if (isNaN(h)) h = 0;
	if (isNaN(m)) m = 0;
	m += offsetMinutes;
	h += offsetHours + Math.floor(m / 60);
	m = m % 60;
	if (m < 0) {
		m += 60;
		h -= 1;
	}
	h = (h % 24 + 24) % 24;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
/**
* Calculate actual start and end clock times from prayer configuration
*/
function calculateSessionClockTimes(startType, startTime, startPrayer, startOffsetHours, endType, endTime, endPrayer, endOffsetHours, timings) {
	let calcStart = "16:30";
	let calcEnd = "18:00";
	if (startType === "prayer" && startPrayer) calcStart = addTimeToTimeStr(getPrayerTime(startPrayer, timings), startOffsetHours || 0);
	else if (startTime) calcStart = startTime;
	if (endType === "prayer" && endPrayer) calcEnd = addTimeToTimeStr(getPrayerTime(endPrayer, timings), endOffsetHours || 0);
	else if (endTime) calcEnd = endTime;
	return {
		calculatedStartTime: calcStart,
		calculatedEndTime: calcEnd
	};
}
/**
* Format 24h time to 12h Arabic notation (e.g., "03:59 م" or "05:17 ص")
*/
function formatTime12hArabic(time24) {
	if (!time24) return "";
	const [hStr, mStr] = time24.split(" ")[0].split(":");
	let h = parseInt(hStr, 10);
	const m = parseInt(mStr, 10) || 0;
	if (isNaN(h)) return time24;
	const isPM = h >= 12;
	const h12 = h % 12 === 0 ? 12 : h % 12;
	const period = isPM ? "م" : "ص";
	return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}
/**
* Universal function to calculate the calculated display time for any session/group timetable entry
* using real AlAdhan API prayer timings for Algeria
*/
function calculateSessionDisplayTime(entry, timings = {
	Fajr: "05:17",
	Sunrise: "06:43",
	Dhuhr: "12:37",
	Asr: "15:59",
	Sunset: "18:31",
	Maghrib: "18:31",
	Isha: "19:52"
}) {
	if (!entry) return {
		displayText: "",
		arabicDescription: "",
		timeSlot: "",
		startTime: "",
		endTime: "",
		formatted12h: ""
	};
	const sessionTime = entry.sessionTime || entry.groupSessionTime || (entry.startType || entry.endType ? entry : null);
	let calcStart = entry.startTime || "16:30";
	let calcEnd = entry.endTime || "18:00";
	let desc = entry.sessionTimeText || entry.studyTime || entry.groupStudyTime || "";
	if (desc.includes("•")) desc = desc.split("•")[1]?.trim() || desc;
	if (sessionTime) {
		const { startType, startTime, startPrayer, startOffsetHours, endType, endTime, endPrayer, endOffsetHours } = sessionTime;
		if (startType === "prayer" && startPrayer) calcStart = addTimeToTimeStr(getPrayerTime(startPrayer, timings), Number(startOffsetHours) || 0);
		else if (startTime) calcStart = startTime;
		if (endType === "prayer" && endPrayer) calcEnd = addTimeToTimeStr(getPrayerTime(endPrayer, timings), Number(endOffsetHours) || 0);
		else if (endTime) calcEnd = endTime;
		if (startType === "prayer" || endType === "prayer") {
			const pAr = {
				fajr: "الفجر",
				dhuhr: "الظهر",
				asr: "العصر",
				maghrib: "المغرب",
				isha: "العشاء"
			};
			const startName = startPrayer ? pAr[startPrayer] || startPrayer : "";
			const endName = endPrayer ? pAr[endPrayer] || endPrayer : "";
			desc = `${startType === "prayer" ? `من صلاة ${startName}` : `من ${calcStart}`} ${endType === "prayer" ? `إلى صلاة ${endName}` : `إلى ${calcEnd}`}`;
		}
	} else if (desc) {
		const lower = desc.toLowerCase();
		if (lower.includes("الفجر")) calcStart = addTimeToTimeStr(timings.Fajr?.split(" ")[0] || "05:17", lower.includes("فجر +") ? 1 : 0);
		else if (lower.includes("الظهر")) calcStart = addTimeToTimeStr(timings.Dhuhr?.split(" ")[0] || "12:37", 0);
		else if (lower.includes("العصر")) calcStart = addTimeToTimeStr(timings.Asr?.split(" ")[0] || "15:59", 0);
		else if (lower.includes("المغرب")) calcStart = addTimeToTimeStr(timings.Maghrib?.split(" ")[0] || "18:31", 0);
		else if (lower.includes("العشاء")) calcStart = addTimeToTimeStr(timings.Isha?.split(" ")[0] || "19:52", 0);
		if (lower.includes("إلى صلاة العشاء") || lower.includes("إلى العشاء")) calcEnd = addTimeToTimeStr(timings.Isha?.split(" ")[0] || "19:52", 0);
		else if (lower.includes("إلى صلاة المغرب") || lower.includes("إلى المغرب")) calcEnd = addTimeToTimeStr(timings.Maghrib?.split(" ")[0] || "18:31", 0);
		else if (lower.includes("إلى صلاة العصر") || lower.includes("إلى العصر")) calcEnd = addTimeToTimeStr(timings.Asr?.split(" ")[0] || "15:59", 0);
		else if (lower.includes("الفجر + ساعة") || lower.includes("فجر + 1")) calcEnd = addTimeToTimeStr(timings.Fajr?.split(" ")[0] || "05:17", 1);
	}
	if (entry.timeSlot && !sessionTime) {
		const parts = entry.timeSlot.split(" - ");
		if (parts.length === 2) {
			calcStart = parts[0].trim();
			calcEnd = parts[1].trim();
		}
	}
	const slotStr = `${calcStart} - ${calcEnd}`;
	const f12Str = `${formatTime12hArabic(calcStart)} - ${formatTime12hArabic(calcEnd)}`;
	if (!desc) desc = `توقيت الحصة (${slotStr})`;
	let finalDisplay = desc;
	if (desc && !desc.includes(slotStr)) finalDisplay = `${desc} (${slotStr})`;
	return {
		displayText: finalDisplay,
		arabicDescription: desc,
		timeSlot: slotStr,
		startTime: calcStart,
		endTime: calcEnd,
		formatted12h: f12Str
	};
}
//#endregion
export { getPrayerTime as i, calculateSessionDisplayTime as n, getAlgeriaPrayerTimes as r, calculateSessionClockTimes as t };
