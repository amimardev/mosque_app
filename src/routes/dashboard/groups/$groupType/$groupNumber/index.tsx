import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowRight, Edit, Clock, Users,
  Plus, Trash2, UserCheck, Calendar, Sun, Moon, Sparkles, MapPin, UserX, CheckCircle2, X
} from 'lucide-react';
import { Group, Student, Teacher, formatSessionTimeArabic } from '../../../../../types';
import { StudentCard } from '../../../../../components/common/StudentCard';
import { TeacherCard } from '../../../../../components/common/TeacherCard';
import { GroupSessionsModal } from '../../../../../components/modals/GroupSessionsModal';
import { Input } from '../../../../../components/ui/input';
import { Textarea } from '../../../../../components/ui/textarea';
import { Button } from '../../../../../components/ui/button';
import { FormItem, FormLabel } from '../../../../../components/ui/form';

export const Route = createFileRoute('/dashboard/groups/$groupType/$groupNumber/')({
  component: ViewGroupByNumberPage,
});

const DAY_TRANSLATIONS: Record<string, string> = {
  'Saturday': 'السبت',
  'Sunday': 'الأحد',
  'Monday': 'الاثنين',
  'Tuesday': 'الثلاثاء',
  'Wednesday': 'الأربعاء',
  'Thursday': 'الخميس',
  'Friday': 'الجمعة',
};

function ViewGroupByNumberPage() {
  const { groupType: groupTypeParam, groupNumber: groupNumberParam } = useParams({ 
    from: '/dashboard/groups/$groupType/$groupNumber/' 
  });
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [groupStudents, setGroupStudents] = useState<Student[]>([]);
  const [groupTeachers, setGroupTeachers] = useState<Teacher[]>([]);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [exceptionDate, setExceptionDate] = useState(new Date().toISOString().split('T')[0]);
  const [exceptionNotes, setExceptionNotes] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGroupData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/groups/by-type-and-number/${encodeURIComponent(groupTypeParam)}/${encodeURIComponent(groupNumberParam)}`
      );
      const g = res.data.group;
      if (!g) {
        setError('الحلقة الدراسية غير موجودة');
        return;
      }

      setGroup(g);
      setGroupStudents(g.students || []);
      setGroupTeachers(g.teachers || []);
    } catch (err: any) {
      console.error('Failed to load group details:', err);
      setError(err.response?.data?.error || err.message || 'فشل في تحميل تفاصيل الحلقة');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroupData();
  }, [groupTypeParam, groupNumberParam]);

  const handleDelete = async () => {
    if (group && window.confirm(`هل أنت متأكد من حذف الحلقة رقم ${group.number}؟`)) {
      await axios.delete(`/api/groups/${group.id}`);
      navigate({ to: `/dashboard/groups/${encodeURIComponent(groupTypeParam)}` as any });
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-400 text-xs font-semibold">جاري تحميل تفاصيل الحلقة الدراسية...</div>;
  }

  if (!group || error) {
    return (
      <div className="py-16 text-center space-y-4 text-right" dir="rtl">
        <p className="text-slate-600 font-bold">الحلقة غير موجودة أو فشل تحميلها.</p>
        <Link
          to={`/dashboard/groups/${encodeURIComponent(groupTypeParam)}` as any}
          className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs inline-block"
        >
          العودة للمسار الدراسي
        </Link>
      </div>
    );
  }

  const currentTypeSlug = encodeURIComponent(group.typeSlug || groupTypeParam);
  const editUrl = `/dashboard/groups/${currentTypeSlug}/${group.number}/edit`;
  const formattedTiming = formatSessionTimeArabic(group.sessionTime, group.studyTime);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 text-right" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Go Back button - on the Right */}
        <div className="flex items-center justify-start">
          <Link
            to={`/dashboard/groups/${currentTypeSlug}` as any}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span>العودة لقائمة حلقات المسار</span>
          </Link>
        </div>

        {/* Actions - on the Left on desktop, directly below on mobile */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          <button
            onClick={() => setIsSessionsModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>عرض حصص وسجل الحلقة</span>
          </button>

          <button
            onClick={() => setIsExceptionModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء حصة استثنائية</span>
          </button>

          <Link
            to={editUrl as any}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>تعديل بيانات الحلقة</span>
          </Link>

          <button
            onClick={handleDelete}
            className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            title="حذف الحلقة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Group Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block">
                مسار: {group.type}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {group.gender === 'male' ? 'حلقة ذكور' : 'حلقة إناث'}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                {group.level === 'Beginner' ? 'مبتدئ' : group.level === 'Advanced' ? 'متقدم' : group.level === 'Ijazah & Sanad' ? 'إجازة وسند' : 'متوسط'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              حلقة رقم {group.number}
            </h1>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shrink-0 text-center sm:text-right">
            <span className="text-[10px] text-emerald-800 font-bold block">إجمالي الطلاب</span>
            <span className="text-xl font-extrabold text-emerald-950 font-mono">{groupStudents.length} طلاب</span>
          </div>
        </div>

        {/* Structured Session Time & Details Showcase Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Timing Badge Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 flex-row-reverse">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              {group.sessionTime?.startType === 'prayer' ? (
                <Sun className="w-5 h-5 text-amber-600" />
              ) : (
                <Clock className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div className="space-y-1 min-w-0 flex-1 text-right">
              <span className="text-[11px] font-bold text-slate-500 block">توقيت وجدول الحصة</span>
              <div className="text-sm font-extrabold text-slate-900 leading-tight">
                {formattedTiming}
              </div>
              {group.sessionTime && (
                <span className="inline-block text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-bold mt-0.5">
                  {group.sessionTime.startType === 'prayer' ? 'توقيت مرتبط بمواقيت الصلاة' : 'توقيت زمني محدد'}
                </span>
              )}
            </div>
          </div>

          {/* Days & Hall Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3 flex-row-reverse">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1 text-right">
              <span className="text-[11px] font-bold text-slate-500 block">أيام الدراسة والقاعة</span>
              <div className="flex flex-wrap gap-1 flex-row-reverse">
                {group.days && group.days.length > 0 ? (
                  group.days.map((d) => (
                    <span key={d} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md text-[11px] font-bold shadow-2xs">
                      {DAY_TRANSLATIONS[d] || d}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">غير محدد</span>
                )}
              </div>
              {group.room && (
                <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold pt-0.5 flex-row-reverse">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{group.room}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Section */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <span>المعلمون والشيوخ المسندون ({groupTeachers.length})</span>
        </h2>

        {groupTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {groupTeachers.map((tch) => (
              <TeacherCard
                key={tch.id}
                teacher={tch}
                onClick={() => navigate({ to: `/dashboard/teachers/${tch.id}` as any })}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 italic text-center shadow-xs">
            لم يتم إسناد معلمين لهذه الحلقة بعد. اضغط على "تعديل بيانات الحلقة" لتعيين شيخ للحلقة.
          </div>
        )}
      </div>

      {/* Students Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>الطلاب المسجلون في الحلقة ({groupStudents.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              قائمة الطلاب الذين يتابعون حفظ القرآن الكريم في حلقة رقم {group.number}.
            </p>
          </div>

          <Link
            to="/dashboard/students/new"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>تسجيل طالب جديد</span>
          </Link>
        </div>

        {groupStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groupStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={() => navigate({ to: `/dashboard/students/${student.id}` as any })}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-6 space-y-2">
            <p className="text-xs text-slate-400">لا يوجد طلاب مسجلون في هذه الحلقة حالياً.</p>
            <Link
              to="/dashboard/students/new"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-block"
            >
              تسجيل طالب جديد
            </Link>
          </div>
        )}
      </div>





      {/* Create Exception Session Modal */}
      {isExceptionModalOpen && group && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  إنشاء حصة استثنائية جديدة
                </h3>
              </div>
              <button
                onClick={() => setIsExceptionModalOpen(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsCreatingSession(true);
              try {
                await axios.post('/api/sessions/exception', {
                  groupId: group.id,
                  date: exceptionDate,
                  notes: exceptionNotes
                });
                setIsExceptionModalOpen(false);
                setExceptionNotes('');
                // Redirect directly to sessions list
                navigate({ to: '/dashboard/sessions' as any });
              } catch (err: any) {
                alert(err.response?.data?.error || err.message || 'فشل في إنشاء الحصة الاستثنائية');
              } finally {
                setIsCreatingSession(false);
              }
            }} className="p-5 space-y-4">
              <FormItem>
                <FormLabel htmlFor="exceptionDate">
                  تاريخ الحصة الاستثنائية:
                </FormLabel>
                <Input
                  id="exceptionDate"
                  type="date"
                  required
                  value={exceptionDate}
                  onChange={(e) => setExceptionDate(e.target.value)}
                  className="bg-slate-50 font-bold font-mono text-center"
                />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="exceptionNotes">
                  عنوان أو ملاحظات حول اللقاء:
                </FormLabel>
                <Textarea
                  id="exceptionNotes"
                  rows={3}
                  value={exceptionNotes}
                  onChange={(e) => setExceptionNotes(e.target.value)}
                  placeholder="مثال: لقاء لتثبيت متشابهات الجزء الأول من سورة البقرة وتكثيف المراجعة..."
                  className="bg-slate-50"
                />
              </FormItem>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-start gap-2">
                <Button
                  type="submit"
                  disabled={isCreatingSession}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {isCreatingSession ? 'جاري الإنشاء والتحضير...' : 'إنشاء وتأكيد الحصة'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsExceptionModalOpen(false)}
                  className="rounded-xl"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Sessions History Modal */}
      {group && (
        <GroupSessionsModal
          isOpen={isSessionsModalOpen}
          onClose={() => setIsSessionsModalOpen(false)}
          groupId={group.id}
          groupNumber={group.number}
        />
      )}
    </div>
  );
}
