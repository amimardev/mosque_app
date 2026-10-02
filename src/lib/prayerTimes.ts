import api from '@/lib/apiClient';
import { PrayerName } from '../types';

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
}

export interface PrayerTimesData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: {
      day: string;
      month: { ar: string; en: string };
      year: string;
      date: string;
      weekday?: { ar: string; en: string };
    };
    gregorian: {
      date: string;
      day?: string;
      month?: { number: number; en: string };
      year?: string;
      weekday?: { en: string };
    };
  };
  meta?: {
    timezone: string;
    method: { id: number; name: string };
  };
}

// In-memory client cache
const clientPrayerCache = new Map<string, PrayerTimesData>();

/**
 * Fetch prayer times for Algeria (Algiers, Method 19)
 */
export async function getAlgeriaPrayerTimes(dateStr?: string): Promise<PrayerTimesData> {
  const cacheKey = dateStr || 'today';
  if (clientPrayerCache.has(cacheKey)) {
    return clientPrayerCache.get(cacheKey)!;
  }

  try {
    const res = await api.get('/api/prayer-times', {
      params: dateStr ? { date: dateStr } : {}
    });

    if (res.data?.success && res.data.data) {
      clientPrayerCache.set(cacheKey, res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.warn('Failed to load from /api/prayer-times proxy, trying direct AlAdhan API...', err);
  }

  // Direct client fallback
  try {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const formatted = dateStr || `${d}-${m}-${y}`;

    const res = await api.get(`https://api.aladhan.com/v1/timingsByCity/${formatted}?city=Algiers&country=Algeria&method=19`);
    if (res.data?.data) {
      clientPrayerCache.set(cacheKey, res.data.data);
      return res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch from AlAdhan direct:', err);
  }

  // Standard Algeria Fallback
  const fallback: PrayerTimesData = {
    timings: {
      Fajr: '05:17',
      Sunrise: '06:43',
      Dhuhr: '12:37',
      Asr: '15:59',
      Sunset: '18:31',
      Maghrib: '18:31',
      Isha: '19:52'
    },
    date: {
      readable: '01 Oct 2026',
      hijri: {
        day: '20',
        month: { ar: 'رَبيع الثاني', en: 'Rabi al-Thani' },
        year: '1448',
        date: '20-04-1448',
        weekday: { ar: 'الخميس', en: 'Thursday' }
      },
      gregorian: {
        date: '01-10-2026'
      }
    }
  };

  return fallback;
}

/**
 * Get prayer time for a specific prayer in 24h format (HH:MM)
 */
export function getPrayerTime(prayer: PrayerName, timings: PrayerTimings): string {
  switch (prayer) {
    case 'fajr':
      return timings.Fajr?.split(' ')[0] || '05:17';
    case 'dhuhr':
      return timings.Dhuhr?.split(' ')[0] || '12:37';
    case 'asr':
      return timings.Asr?.split(' ')[0] || '15:59';
    case 'maghrib':
      return timings.Maghrib?.split(' ')[0] || '18:31';
    case 'isha':
      return timings.Isha?.split(' ')[0] || '19:52';
    default:
      return '16:00';
  }
}

/**
 * Add hours and minutes to a HH:MM time string
 */
export function addTimeToTimeStr(timeStr: string, offsetHours: number = 0, offsetMinutes: number = 0): string {
  if (!timeStr) return '00:00';
  const clean = timeStr.split(' ')[0];
  const [hStr, mStr] = clean.split(':');
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

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Calculate actual start and end clock times from prayer configuration
 */
export function calculateSessionClockTimes(
  startType: 'time' | 'prayer',
  startTime: string | null | undefined,
  startPrayer: PrayerName | null | undefined,
  startOffsetHours: number | undefined,
  endType: 'time' | 'prayer',
  endTime: string | null | undefined,
  endPrayer: PrayerName | null | undefined,
  endOffsetHours: number | undefined,
  timings: PrayerTimings
): { calculatedStartTime: string; calculatedEndTime: string } {
  let calcStart = '16:30';
  let calcEnd = '18:00';

  if (startType === 'prayer' && startPrayer) {
    const base = getPrayerTime(startPrayer, timings);
    calcStart = addTimeToTimeStr(base, startOffsetHours || 0);
  } else if (startTime) {
    calcStart = startTime;
  }

  if (endType === 'prayer' && endPrayer) {
    const base = getPrayerTime(endPrayer, timings);
    calcEnd = addTimeToTimeStr(base, endOffsetHours || 0);
  } else if (endTime) {
    calcEnd = endTime;
  }

  return {
    calculatedStartTime: calcStart,
    calculatedEndTime: calcEnd
  };
}

/**
 * Format 24h time to 12h Arabic notation (e.g., "03:59 م" or "05:17 ص")
 */
export function formatTime12hArabic(time24: string): string {
  if (!time24) return '';
  const clean = time24.split(' ')[0];
  const [hStr, mStr] = clean.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;

  if (isNaN(h)) return time24;

  const isPM = h >= 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const period = isPM ? 'م' : 'ص';

  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Determine the next prayer and remaining time countdown
 */
export function getNextPrayerInfo(timings: PrayerTimings): {
  name: string;
  arabicName: string;
  time24: string;
  time12: string;
  remainingText: string;
} {
  const prayerList: Array<{ name: string; arabic: string; time: string }> = [
    { name: 'Fajr', arabic: 'الفجر', time: timings.Fajr?.split(' ')[0] || '05:17' },
    { name: 'Dhuhr', arabic: 'الظهر', time: timings.Dhuhr?.split(' ')[0] || '12:37' },
    { name: 'Asr', arabic: 'العصر', time: timings.Asr?.split(' ')[0] || '15:59' },
    { name: 'Maghrib', arabic: 'المغرب', time: timings.Maghrib?.split(' ')[0] || '18:31' },
    { name: 'Isha', arabic: 'العشاء', time: timings.Isha?.split(' ')[0] || '19:52' },
  ];

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const p of prayerList) {
    const [h, m] = p.time.split(':').map(Number);
    const prayerMinutes = h * 60 + m;

    if (prayerMinutes > currentMinutes) {
      const diff = prayerMinutes - currentMinutes;
      const remHours = Math.floor(diff / 60);
      const remMins = diff % 60;
      const remainingText = remHours > 0 
        ? `${remHours} س و ${remMins} د`
        : `${remMins} دقيقة`;

      return {
        name: p.name,
        arabicName: p.arabic,
        time24: p.time,
        time12: formatTime12hArabic(p.time),
        remainingText
      };
    }
  }

  // If past Isha, next is Fajr tomorrow
  const [fajrH, fajrM] = prayerList[0].time.split(':').map(Number);
  const fajrTomorrowMinutes = (24 * 60 - currentMinutes) + (fajrH * 60 + fajrM);
  const remHours = Math.floor(fajrTomorrowMinutes / 60);
  const remMins = fajrTomorrowMinutes % 60;

  return {
    name: 'Fajr',
    arabicName: 'الفجر',
    time24: prayerList[0].time,
    time12: formatTime12hArabic(prayerList[0].time),
    remainingText: `${remHours} س و ${remMins} د`
  };
}

export interface SessionDisplayTimeResult {
  displayText: string;          // e.g. "من بعد صلاة العصر إلى صلاة المغرب (15:59 - 18:31)"
  arabicDescription: string;    // e.g. "من بعد صلاة العصر إلى صلاة المغرب"
  timeSlot: string;             // e.g. "15:59 - 18:31"
  startTime: string;            // e.g. "15:59"
  endTime: string;              // e.g. "18:31"
  formatted12h: string;         // e.g. "03:59 م - 06:31 م"
}

/**
 * Universal function to calculate the calculated display time for any session/group timetable entry
 * using real AlAdhan API prayer timings for Algeria
 */
export function calculateSessionDisplayTime(
  entry: any,
  timings: PrayerTimings = {
    Fajr: '05:17',
    Sunrise: '06:43',
    Dhuhr: '12:37',
    Asr: '15:59',
    Sunset: '18:31',
    Maghrib: '18:31',
    Isha: '19:52'
  }
): SessionDisplayTimeResult {
  if (!entry) {
    return {
      displayText: '',
      arabicDescription: '',
      timeSlot: '',
      startTime: '',
      endTime: '',
      formatted12h: ''
    };
  }

  const sessionTime = entry.sessionTime || entry.groupSessionTime || (entry.startType || entry.endType ? entry : null);

  let calcStart = entry.startTime || '16:30';
  let calcEnd = entry.endTime || '18:00';
  let desc = entry.sessionTimeText || entry.studyTime || entry.groupStudyTime || '';

  // Clean day names from desc if present (e.g. "السبت، الاثنين • ")
  if (desc.includes('•')) {
    desc = desc.split('•')[1]?.trim() || desc;
  }

  if (sessionTime) {
    const { startType, startTime, startPrayer, startOffsetHours, endType, endTime, endPrayer, endOffsetHours } = sessionTime;

    if (startType === 'prayer' && startPrayer) {
      const base = getPrayerTime(startPrayer, timings);
      calcStart = addTimeToTimeStr(base, Number(startOffsetHours) || 0);
    } else if (startTime) {
      calcStart = startTime;
    }

    if (endType === 'prayer' && endPrayer) {
      const base = getPrayerTime(endPrayer, timings);
      calcEnd = addTimeToTimeStr(base, Number(endOffsetHours) || 0);
    } else if (endTime) {
      calcEnd = endTime;
    }

    if (startType === 'prayer' || endType === 'prayer') {
      const pAr: Record<string, string> = {
        fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء'
      };

      const startName = startPrayer ? (pAr[startPrayer] || startPrayer) : '';
      const endName = endPrayer ? (pAr[endPrayer] || endPrayer) : '';

      const sStr = startType === 'prayer' ? `من صلاة ${startName}` : `من ${calcStart}`;
      const eStr = endType === 'prayer' ? `إلى صلاة ${endName}` : `إلى ${calcEnd}`;
      desc = `${sStr} ${eStr}`;
    }
  } else if (desc) {
    const lower = desc.toLowerCase();

    if (lower.includes('الفجر')) {
      calcStart = addTimeToTimeStr(timings.Fajr?.split(' ')[0] || '05:17', lower.includes('فجر +') ? 1 : 0);
    } else if (lower.includes('الظهر')) {
      calcStart = addTimeToTimeStr(timings.Dhuhr?.split(' ')[0] || '12:37', 0);
    } else if (lower.includes('العصر')) {
      calcStart = addTimeToTimeStr(timings.Asr?.split(' ')[0] || '15:59', 0);
    } else if (lower.includes('المغرب')) {
      calcStart = addTimeToTimeStr(timings.Maghrib?.split(' ')[0] || '18:31', 0);
    } else if (lower.includes('العشاء')) {
      calcStart = addTimeToTimeStr(timings.Isha?.split(' ')[0] || '19:52', 0);
    }

    if (lower.includes('إلى صلاة العشاء') || lower.includes('إلى العشاء')) {
      calcEnd = addTimeToTimeStr(timings.Isha?.split(' ')[0] || '19:52', 0);
    } else if (lower.includes('إلى صلاة المغرب') || lower.includes('إلى المغرب')) {
      calcEnd = addTimeToTimeStr(timings.Maghrib?.split(' ')[0] || '18:31', 0);
    } else if (lower.includes('إلى صلاة العصر') || lower.includes('إلى العصر')) {
      calcEnd = addTimeToTimeStr(timings.Asr?.split(' ')[0] || '15:59', 0);
    } else if (lower.includes('الفجر + ساعة') || lower.includes('فجر + 1')) {
      calcEnd = addTimeToTimeStr(timings.Fajr?.split(' ')[0] || '05:17', 1);
    }
  }

  if (entry.timeSlot && !sessionTime) {
    const parts = entry.timeSlot.split(' - ');
    if (parts.length === 2) {
      calcStart = parts[0].trim();
      calcEnd = parts[1].trim();
    }
  }

  const slotStr = `${calcStart} - ${calcEnd}`;
  const f12Start = formatTime12hArabic(calcStart);
  const f12End = formatTime12hArabic(calcEnd);
  const f12Str = `${f12Start} - ${f12End}`;

  if (!desc) {
    desc = `توقيت الحصة (${slotStr})`;
  }

  let finalDisplay = desc;
  if (desc && !desc.includes(slotStr)) {
    finalDisplay = `${desc} (${slotStr})`;
  }

  return {
    displayText: finalDisplay,
    arabicDescription: desc,
    timeSlot: slotStr,
    startTime: calcStart,
    endTime: calcEnd,
    formatted12h: f12Str
  };
}

