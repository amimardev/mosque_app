import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { 
  ArrowRight, Edit, Phone, Mail, Clock, 
  Award, Users, Trash2, CheckCircle2 
} from 'lucide-react';
import { Teacher } from '../../../../types';
import { ProfileImage } from '../../../../components/common/ProfileImage';

export const Route = createFileRoute('/dashboard/teachers/$id/')({
  component: TeacherDetailsPage,
});

function TeacherDetailsPage() {
  const { id } = useParams({ from: '/dashboard/teachers/$id/' });
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTeacher() {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/teachers/${id}`);
        setTeacher(res.data.teacher || null);
      } catch (err: any) {
        setError(err.message || 'Failed to load teacher');
      } finally {
        setIsLoading(false);
      }
    }
    loadTeacher();
  }, [id]);

  const handleDelete = async () => {
    if (teacher && window.confirm(`هل أنت متأكد من حذف حساب المعلم "${teacher.name}"؟`)) {
      await api.delete(`/api/teachers/${teacher.id}`);
      navigate({ to: '/dashboard/teachers' });
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-400 text-xs font-semibold">جاري تحميل ملف المعلم...</div>;
  }

  if (!teacher || error) {
    return (
      <div className="py-16 text-center space-y-4 text-right" dir="rtl">
        <p className="text-slate-500 font-bold">لم يتم العثور على المعلم المطلوب.</p>
        <Link
          to="/dashboard/teachers"
          className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs inline-block"
        >
          الرجوع لدليل الشيوخ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-right" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Go Back button - on the Right */}
        <div className="flex items-center justify-start">
          <Link
            to="/dashboard/teachers"
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span>الرجوع لدليل الشيوخ</span>
          </Link>
        </div>

        {/* Actions - on the Left on desktop, directly below on mobile */}
        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          <Link
            to="/dashboard/teachers/$id/edit"
            params={{ id: teacher.id }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>تعديل بيانات المعلم</span>
          </Link>

          <button
            onClick={handleDelete}
            className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            title="حذف حساب المعلم"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white text-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Profile Picture */}
          <div className="w-36 sm:w-48 h-48 sm:h-64 rounded-2xl overflow-hidden ring-4 ring-emerald-600/20 shrink-0 bg-slate-100 shadow-md">
            <ProfileImage
              src={teacher.avatar}
              alt={teacher.name}
              className="w-full h-full object-top"
            />
          </div>

          {/* Teacher Details - Clean Unboxed Layout */}
          <div className="flex-1 w-full text-right space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                  {teacher.status === 'active' ? 'شيخ معتمد ومقرئ' : 'في إجازة'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {teacher.name}
              </h1>

            </div>

            {/* Clean Information Rows */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm">
              {/* Phone */}
              <div className="flex items-center gap-2 py-1">
                <span className="text-slate-400 font-bold min-w-28 shrink-0">رقم الجوال:</span>
                {teacher.phone ? (
                  <a
                    href={`tel:${teacher.phone}`}
                    className="font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1.5"
                    dir="ltr"
                  >
                    <span>{teacher.phone}</span>
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                ) : (
                  <span className="font-bold text-slate-400">غير متوفر</span>
                )}
              </div>

              {/* Bio if exists */}
              {teacher.bio && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-50 space-y-1">
                  <span className="text-slate-400 font-bold block text-xs">السيرة العلمية والإجازات:</span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {teacher.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Halaqat & Study Circles */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>الحلقات الدراسية المسندة لتدريسها ({teacher.assignedGroups?.length || 0})</span>
        </h2>

        {teacher.assignedGroups && teacher.assignedGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teacher.assignedGroups.map((group) => {
              const typeSlug = encodeURIComponent((group as any).typeSlug || 'general');
              return (
                <Link
                  key={group.id}
                  to={`/dashboard/groups/$groupType/$groupNumber` as any}
                  params={{ groupType: typeSlug, groupNumber: String(group.number) } as any}
                  className="p-4 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-2xl transition-colors block group"
                >
                  <div className="flex items-start justify-between flex-row-reverse">
                    <div className="text-right">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">
                        حلقة رقم {group.number} ({group.type})
                      </h3>
                      <span className="text-xs text-emerald-800 font-semibold block mt-1">
                        {group.studyTime}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {(group as any).level === 'primary' ? 'ابتدائي' : (group as any).level === 'secondary' ? 'ثانوي' : 'متوسط'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-4">لا توجد حلقات مسندة لهذا الشيخ حالياً.</p>
        )}
      </div>
    </div>
  );
}
