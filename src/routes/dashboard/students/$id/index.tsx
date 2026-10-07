import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { 
  ArrowRight, Edit, Award, Clock, Phone, 
  Users, Star, Plus, Trash2, X, Check, Calendar 
} from 'lucide-react';
import { Student, Teacher, StudentRating } from '../../../../types';
import { QURAN_SURAHS } from '../../../../lib/quranData';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { ChangeParentModal } from '../../../../components/modals/ChangeParentModal';
import { calculateAge, formatArabicAge } from '../../../../lib/ageUtils';
import { useAuth } from '../../../../context/AuthContext';
import { ProfileImage } from '../../../../components/common/ProfileImage';

export const Route = createFileRoute('/dashboard/students/$id/')({
  component: StudentDetailsPage,
});

function StudentDetailsPage() {
  const { id } = useParams({ from: '/dashboard/students/$id/' });
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isParent = user?.role === 'parent';
  const [student, setStudent] = useState<Student | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Rating Modal state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isChangeParentModalOpen, setIsChangeParentModalOpen] = useState(false);
  const [viewedSessionRecord, setViewedSessionRecord] = useState<any | null>(null);
  const [editingRating, setEditingRating] = useState<StudentRating | null>(null);
  
  // Rating Form fields
  const [evalMonth, setEvalMonth] = useState('2026-09');
  const [evalTeacherId, setEvalTeacherId] = useState('');
  const [evalHifz, setEvalHifz] = useState(95);
  const [evalTajweed, setEvalTajweed] = useState(90);
  const [evalMurajaah, setEvalMurajaah] = useState(92);
  const [evalAttendance, setEvalAttendance] = useState(95);
  const [evalBehavior, setEvalBehavior] = useState(100);
  const [evalSurah, setEvalSurah] = useState('Al-Baqarah');
  const [evalAyahStart, setEvalAyahStart] = useState<number | string>(1);
  const [evalAyahEnd, setEvalAyahEnd] = useState<number | string>(50);
  const [evalNotes, setEvalNotes] = useState('');
  const [isSavingRating, setIsSavingRating] = useState(false);

  const loadStudent = async () => {
    try {
      setIsLoading(true);
      const [studentRes, teachersRes] = await Promise.all([
        api.get(`/api/students/${id}`),
        api.get('/api/teachers')
      ]);
      const stData = studentRes.data.student || null;
      setStudent(stData);
      setTeachers(teachersRes.data.teachers || []);

      if (stData) {
        setEvalSurah(stData.currentSurahName || 'Al-Baqarah');
        setEvalAyahEnd(stData.currentAyah || 50);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load student details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const handleDeleteStudent = async () => {
    if (student && window.confirm(`Are you sure you want to delete "${student.name}"?`)) {
      await api.delete(`/api/students/${student.id}`);
      navigate({ to: '/dashboard/students' });
    }
  };

  const handleOpenNewRating = () => {
    setEditingRating(null);
    setEvalMonth(new Date().toISOString().substring(0, 7));
    setEvalTeacherId(teachers.length > 0 ? teachers[0].id : '');
    setEvalHifz(95);
    setEvalTajweed(90);
    setEvalMurajaah(92);
    setEvalAttendance(95);
    setEvalBehavior(100);
    if (student) {
      setEvalSurah(student.currentSurahName || 'Al-Baqarah');
      setEvalAyahEnd(student.currentAyah || 50);
    }
    setEvalNotes('');
    setIsRatingModalOpen(true);
  };

  const handleOpenEditRating = (r: StudentRating) => {
    setEditingRating(r);
    setEvalMonth(r.month || '2026-09');
    setEvalTeacherId(r.teacherId || '');
    setEvalHifz(r.hifzScore ?? 90);
    setEvalTajweed(r.tajweedScore ?? 85);
    setEvalMurajaah(r.murajaahScore ?? 88);
    setEvalAttendance(r.attendanceScore ?? 95);
    setEvalBehavior(r.behaviorScore ?? 100);
    setEvalSurah(r.surahEvaluated || 'Al-Baqarah');
    setEvalAyahStart(r.ayahStart ?? 1);
    setEvalAyahEnd(r.ayahEnd ?? 50);
    setEvalNotes(r.notes || '');
    setIsRatingModalOpen(true);
  };

  const handleSaveRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSavingRating(true);
    try {
      const overallScore = Math.round(
        (evalHifz * 0.35) +
        (evalTajweed * 0.25) +
        (evalMurajaah * 0.20) +
        (evalAttendance * 0.10) +
        (evalBehavior * 0.10)
      );

      let grade = 'Mumtaz (Outstanding)';
      if (overallScore < 60) grade = 'Da\'eef (Needs Improvement)';
      else if (overallScore < 70) grade = 'Maqbool (Acceptable)';
      else if (overallScore < 80) grade = 'Jayyid (Good)';
      else if (overallScore < 88) grade = 'Jayyid Jiddan (Very Good)';
      else if (overallScore < 95) grade = 'Mumtaz (Excellent)';

      const payload = {
        studentId: student.id,
        teacherId: evalTeacherId || undefined,
        month: evalMonth,
        hifzScore: evalHifz,
        tajweedScore: evalTajweed,
        murajaahScore: evalMurajaah,
        attendanceScore: evalAttendance,
        behaviorScore: evalBehavior,
        overallScore,
        grade,
        surahEvaluated: evalSurah,
        ayahStart: Number(evalAyahStart) || undefined,
        ayahEnd: Number(evalAyahEnd) || undefined,
        notes: evalNotes.trim() || undefined,
        updateStudentSurah: true
      };

      if (editingRating) {
        await api.put(`/api/ratings/${editingRating.id}`, payload);
      } else {
        await api.post('/api/ratings', payload);
      }

      setIsRatingModalOpen(false);
      await loadStudent();
    } catch (err) {
      console.error('Failed to save rating:', err);
      alert('Failed to save rating evaluation');
    } finally {
      setIsSavingRating(false);
    }
  };

  const handleDeleteRating = async (ratingId: string) => {
    if (window.confirm('Delete this evaluation entry?')) {
      await api.delete(`/api/ratings/${ratingId}`);
      await loadStudent();
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-400 text-xs font-semibold">جاري تحميل ملف الطالب...</div>;
  }

  if (!student || error) {
    return (
      <div className="py-16 text-center space-y-4 text-right" dir="rtl">
        <p className="text-slate-500 font-bold">لم يتم العثور على ملف الطالب أو حدث خطأ أثناء التحميل.</p>
        <Link
          to="/dashboard/students"
          className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs inline-block"
        >
          العودة لدليل الطلاب
        </Link>
      </div>
    );
  }

  const juzProgress = Math.min(100, Math.round(((student.memorizedJuzCount || 0) / (student.targetJuz || 30)) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-right" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Go Back button - on the Right */}
        <div className="flex items-center justify-start">
          <Link
            to="/dashboard/students"
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span>العودة لقائمة الطلاب</span>
          </Link>
        </div>

        {/* Actions - on the Left on desktop, directly below on mobile */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          {!isParent && (
            <button
              onClick={handleOpenNewRating}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>+ إضافة تقييم شهري</span>
            </button>
          )}

          {isAdmin && (
            <>
              <Link
                to="/dashboard/students/$id/edit"
                params={{ id: student.id }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>تعديل الملف</span>
              </Link>

              <button
                onClick={handleDeleteStudent}
                className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                title="حذف الطالب"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Profile Picture */}
          <div className="w-36 sm:w-48 h-48 sm:h-64 rounded-2xl overflow-hidden ring-4 ring-emerald-600/20 shrink-0 bg-slate-100 shadow-md">
            <ProfileImage
              src={student.avatar}
              alt={student.name}
              className="w-full h-full object-top"
            />
          </div>

          {/* Student Details - Clean Unboxed Layout */}
          <div className="flex-1 w-full text-right space-y-4">
            {/* Header: Name and education level badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                  المستوى: {student.level === 'primary' ? 'ابتدائي' : student.level === 'secondary' ? 'ثانوي' : 'متوسط'}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
                  الجنس: {student.gender === 'male' ? 'طالب (ذكر)' : 'طالبة (أنثى)'}
                </span>
                {student.group && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    مسار {student.group.type}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {student.name}
              </h1>
            </div>

            {/* Information Rows (Clean & Unboxed) */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm">
              {/* Age */}
              <div className="flex items-center gap-2 py-1">
                <span className="text-slate-400 font-bold min-w-28 shrink-0">العمر:</span>
                <span className="font-bold text-slate-800">
                  {formatArabicAge(student.dateOfBirth || student.age)}
                </span>
              </div>

              {/* Group */}
              <div className="flex items-center gap-2 py-1">
                <span className="text-slate-400 font-bold min-w-28 shrink-0">الحلقة الدراسية:</span>
                <span className="font-bold text-emerald-700">
                  {student.group ? `حلقة رقم ${student.group.number || 1} (${student.group.type})` : 'لم يتم التعيين لحلقة'}
                </span>
              </div>

              {/* Parent Name */}
              <div className="flex items-center gap-2 py-1">
                <span className="text-slate-400 font-bold min-w-28 shrink-0">ولي الأمر:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">
                    {student.parentName || 'غير متوفر'}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => setIsChangeParentModalOpen(true)}
                      className="px-2 py-0.5 text-[10px] bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      تغيير ولي الأمر
                    </button>
                  )}
                </div>
              </div>

              {/* Parent Phone */}
              <div className="flex items-center gap-2 py-1">
                <span className="text-slate-400 font-bold min-w-28 shrink-0">هاتف ولي الأمر:</span>
                {student.parentPhone ? (
                  <a
                    href={`tel:${student.parentPhone}`}
                    className="font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1.5"
                    dir="ltr"
                  >
                    <span>{student.parentPhone}</span>
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                ) : (
                  <span className="font-bold text-slate-400">غير متوفر</span>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Quran Progress & Milestone */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <img src="/icon.png" alt="" className="w-4 h-4 object-contain" />
          <span>مرحلة الحفظ الحالية والهدف المنشود</span>
        </h2>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-800">السورة الحالية</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              سورة {student.currentSurahName || 'الفاتحة'}
            </h3>
            {student.surahDetails && (
              <span className="text-xs text-slate-500 block">
                سورة رقم {student.surahDetails.number} • {student.surahDetails.type === 'Meccan' ? 'مكية' : 'مدنية'}
              </span>
            )}
          </div>

          <div className="text-left sm:border-r sm:border-emerald-200 sm:pr-6" dir="ltr">
            <span className="text-xs text-emerald-800 font-bold block uppercase">موضع الحفظ الحالي</span>
            <span className="text-2xl font-mono font-extrabold text-emerald-950">
              الآية {student.currentAyah || 1}
            </span>
          </div>
        </div>

        {/* Juz Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">
              إجمالي المحفوظ: <strong className="text-emerald-700 font-extrabold">{student.memorizedJuzCount || 0} أجزاء</strong>
            </span>
            <span className="font-bold text-slate-500">
              الهدف: {student.targetJuz || 30} جزء ({juzProgress}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(juzProgress, 5)}%` }}
            />
          </div>
        </div>
      </div>

      {/* MONTHLY EVALUATIONS / RATINGS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>التقييمات والدرجات الشهرية ({student.ratings?.length || 0})</span>
            </h2>
            <p className="text-xs text-slate-500">
              الدرجات الأكاديمية الشهرية، أحكام التجويد، اختبارات المراجعة، وملاحظات المشايخ.
            </p>
          </div>

          {!isParent && (
            <button
              onClick={handleOpenNewRating}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تقييم</span>
            </button>
          )}
        </div>

        {/* Ratings List */}
        {student.ratings && student.ratings.length > 0 ? (
          <div className="space-y-4">
            {student.ratings.map((rating) => (
              <div
                key={rating.id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-extrabold font-mono text-base flex items-center justify-center shrink-0 shadow-2xs" dir="ltr">
                      {rating.overallScore}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">
                          {rating.grade}
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          {rating.month}
                        </span>
                      </div>
                      {rating.surahEvaluated && (
                        <span className="text-xs text-emerald-800 font-bold block mt-0.5">
                          السورة المختبرة: سورة {rating.surahEvaluated} {rating.ayahStart && `(من الآية ${rating.ayahStart} إلى ${rating.ayahEnd || 'نهاية السورة'})`}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isParent && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditRating(rating)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteRating(rating.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف التقييم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Score Breakdown Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">1. الحفظ (35%)</span>
                    <span className="font-mono font-bold text-emerald-800" dir="ltr">{rating.hifzScore}/100</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">2. التجويد (25%)</span>
                    <span className="font-mono font-bold text-emerald-800" dir="ltr">{rating.tajweedScore}/100</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">3. المراجعة (20%)</span>
                    <span className="font-mono font-bold text-emerald-800" dir="ltr">{rating.murajaahScore}/100</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">4. الحضور والسلوك (20%)</span>
                    <span className="font-mono font-bold text-emerald-800" dir="ltr">{rating.attendanceScore}/100</span>
                  </div>
                </div>

                {/* Teacher Comments */}
                {rating.notes && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                    "{rating.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-2">
            <p className="text-xs text-slate-500 font-medium">لا توجد تقييمات شهرية مسجلة بعد للطالب {student.name}.</p>
            <button
              onClick={handleOpenNewRating}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs inline-block transition-colors cursor-pointer"
            >
              إضافة أول تقييم شهري
            </button>
          </div>
        )}
      </div>

      {/* DAILY SESSIONS & INDIVIDUAL PERFORMANCE TRACKING */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>سجل الأداء اليومي في الحصص واللقاءات اليومية ({student.sessions?.length || 0})</span>
          </h2>
          <p className="text-xs text-slate-500">
            متابعة دقيقة لمقدار الحفظ والتسميع اليومي والمراجعة، مع رصد الغياب وحضور الحصص وملاحظات المشايخ الفردية.
          </p>
        </div>

        {student.sessions && student.sessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {student.sessions.map((ses: any) => {
              const isException = ses.sessionType === 'exception';
              return (
                <div
                  key={ses.id}
                  onClick={() => setViewedSessionRecord(ses)}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 cursor-pointer hover:bg-slate-100/70 transition-all text-right group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">{ses.date}</span>
                      <span className="block text-xs font-bold text-slate-900 mt-0.5">
                        حصة {ses.sessionType === 'exception' ? 'استثنائية' : 'أساسية'}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      ses.attendanceStatus === 'present' ? 'bg-emerald-100 text-emerald-800' :
                      ses.attendanceStatus === 'absent' ? 'bg-rose-100 text-rose-800' :
                      ses.attendanceStatus === 'late' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {ses.attendanceStatus === 'present' ? 'حاضر' :
                       ses.attendanceStatus === 'absent' ? 'غائب' :
                       ses.attendanceStatus === 'late' ? 'متأخر' : 'بعذر'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">الآيات والسورة المقروءة:</span>
                    {ses.attendanceStatus === 'present' && ses.surahName ? (
                      <span className="font-extrabold text-emerald-800 block">
                        سورة {ses.surahName} (الآية {ses.ayahStart} - {ses.ayahEnd})
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium block">
                        {ses.attendanceStatus === 'present' ? 'لم يرصد تسميع' : 'لم يحضر اللقاء'}
                      </span>
                    )}

                    {ses.teacherRemarque && (
                      <div className="pt-2 border-t border-slate-100 mt-2 text-[10px] text-slate-600 font-medium italic truncate">
                        "{ses.teacherRemarque}"
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 font-medium flex justify-between items-center">
                    <span>المعلم: {ses.teacherName || 'غير محدد'}</span>
                    <span className="text-emerald-700 font-bold group-hover:underline text-[9px]">انقر لعرض الملاحظات الكاملة ←</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-xs text-slate-500 font-bold">لا توجد سجلات حصص يومية مسجلة بعد لهذا الطالب.</span>
          </div>
        )}
      </div>

      {/* NESTED DIALOG: VIEW DETAILED SESSION RECORD */}
      {viewedSessionRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md overflow-hidden text-right shadow-2xl animate-in fade-in duration-200">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">تفاصيل الحصة والأداء اليومي</h3>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{viewedSessionRecord.date}</span>
              </div>
              <button
                onClick={() => setViewedSessionRecord(null)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">نوع الحصة:</span>
                  <span className="font-extrabold text-slate-800">
                    {viewedSessionRecord.sessionType === 'exception' ? 'استثنائية' : 'أساسية'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">حالة الحضور:</span>
                  <span className={`font-extrabold ${
                    viewedSessionRecord.attendanceStatus === 'present' ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {viewedSessionRecord.attendanceStatus === 'present' ? 'حاضر ومستمع' : 'غائب'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">المعلم المسمّع:</span>
                <span className="font-bold text-slate-800">{viewedSessionRecord.teacherName || 'غير محدد'}</span>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl">
                <span className="text-[10px] text-emerald-800 font-bold block uppercase mb-1">مقدار الحفظ المقروء والتسميع:</span>
                {viewedSessionRecord.attendanceStatus === 'present' && viewedSessionRecord.surahName ? (
                  <h4 className="text-base font-extrabold text-emerald-950">
                    سورة {viewedSessionRecord.surahName} (الآية {viewedSessionRecord.ayahStart} - {viewedSessionRecord.ayahEnd})
                  </h4>
                ) : (
                  <span className="text-slate-500 font-bold block">لا يوجد تسميع مسجل في هذه الحصة اليوم.</span>
                )}
              </div>

              {viewedSessionRecord.teacherRemarque && (
                <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl italic text-teal-950">
                  <span className="text-[10px] text-teal-800 font-bold block uppercase not-italic mb-1">ملاحظة وتوجيه الشيخ للمعلم وولي الأمر:</span>
                  "{viewedSessionRecord.teacherRemarque}"
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-start">
                <button
                  onClick={() => setViewedSessionRecord(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  إغلاق نافذة التفاصيل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RATING MODAL (Inside Student View) */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full h-[85vh] max-h-[640px] flex flex-col shadow-2xl relative text-right overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>{editingRating ? 'تعديل التقييم الشهري' : `تقييم جديد للطالب ${student.name}`}</span>
                </h3>
                <p className="text-xs text-slate-500">تسجيل تفاصيل الدرجات والملاحظات التوجيهية</p>
              </div>

              <button
                onClick={() => setIsRatingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <form onSubmit={handleSaveRating} className="flex flex-col flex-1 overflow-hidden">
              <ScrollArea className="flex-1 w-full p-4 sm:p-6">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        شهر التقييم
                      </label>
                      <input
                        type="month"
                        required
                        value={evalMonth}
                        onChange={(e) => setEvalMonth(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الشيخ / المعلم المقيم
                      </label>
                      <select
                        value={evalTeacherId}
                        onChange={(e) => setEvalTeacherId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-right"
                      >
                        <option value="">-- اختر المعلم --</option>
                        {teachers.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex justify-between font-bold flex-row-reverse">
                        <span className="font-mono text-emerald-700" dir="ltr">{evalHifz}/100</span>
                        <span>1. الحفظ الجديد (35%)</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        value={evalHifz}
                        onChange={(e) => setEvalHifz(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex justify-between font-bold flex-row-reverse">
                        <span className="font-mono text-emerald-700" dir="ltr">{evalTajweed}/100</span>
                        <span>2. أحكام التجويد (25%)</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        value={evalTajweed}
                        onChange={(e) => setEvalTajweed(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex justify-between font-bold flex-row-reverse">
                        <span className="font-mono text-emerald-700" dir="ltr">{evalMurajaah}/100</span>
                        <span>3. المراجعة والتثبيت (20%)</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        value={evalMurajaah}
                        onChange={(e) => setEvalMurajaah(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex justify-between font-bold flex-row-reverse">
                        <span className="font-mono text-emerald-700" dir="ltr">{evalAttendance}/100</span>
                        <span>4. الحضور والسلوك (20%)</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="100"
                        value={evalAttendance}
                        onChange={(e) => setEvalAttendance(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Tested Surah */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        السورة التي تم تقييمها
                      </label>
                      <select
                        value={evalSurah}
                        onChange={(e) => setEvalSurah(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-right"
                      >
                        {QURAN_SURAHS.map((s) => (
                          <option key={s.number} value={s.nameEnglish}>
                            {s.number}. سورة {s.nameArabic} ({s.nameEnglish}) - {s.totalAyahs} آية
                          </option>
                        ))}
                      </select>
                    </div>

                    {(() => {
                      const evalSurahObj = QURAN_SURAHS.find(s => s.nameEnglish === evalSurah) || QURAN_SURAHS[0];
                      const maxAyahs = evalSurahObj?.totalAyahs || 286;
                      return (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              من الآية
                            </label>
                            <input
                              type="number"
                              min="1"
                              max={maxAyahs}
                              value={evalAyahStart}
                              onChange={(e) => setEvalAyahStart(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-center"
                            />
                            <span className="text-[10px] text-slate-400 block mt-0.5 text-right">
                              الحد الأقصى: {maxAyahs} آية
                            </span>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              إلى الآية
                            </label>
                            <input
                              type="number"
                              min="1"
                              max={maxAyahs}
                              value={evalAyahEnd}
                              onChange={(e) => setEvalAyahEnd(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-center"
                            />
                            <span className="text-[10px] text-slate-400 block mt-0.5 text-right">
                              الحد الأقصى: {maxAyahs} آية
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ملاحظات وتوجيهات المعلم
                    </label>
                    <textarea
                      rows={2}
                      value={evalNotes}
                      onChange={(e) => setEvalNotes(e.target.value)}
                      placeholder="ملاحظات حول التلاوة، مخارج الحروف، التجويد، والواجب البيتي..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-right"
                    />
                  </div>
                </div>
              </ScrollArea>

              {/* Fixed Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-start gap-2 shrink-0 bg-slate-50/50">
                <button
                  type="submit"
                  disabled={isSavingRating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {isSavingRating ? 'جاري الحفظ...' : 'حفظ التقييم'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Change Parent Modal */}
      {student && (
        <ChangeParentModal
          isOpen={isChangeParentModalOpen}
          onClose={() => setIsChangeParentModalOpen(false)}
          student={student}
          onSuccess={loadStudent}
        />
      )}
    </div>
  );
}
