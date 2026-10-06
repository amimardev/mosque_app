export interface SurahInfo {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  englishTranslation: string;
  totalAyahs: number;
  type: 'Meccan' | 'Medinan';
}

export interface StudentRating {
  id: string;
  studentId: string;
  teacherId?: string | null;
  groupId?: string | null;
  month: string; // e.g. "2026-09"
  hifzScore: number; // 0 - 100
  tajweedScore: number; // 0 - 100
  murajaahScore: number; // 0 - 100
  attendanceScore: number; // 0 - 100
  behaviorScore: number; // 0 - 100
  overallScore: number; // 0 - 100
  grade: string;
  surahEvaluated?: string | null;
  ayahStart?: number | null;
  ayahEnd?: number | null;
  notes?: string | null;
  createdAt: string;
  student?: {
    id: string;
    name: string;
    avatar: string;
    currentSurahName?: string;
    currentAyah?: number;
    age?: number;
  } | null;
  teacher?: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  group?: {
    id: string;
    number: number;
    type: string;
    studyTime: string;
  } | null;
}

export type AttendanceStatus = 'absent' | 'present' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  groupId: string;
  groupTypeName?: string | null;
  groupNumber?: number | null;
  date: string; // YYYY-MM-DD
  sessionTimeText?: string | null; // e.g., "من صلاة العصر إلى صلاة المغرب"
  status: AttendanceStatus;
  reason?: string | null;
  recordedByTeacherId?: string | null;
  createdAt: string;
  updatedAt?: string;
  student?: {
    id: string;
    name: string;
    avatar: string;
    gender?: string;
  } | null;
  teacher?: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  group?: {
    id: string;
    number: number;
    type?: string;
    studyTime?: string;
  } | null;
}

export type UserRole = 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  teacherId?: string | null;
  parentId?: string | null;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionRecord {
  id: string;
  sessionId: string;
  studentId: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'excused';
  absenceReason?: string | null;
  surahNumber?: number | null;
  surahName?: string | null;
  ayahStart?: number | null;
  ayahEnd?: number | null;
  teacherRemarque?: string | null;
  isAssessed?: boolean;
  student?: Student | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  groupId: string;
  teacherId?: string | null;
  sessionType: 'main' | 'exception';
  date: string; // YYYY-MM-DD
  startTime?: string | null;
  endTime?: string | null;
  sessionTimeText?: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string | null;
  group?: Group | null;
  teacher?: Teacher | null;
  records?: SessionRecord[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  id: string;
  name: string;
  /** @deprecated Email is no longer stored or collected. */
  email?: never;
  phone?: string | null;
  avatar: string;
  bio?: string | null;
  status: 'active' | 'on_leave';
  isAdmin?: boolean;
  assignedGroups?: {
    id: string;
    number: number;
    type: string;
    studyTime: string;
    name?: string;
    role?: string;
  }[];
  studentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  groupsCount?: number;
  totalStudents?: number;
  groups?: Group[];
  createdAt?: string;
  updatedAt?: string;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface GroupSessionTime {
  startType: 'time' | 'prayer';
  startTime?: string | null;       // e.g. "16:30" (when startType === 'time')
  startPrayer?: PrayerName | null;  // e.g. "asr" (when startType === 'prayer')
  startOffsetHours?: number;       // e.g. 0, 1, 2, 3, 4 (when startType === 'prayer')
  endType: 'time' | 'prayer';
  endTime?: string | null;         // e.g. "18:00" (when endType === 'time')
  endPrayer?: PrayerName | null;    // e.g. "maghrib" (when endType === 'prayer')
  endOffsetHours?: number;         // e.g. 0, 1, 2, 3, 4 (when endType === 'prayer')
}

export const PRAYER_OPTIONS: { id: PrayerName; nameAr: string; shortAr: string }[] = [
  { id: 'fajr', nameAr: 'صلاة الفجر', shortAr: 'الفجر' },
  { id: 'dhuhr', nameAr: 'صلاة الظهر', shortAr: 'الظهر' },
  { id: 'asr', nameAr: 'صلاة العصر', shortAr: 'العصر' },
  { id: 'maghrib', nameAr: 'صلاة المغرب', shortAr: 'المغرب' },
  { id: 'isha', nameAr: 'صلاة العشاء', shortAr: 'العشاء' },
];

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

export const OFFSET_HOURS_OPTIONS = [
  { value: 0, label: 'بدون إضافة (+0)' },
  { value: 1, label: '+ ساعة واحدة (+1)' },
  { value: 2, label: '+ ساعتان (+2)' },
  { value: 3, label: '+ 3 ساعات (+3)' },
  { value: 4, label: '+ 4 ساعات (+4)' },
];

export function formatSessionTimeArabic(session?: GroupSessionTime | null, fallback?: string): string {
  if (!session) return fallback || '';

  let startPart = '';
  if (session.startType === 'prayer' && session.startPrayer) {
    const prayerName = PRAYER_LABELS[session.startPrayer] || session.startPrayer;
    const offset = session.startOffsetHours ?? 0;
    if (offset > 0) {
      const offsetStr = offset === 1 ? 'ساعة' : offset === 2 ? 'ساعتين' : `${offset} ساعات`;
      startPart = `بعد صلاة ${prayerName} + ${offsetStr}`;
    } else {
      startPart = `بعد صلاة ${prayerName}`;
    }
  } else {
    startPart = session.startTime ? session.startTime : '--:--';
  }

  let endPart = '';
  if (session.endType === 'prayer' && session.endPrayer) {
    const prayerName = PRAYER_LABELS[session.endPrayer] || session.endPrayer;
    const offset = session.endOffsetHours ?? 0;
    if (offset > 0) {
      const offsetStr = offset === 1 ? 'ساعة' : offset === 2 ? 'ساعتين' : `${offset} ساعات`;
      endPart = `صلاة ${prayerName} + ${offsetStr}`;
    } else {
      endPart = `صلاة ${prayerName}`;
    }
  } else {
    endPart = session.endTime || '--:--';
  }

  return `من ${startPart} إلى ${endPart}`;
}

export interface Group {
  id: string;
  number: number;
  typeId: string;
  typeSlug?: string;
  type?: string;
  description?: string | null;
  groupType?: GroupType | null;
  gender: 'male' | 'female';
  sessionTime?: GroupSessionTime | null;
  studyTime: string; // e.g., "السبت، الاثنين • من بعد صلاة العصر إلى المغرب"
  days: string[];
  timeSlot?: string | null;
  room?: string | null;
  capacity: number;
  level: string;
  status: string;
  teachers?: (Teacher & { role?: string })[];
  studentsCount?: number;
  students?: Student[];
  studentsPreview?: {
    id: string;
    name: string;
    avatar: string;
    currentSurahName: string;
    currentAyah: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Parent {
  id: string;
  name: string;
  /** @deprecated Email is no longer stored or collected. */
  email?: never;
  phone: string;
  address?: string | null;
  notes?: string | null;
  studentsCount?: number;
  students?: Student[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  dateOfBirth?: string | null;
  age?: number | string | null;
  calculatedAge?: number | null;
  parentId?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
  /** @deprecated Email is no longer stored or collected. */
  email?: never;
  phone?: string | null;
  parent?: Parent | null;
  groupId?: string | null;
  currentSurahNumber: number;
  currentSurahName: string;
  currentAyah: number;
  targetJuz: number;
  memorizedJuzCount: number;
  level: 'primary' | 'middle' | 'secondary';
  notes?: string | null;
  group?: {
    id: string;
    number: number;
    type: string;
    name?: string;
    studyTime: string;
    room?: string;
    level?: string;
    teachers?: Teacher[];
  } | null;
  latestRating?: StudentRating | null;
  ratings?: StudentRating[];
  sessions?: StudentSessionSummary[];
  surahDetails?: SurahInfo | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentSessionSummary {
  id: string;
  date: string;
  sessionType: 'main' | 'exception';
  sessionTimeText?: string | null;
  attendanceStatus: AttendanceStatus;
  surahName?: string | null;
  ayahStart?: number | null;
  ayahEnd?: number | null;
  teacherRemarque?: string | null;
  teacherName?: string | null;
}

export function getGroupDisplayName(group: { name?: string | null; type?: string | null; number?: number | null }): string {
  if (group.name?.trim()) return group.name;
  const type = group.type?.trim() || 'حلقة قرآنية';
  return group.number == null ? type : `${type} ${group.number}`;
}

export interface MadrasaStats {
  totalStudents: number;
  totalTeachers: number;
  totalGroups: number;
  averageRating: number;
  totalJuzMemorized: number;
  topStudents: Student[];
}
