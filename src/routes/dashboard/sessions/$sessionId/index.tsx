import { createFileRoute, Link, useParams, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { 
  ArrowRight, Clock, User, Check, X, Search, 
  Award, AlertCircle, Save, MessageSquare,
  CheckCircle2, Calendar as CalendarIcon, UserCheck, Sparkles,
  History, Eye
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { QURAN_SURAHS } from '../../../../lib/quranData';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import { FormItem, FormLabel } from '../../../../components/ui/form';
import { SessionTimeDisplay } from '../../../../components/common/SessionTimeDisplay';

export const Route = createFileRoute('/dashboard/sessions/$sessionId/')({
  component: SessionAssessmentPage,
});

interface Session {
  id: string;
  groupId: string;
  teacherId: string | null;
  sessionType: 'main' | 'exception';
  date: string;
  startTime: string;
  endTime: string;
  sessionTimeText: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
  groupStudyTime?: string;
  level?: string;
  room?: string;
  groupNumber?: number;
  teacherName?: string;
  teacherAvatar?: string;
}

interface SessionStudentRecord {
  id: string;
  sessionId: string;
  studentId: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'excused';
  absenceReason: string | null;
  surahNumber: number | null;
  surahName: string | null;
  ayahStart: number | null;
  ayahEnd: number | null;
  teacherRemarque: string | null;
  isAssessed?: boolean;
  studentName: string;
  studentAvatar: string;
  studentAge?: number;
}

interface StudentHistoryData {
  student: {
    id: string;
    name: string;
    avatar: string;
    currentSurahName?: string;
    currentAyah?: number;
  };
  lastProgress: {
    surahName: string;
    surahNumber: number;
    latestVerse: number;
    ayahStart?: number | null;
    ayahEnd?: number | null;
    date?: string | null;
    teacherRemarque?: string | null;
  };
  latestSessions: Array<{
    date: string;
    status: string;
    reason?: string | null;
    surahName?: string | null;
    ayahStart?: number | null;
    ayahEnd?: number | null;
  }>;
}

function SessionAssessmentPage() {
  const { sessionId } = useParams({ from: '/dashboard/sessions/$sessionId/' });
  const { user } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [records, setRecords] = useState<SessionStudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionStatus, setSessionStatus] = useState<'scheduled' | 'completed' | 'cancelled'>('completed');
  const [isSavingRecords, setIsSavingRecords] = useState(false);

  // Student Assessment Dialog state
  const [selectedRecord, setSelectedRecord] = useState<SessionStudentRecord | null>(null);
  const [progSurah, setProgSurah] = useState('');
  const [progAyahStart, setProgAyahStart] = useState<number | string>('');
  const [progAyahEnd, setProgAyahEnd] = useState<number | string>('');
  const [progRemarque, setProgRemarque] = useState('');
  const [progAttendance, setProgAttendance] = useState<'present' | 'absent' | 'late' | 'excused'>('present');

  // Student History Dialog state
  const [historyStudent, setHistoryStudent] = useState<{ id: string; name: string } | null>(null);
  const [historyData, setHistoryData] = useState<StudentHistoryData | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const loadSessionDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await api.get(`/api/sessions/${sessionId}`);
      const sessionData = res.data.session;
      const recordsData = res.data.records || [];

      setSession(sessionData);
      setRecords(recordsData);
      setSessionNotes(sessionData.notes || '');
      setSessionStatus(sessionData.status || 'completed');
    } catch (err: any) {
      console.error('Failed to load session details:', err);
      setError(err.response?.data?.error || 'فشل في تحميل بيانات وتفاصيل الحصة');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadSessionDetails();
    }
  }, [sessionId]);

  const handleOpenProgressDialog = (rec: SessionStudentRecord) => {
    setSelectedRecord(rec);
    setProgSurah(rec.surahName || '');
    setProgAyahStart(rec.ayahStart || '');
    setProgAyahEnd(rec.ayahEnd || '');
    setProgRemarque(rec.teacherRemarque || rec.absenceReason || '');
    setProgAttendance(rec.attendanceStatus || 'present');
  };

  const handleOpenHistoryDialog = async (studentId: string, studentName: string) => {
    setHistoryStudent({ id: studentId, name: studentName });
    setIsLoadingHistory(true);
    setHistoryError('');
    setHistoryData(null);

    try {
      const res = await api.get(`/api/students/${studentId}/history`);
      setHistoryData(res.data);
    } catch (err: any) {
      console.error('Failed to load student history:', err);
      setHistoryError(err.response?.data?.error || 'فشل في تحميل سجل وتاريخ الطالب');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSaveStudentProgress = async () => {
    if (!selectedRecord || !session) return;

    const matchedSurah = QURAN_SURAHS.find(s => s.nameArabic === progSurah);
    const surahNum = matchedSurah ? matchedSurah.number : null;

    const updatedRecord: SessionStudentRecord = {
      ...selectedRecord,
      attendanceStatus: progAttendance,
      surahName: (progAttendance === 'present' || progAttendance === 'late') ? (progSurah || null) : null,
      surahNumber: (progAttendance === 'present' || progAttendance === 'late') ? surahNum : null,
      ayahStart: (progAttendance === 'present' || progAttendance === 'late') && progAyahStart ? Number(progAyahStart) : null,
      ayahEnd: (progAttendance === 'present' || progAttendance === 'late') && progAyahEnd ? Number(progAyahEnd) : null,
      absenceReason: (progAttendance === 'absent' || progAttendance === 'excused') ? (progRemarque.trim() || null) : null,
      teacherRemarque: (progAttendance === 'present' || progAttendance === 'late') ? (progRemarque.trim() || null) : null,
      isAssessed: true // Explicitly set to true in database!
    };

    const updated = records.map(r => {
      if (r.id === selectedRecord.id) {
        return updatedRecord;
      }
      return r;
    });

    setRecords(updated);
    setSelectedRecord(null);

    // Persist immediately to the database
    try {
      await api.post(`/api/sessions/${session.id}/records/${selectedRecord.id}`, updatedRecord);
    } catch (err) {
      console.error('Failed to save student assessment to DB:', err);
    }
  };

  const handleSaveAllRecords = async () => {
    if (!session) return;
    setIsSavingRecords(true);
    setError('');
    setSuccessMsg('');
    try {
      await api.post(`/api/sessions/${session.id}/records`, {
        records,
        notes: sessionNotes.trim(),
        status: sessionStatus
      });
      setSuccessMsg('تم حفظ وتحديث كافة بيانات وتقييمات الحصة بنجاح');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'فشل في حفظ سجلات الحصة');
    } finally {
      setIsSavingRecords(false);
    }
  };

  const formatArabicDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
  };

  const getDayNameArabic = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[d.getDay()] || '';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-right font-sans" dir="rtl">
        <div className="py-20 text-center text-slate-500 font-bold bg-white rounded-3xl border border-slate-100 shadow-xs">
          جاري تحميل بيانات تقييم الحصة...
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="space-y-6 text-right font-sans" dir="rtl">
        <div className="p-5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl flex items-center justify-between">
          <span>{error}</span>
          <Link
            to="/dashboard/sessions"
            className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            العودة إلى الحصص
          </Link>
        </div>
      </div>
    );
  }

  const totalStudents = records.length;
  const assessedCount = records.filter(r => r.isAssessed).length;
  const pendingCount = totalStudents - assessedCount;

  const displayedRecords = records
    .filter(rec => {
      if (studentSearchQuery && !rec.studentName.toLowerCase().includes(studentSearchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Pending unassessed students appear first
      const aVal = a.isAssessed ? 1 : 0;
      const bVal = b.isAssessed ? 1 : 0;
      if (aVal !== bVal) {
        return aVal - bVal;
      }
      return a.studentName.localeCompare(b.studentName);
    });

  return (
    <div className="space-y-6 text-right font-sans max-w-6xl mx-auto" dir="rtl">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/dashboard/sessions"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all shadow-2xs group"
        >
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>العودة إلى جدول الحصص</span>
        </Link>

        {user?.role !== 'parent' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">حالة الحصة:</span>
            <Select
              value={sessionStatus}
              onValueChange={(val: any) => setSessionStatus(val)}
            >
              <SelectTrigger className="w-36 h-8 text-xs font-bold bg-white text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">مجدولة</SelectItem>
                <SelectItem value="completed">مكتملة (تم الرصد)</SelectItem>
                <SelectItem value="cancelled">ملغاة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Main Session Header Banner */}
      {session && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  session.sessionType === 'exception' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                }`}>
                  {session.sessionType === 'exception' ? 'حصة استثنائية' : 'حصة أساسية'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                  session.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700'
                }`}>
                  {session.status === 'completed' ? 'مكتملة ومقيّمة' : 'مجدولة'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                تقييم حضور وأداء الطلاب • حلقة رقم {session.groupNumber} ({session.level || 'المستوى العام'})
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatArabicDate(session.date)} ({session.date})</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <SessionTimeDisplay entry={session} />
                </span>
                {session.teacherName && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>المعلم: {session.teacherName}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Assessment Counter Badges */}
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">الإجمالي</span>
                <span className="text-sm font-extrabold text-slate-900">{totalStudents}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-700 block font-bold">تم التقييم</span>
                <span className="text-sm font-extrabold text-emerald-800">{assessedCount}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] text-amber-700 block font-bold">في الانتظار</span>
                <span className="text-sm font-extrabold text-amber-800">{pendingCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Students Assessment List / Table Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Input
              type="text"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              placeholder="البحث السريع عن طالب..."
              className="w-full pl-3 pr-9 py-2 bg-slate-50 border-slate-200 text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            يتم عرض الطلاب غير المقيَّمين (في الانتظار) في أعلى القائمة لتسهيل الرصد
          </div>
        </div>

        {displayedRecords.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-medium">
            لا يوجد طلاب مطابقين للبحث
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">صورة واسم الطالب</th>
                    <th className="py-3 px-4 text-center">حالة التقييم</th>
                    <th className="py-3 px-4">حالة الحضور</th>
                    <th className="py-3 px-4">مقدار الحفظ والتسميع والملاحظات</th>
                    <th className="py-3 px-4 text-left">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {displayedRecords.map((rec) => {
                    const isAssessed = !!rec.isAssessed;

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* 1. Student Picture & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(rec.studentName)}`}
                              alt={rec.studentName}
                              className="w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                                {rec.studentName}
                              </span>
                              {rec.studentAge ? (
                                <span className="text-[10px] text-slate-400 block font-medium">
                                  {rec.studentAge} سنة
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        {/* 2. Assessment Status Column with Pending vs Finished Icon */}
                        <td className="py-3 px-4 text-center">
                          {isAssessed ? (
                            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>تم التقييم</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-amber-700 font-bold">
                              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                              <span>في الانتظار</span>
                            </div>
                          )}
                        </td>

                        {/* 3. Attendance Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            rec.attendanceStatus === 'present' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            rec.attendanceStatus === 'absent' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                            rec.attendanceStatus === 'late' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}>
                            {rec.attendanceStatus === 'present' ? 'حاضر' :
                             rec.attendanceStatus === 'absent' ? 'غائب' :
                             rec.attendanceStatus === 'late' ? 'متأخر' : 'بعذر'}
                          </span>
                        </td>

                        {/* 4. Surah/Ayah or Notes */}
                        <td className="py-3 px-4 text-slate-600">
                          {isAssessed && rec.attendanceStatus === 'present' && rec.surahName ? (
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                سورة {rec.surahName} {rec.ayahStart && rec.ayahEnd ? `(${rec.ayahStart} - ${rec.ayahEnd})` : ''}
                              </span>
                              {rec.teacherRemarque && (
                                <p className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                                  "{rec.teacherRemarque}"
                                </p>
                              )}
                            </div>
                          ) : isAssessed && (rec.attendanceStatus === 'absent' || rec.attendanceStatus === 'excused') ? (
                            <span className="text-slate-400 text-[11px]">
                              {rec.absenceReason || rec.teacherRemarque || 'غائب عن الحصة'}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* 5. Actions: Edit Assessment Button & History Button */}
                        <td className="py-3 px-4 text-left">
                          <div className="flex items-center gap-1.5 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenHistoryDialog(rec.studentId, rec.studentName)}
                              className="h-7 text-xs font-bold rounded-lg px-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 gap-1"
                              title="عرض سجل ومحفوظ الطالب"
                            >
                              <History className="w-3.5 h-3.5" />
                              <span className="hidden lg:inline">السجل</span>
                            </Button>

                            {user?.role !== 'parent' && (
                              <Button
                                size="sm"
                                variant={isAssessed ? 'outline' : 'default'}
                                onClick={() => handleOpenProgressDialog(rec)}
                                className={`h-7 text-xs font-bold rounded-lg px-3 ${
                                  !isAssessed
                                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>{isAssessed ? 'تعديل التقييم' : 'تقييم'}</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-2.5">
              {displayedRecords.map((rec) => {
                const isAssessed = !!rec.isAssessed;

                return (
                  <div
                    key={rec.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs"
                  >
                    {/* Card Header: Picture, Name & Assessment Status Icon */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(rec.studentName)}`}
                          alt={rec.studentName}
                          className="w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {rec.studentName}
                          </span>
                          {rec.studentAge ? (
                            <span className="text-[10px] text-slate-400 block">
                              {rec.studentAge} سنة
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Assessment Status Icon */}
                      {isAssessed ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>تم التقييم</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>في الانتظار</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body: Attendance & Memorization progress */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-[10px]">الحضور:</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            rec.attendanceStatus === 'present' ? 'bg-emerald-50 text-emerald-800' :
                            rec.attendanceStatus === 'absent' ? 'bg-rose-50 text-rose-800' :
                            rec.attendanceStatus === 'late' ? 'bg-amber-50 text-amber-800' :
                            'bg-blue-50 text-blue-800'
                          }`}>
                            {rec.attendanceStatus === 'present' ? 'حاضر' :
                             rec.attendanceStatus === 'absent' ? 'غائب' :
                             rec.attendanceStatus === 'late' ? 'متأخر' : 'بعذر'}
                          </span>
                        </div>

                        {isAssessed && rec.attendanceStatus === 'present' && rec.surahName ? (
                          <div className="text-slate-700 font-medium text-[11px]">
                            سورة {rec.surahName} {rec.ayahStart && rec.ayahEnd ? `(${rec.ayahStart} - ${rec.ayahEnd})` : ''}
                          </div>
                        ) : isAssessed && (rec.attendanceStatus === 'absent' || rec.attendanceStatus === 'excused') && (rec.absenceReason || rec.teacherRemarque) ? (
                          <div className="text-slate-500 text-[10px]">
                            العذر: {rec.absenceReason || rec.teacherRemarque}
                          </div>
                        ) : null}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenHistoryDialog(rec.studentId, rec.studentName)}
                          className="h-7 text-xs font-bold rounded-lg px-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        >
                          <History className="w-3.5 h-3.5" />
                        </Button>

                        {user?.role !== 'parent' && (
                          <Button
                            size="sm"
                            variant={isAssessed ? 'outline' : 'default'}
                            onClick={() => handleOpenProgressDialog(rec)}
                            className={`h-7 text-xs font-bold rounded-lg px-2.5 shrink-0 ${
                              !isAssessed
                                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{isAssessed ? 'تعديل' : 'تقييم'}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* General Session Notes */}
        {user?.role !== 'parent' && (
          <div className="pt-4 border-t border-slate-100">
            <FormItem>
              <FormLabel htmlFor="sessionNotes" className="text-xs text-slate-700 font-bold">
                ملاحظات عامة حول أداء الحلقة والحصة:
              </FormLabel>
              <Textarea
                id="sessionNotes"
                rows={3}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="اكتب أي ملاحظات عامة أو توجيهات حول أداء طلاب الحلقة إجمالاً في هذه الحصة..."
                className="bg-slate-50 text-xs"
              />
            </FormItem>
          </div>
        )}

        {/* Page Action Footer */}
        {user?.role !== 'parent' && (
          <div className="pt-4 flex items-center justify-start gap-3">
            <Button
              onClick={handleSaveAllRecords}
              disabled={isSavingRecords}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs gap-2 px-5 py-2.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingRecords ? 'جاري الحفظ...' : 'حفظ وإنهاء رصد الحصة'}</span>
            </Button>
            <Link
              to="/dashboard/sessions"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              إلغاء والعودة
            </Link>
          </div>
        )}
      </div>

      {/* INDIVIDUAL STUDENT ASSESSMENT POPUP DIALOG */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(selectedRecord.studentName)}`}
                  alt={selectedRecord.studentName}
                  className="w-8 h-8 rounded-full border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    تقييم الطالب: {selectedRecord.studentName}
                  </h3>
                  <span className="text-[10px] text-slate-400">حلقة رقم {session?.groupNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-5 space-y-4">
              {/* Quick History Button inside dialog */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600 font-medium">الاطلاع على الحفظ والحضور السابق:</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenHistoryDialog(selectedRecord.studentId, selectedRecord.studentName)}
                  className="h-7 text-xs font-bold rounded-lg border-slate-300 text-slate-700 hover:bg-white gap-1.5"
                >
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>سجل الطالب</span>
                </Button>
              </div>

              {/* Attendance Selector */}
              <div>
                <FormLabel className="block text-xs font-bold text-slate-700 mb-1.5">
                  حالة الحضور:
                </FormLabel>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { value: 'present', label: 'حاضر' },
                    { value: 'absent', label: 'غائب' },
                    { value: 'late', label: 'متأخر' },
                    { value: 'excused', label: 'بعذر' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setProgAttendance(opt.value as any)}
                      className={`py-1.5 text-center text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                        progAttendance === opt.value
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress: Surah and Ayah Selection (Only if present/late) */}
              {(progAttendance === 'present' || progAttendance === 'late') ? (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <FormItem>
                    <FormLabel className="text-xs text-slate-700 font-bold">اسم السورة:</FormLabel>
                    <Select
                      value={progSurah || 'none'}
                      onValueChange={(val) => setProgSurah(val === 'none' ? '' : val)}
                    >
                      <SelectTrigger className="w-full bg-slate-50 text-right text-xs">
                        <SelectValue placeholder="اختر السورة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- غير محدد --</SelectItem>
                        {QURAN_SURAHS.map(s => (
                          <SelectItem key={s.number} value={s.nameArabic}>
                            {s.number}. سورة {s.nameArabic} ({s.totalAyahs} آية)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>

                  <div className="grid grid-cols-2 gap-3">
                    <FormItem>
                      <FormLabel className="text-xs text-slate-700 font-bold">من الآية:</FormLabel>
                      <Input
                        type="number"
                        value={progAyahStart}
                        onChange={(e) => setProgAyahStart(e.target.value)}
                        placeholder="مثال: 1"
                        className="bg-slate-50 text-center font-mono text-xs"
                      />
                    </FormItem>

                    <FormItem>
                      <FormLabel className="text-xs text-slate-700 font-bold">إلى الآية:</FormLabel>
                      <Input
                        type="number"
                        value={progAyahEnd}
                        onChange={(e) => setProgAyahEnd(e.target.value)}
                        placeholder="مثال: 10"
                        className="bg-slate-50 text-center font-mono text-xs"
                      />
                    </FormItem>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100">
                  <FormItem>
                    <FormLabel className="text-xs text-slate-700 font-bold">سبب الغياب / العذر:</FormLabel>
                    <Input
                      type="text"
                      value={progRemarque}
                      onChange={(e) => setProgRemarque(e.target.value)}
                      placeholder="اكتب سبب الغياب إن وجد..."
                      className="bg-slate-50 text-xs"
                    />
                  </FormItem>
                </div>
              )}

              {/* Teacher Remarque / Comment for present */}
              {(progAttendance === 'present' || progAttendance === 'late') && (
                <div className="pt-3 border-t border-slate-100">
                  <FormItem>
                    <FormLabel className="text-xs text-slate-700 font-bold">ملاحظات المعلم والتوجيه:</FormLabel>
                    <Textarea
                      rows={2}
                      value={progRemarque}
                      onChange={(e) => setProgRemarque(e.target.value)}
                      placeholder="ملاحظات حول التجويد، الحفظ، أو التثبيت..."
                      className="bg-slate-50 text-right text-xs"
                    />
                  </FormItem>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-start gap-2">
                <Button
                  onClick={handleSaveStudentProgress}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ التقييم</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-lg text-xs"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT HISTORY & LATEST SESSIONS POPUP DIALOG */}
      {historyStudent && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-right">
            {/* History Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    سجل الطالب: {historyStudent.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">آخر تقدّم وحضور الطالب في الحصص السابقة</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setHistoryStudent(null);
                  setHistoryData(null);
                }}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* History Content */}
            <div className="p-5 space-y-5">
              {isLoadingHistory ? (
                <div className="py-10 text-center text-xs text-slate-400 font-medium">
                  جاري جلب سجل وتقدم الطالب...
                </div>
              ) : historyError ? (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                  {historyError}
                </div>
              ) : historyData ? (
                <>
                  {/* 1. Latest Progress (Only latest verse + surah from latest present session + comment) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <span className="text-xs text-slate-500 font-bold block">
                      آخر تقدّم (آخر حصة حضر فيها الطالب):
                    </span>
                    <div className="text-sm font-black text-slate-900">
                      سورة {historyData.lastProgress.surahName} • الآية {historyData.lastProgress.latestVerse}
                    </div>
                    {historyData.lastProgress.date && (
                      <span className="text-[11px] text-slate-400 block font-medium">
                        تاريخ الحصة: {formatArabicDate(historyData.lastProgress.date)}
                      </span>
                    )}

                    {/* Comment from teacher on that session assessment */}
                    {historyData.lastProgress.teacherRemarque && (
                      <div className="pt-2 border-t border-slate-200/70">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">
                          ملاحظة المعلم على الحفظ في تلك الحصة:
                        </span>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed">
                          "{historyData.lastProgress.teacherRemarque}"
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Latest 5 Sessions Status */}
                  <div className="space-y-2.5">
                    <span className="text-xs text-slate-700 font-bold block">
                      حالة آخر 5 حصص للطالب:
                    </span>

                    {historyData.latestSessions.length === 0 ? (
                      <div className="p-4 text-center bg-slate-50 rounded-xl text-slate-400 text-xs font-medium">
                        لا توجد حصص سابقة مسجلة للطالب
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-right text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                              <th className="py-2.5 px-3">يوم وتاريخ الحصة</th>
                              <th className="py-2.5 px-3 text-left">حالة الحضور</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {historyData.latestSessions.map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2.5 px-3">
                                  <span className="font-bold text-slate-800 block">
                                    {getDayNameArabic(s.date)} ({formatArabicDate(s.date)})
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-left">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                                    s.status === 'present' ? 'bg-emerald-50 text-emerald-800' :
                                    s.status === 'absent' ? 'bg-rose-50 text-rose-800' :
                                    s.status === 'late' ? 'bg-amber-50 text-amber-800' :
                                    'bg-blue-50 text-blue-800'
                                  }`}>
                                    {s.status === 'present' ? 'حاضر' :
                                     s.status === 'absent' ? 'غائب' :
                                     s.status === 'late' ? 'متأخر' : 'بعذر'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : null}

              {/* History Footer */}
              <div className="pt-2 flex justify-start">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setHistoryStudent(null);
                    setHistoryData(null);
                  }}
                  className="rounded-lg text-xs"
                >
                  إغلاق السجل
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
