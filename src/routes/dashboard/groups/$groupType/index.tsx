import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { 
  Users, Clock, Plus, Edit, Trash2, 
  ChevronRight, UserCheck, ArrowRight,
  LayoutGrid, BookOpen, Sun, Calendar, MapPin
} from 'lucide-react';
import { Group, GroupType, formatSessionTimeArabic } from '../../../../types';
import { BulkTimingModal } from '../../../../components/modals/BulkTimingModal';

const DAY_TRANSLATIONS: Record<string, string> = {
  'Saturday': 'السبت',
  'Sunday': 'الأحد',
  'Monday': 'الاثنين',
  'Tuesday': 'الثلاثاء',
  'Wednesday': 'الأربعاء',
  'Thursday': 'الخميس',
  'Friday': 'الجمعة',
};

export const Route = createFileRoute('/dashboard/groups/$groupType/')({
  component: GroupTypeGroupsPage,
});

function GroupTypeGroupsPage() {
  const { groupType: groupTypeParam } = useParams({ from: '/dashboard/groups/$groupType/' });
  const navigate = useNavigate();
  const [groupTypeData, setGroupTypeData] = useState<GroupType | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBulkTimingOpen, setIsBulkTimingOpen] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/group-types/${encodeURIComponent(groupTypeParam)}`);
      const gt = res.data.groupType;
      setGroupTypeData(gt);
      setGroups(gt?.groups || []);
    } catch (err: any) {
      console.error('Failed to load group type groups:', err);
      setError(err.response?.data?.error || err.message || 'فشل في تحميل حلقات هذا المسار');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [groupTypeParam]);

  const handleDeleteGroup = async (group: Group, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف الحلقة رقم ${group.number}؟`)) {
      setDeletingId(group.id);
      try {
        await api.delete(`/api/groups/${group.id}`);
        await loadData();
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-400 text-xs font-semibold">جاري تحميل حلقات المسار...</div>;
  }

  if (error || !groupTypeData) {
    return (
      <div className="py-16 text-center space-y-4 text-right" dir="rtl">
        <p className="text-slate-600 font-bold">لم يتم العثور على المسار الدراسي المطلوب.</p>
        <Link
          to="/dashboard/groups"
          className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs inline-block"
        >
          العودة لقائمة المسارات
        </Link>
      </div>
    );
  }

  const currentSlug = encodeURIComponent(groupTypeData.slug || groupTypeParam);

  return (
    <div className="space-y-6 pb-16 text-right" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Go Back button - on the Right */}
        <div className="flex items-center justify-start">
          <Link
            to="/dashboard/groups"
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span>العودة للمسارات والتصنيفات</span>
          </Link>
        </div>

        {/* Actions - on the Left on desktop, directly below on mobile */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          {/* Bulk Timing Button */}
          {groups.length > 0 && (
            <button
              onClick={() => setIsBulkTimingOpen(true)}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>تعديل المواعيد بالجملة</span>
            </button>
          )}

          {/* Create Group Button */}
          <Link
            to={`/dashboard/groups/${currentSlug}/new` as any}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة حلقة جديدة</span>
          </Link>

          {/* Edit Type Button */}
          <Link
            to={`/dashboard/groups/${currentSlug}/edit` as any}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>تعديل المسار</span>
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block">
              مسار دراسي نشط
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {groupTypeData.name}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {groupTypeData.description || 'الحلقات الدراسية المسجلة تحت هذا المسار، مواعيد الحصص، والمشايخ والطلاب المنتسبين.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center min-w-[90px]">
              <span className="text-[10px] text-emerald-800 font-bold block">إجمالي الحلقات</span>
              <span className="text-xl font-extrabold text-emerald-950 font-mono">{groups.length}</span>
            </div>
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center min-w-[90px]">
              <span className="text-[10px] text-emerald-800 font-bold block">إجمالي الطلاب</span>
              <span className="text-xl font-extrabold text-emerald-950 font-mono">{groupTypeData.totalStudents || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-emerald-600" />
          <span>حلقات هذا المسار ({groups.length})</span>
        </h2>

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((group) => {
              const teacherNames = group.teachers && group.teachers.length > 0
                ? group.teachers.map(t => t.name).join('، ')
                : 'لم يعين محفظ بعد';

              const groupViewUrl = `/dashboard/groups/${currentSlug}/${group.number}`;
              const groupEditUrl = `/dashboard/groups/${currentSlug}/${group.number}/edit`;

              return (
                <div
                  key={group.id}
                  onClick={() => navigate({ to: groupViewUrl as any })}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative text-right"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 flex-row-reverse">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
                        {group.level === 'primary' ? 'ابتدائي' : group.level === 'secondary' ? 'ثانوي' : 'متوسط'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {group.gender === 'male' ? 'طلاب ذكور' : 'طالبات إناث'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                      حلقة رقم {group.number}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-700 pt-1 border-t border-slate-100 flex-row-reverse">
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-900 truncate text-right">
                        المعلم: <span className="font-medium text-slate-700">{teacherNames}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-700 flex-row-reverse">
                      {group.sessionTime?.startType === 'prayer' ? (
                        <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-800 truncate text-right">
                        {formatSessionTimeArabic(group.sessionTime, group.studyTime)}
                      </span>
                    </div>

                    {group.days && group.days.length > 0 && (
                      <div className="flex flex-wrap gap-1 flex-row-reverse">
                        {group.days.map(d => (
                          <span key={d} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            {DAY_TRANSLATIONS[d] || d}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 flex-row-reverse">
                      <span className="font-semibold text-slate-600 flex items-center gap-1.5 flex-row-reverse">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>الطلاب المسجلين:</span>
                      </span>
                      <span className="font-mono font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                        {group.studentsCount || 0} طلاب
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-row-reverse">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5 group-hover:-translate-x-0.5 transition-transform flex-row-reverse">
                      <span>عرض تفاصيل الحلقة</span>
                      <ChevronRight className="w-3.5 h-3.5 transform rotate-180" />
                    </span>

                    <div className="flex items-center gap-1 flex-row-reverse">
                      <Link
                        to={groupEditUrl as any}
                        onClick={(e) => e.stopPropagation()}
                        title="تعديل الحلقة"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={(e) => handleDeleteGroup(group, e)}
                        disabled={deletingId === group.id}
                        title="حذف الحلقة"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-3">
            <p className="text-sm font-bold text-slate-700">لا توجد أي حلقات مسجلة تحت مسار "{groupTypeData.name}" بعد.</p>
            <p className="text-xs text-slate-500">
              أضف أول حلقة في هذا المسار لتحديد موعد الدرس، القاعة، وتعيين المحفظ والطلاب.
            </p>
            <Link
              to={`/dashboard/groups/${currentSlug}/new` as any}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أول حلقة دراسية</span>
            </Link>
          </div>
        )}
      </div>

      {/* Bulk Timing Modal */}
      <BulkTimingModal
        isOpen={isBulkTimingOpen}
        onClose={() => setIsBulkTimingOpen(false)}
        groups={groups}
        groupTypeName={groupTypeData?.name}
        onSuccess={loadData}
      />
    </div>
  );
}
