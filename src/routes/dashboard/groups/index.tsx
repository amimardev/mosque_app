import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { 
  Users, Clock, Plus, ChevronRight, FolderOpen,
  LayoutGrid, Layers
} from 'lucide-react';
import { GroupType } from '../../../types';

export const Route = createFileRoute('/dashboard/groups/')({
  component: GroupTypesCatalogPage,
});

function GroupTypesCatalogPage() {
  const navigate = useNavigate();
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/group-types');
      setGroupTypes(res.data.groupTypes || []);
    } catch (err) {
      console.error('Failed to load group types:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  if (isLoading) {
    return <div className="py-16 text-center text-slate-400 text-xs font-semibold">جاري تحميل مسارات وتصنيفات الحلقات...</div>;
  }

  return (
    <div className="space-y-6 pb-16 text-right" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-emerald-600" />
            <span>مسارات وتصنيفات الحلقات القرآنية ({groupTypes.length})</span>
          </h1>
          <p className="text-xs text-slate-500">
            تصنيفات ومناهج الحلقات في المدرسة. اختر مساراً لعرض الحلقات المسجلة تحته أو أضف مساراً جديداً.
          </p>
        </div>

        {/* Create Type Button - specifically requested by user */}
        <Link
          to="/dashboard/groups/new"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء مسار دراسي جديد</span>
        </Link>
      </div>

      {/* Grid of Group Types */}
      {groupTypes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groupTypes.map((gt) => {
            const targetUrl = `/dashboard/groups/${encodeURIComponent(gt.slug || gt.id)}`;
            return (
              <div
                key={gt.id}
                onClick={() => navigate({ to: targetUrl as any })}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                      {gt.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {gt.description || 'مسار قرآني تعليمي موحد الأهداف والمنهج لجميع الحلقات التابعة.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-row-reverse">
                  <div className="flex items-center gap-1.5 flex-row-reverse font-semibold text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>الحلقات التابعة:</span>
                    <strong className="text-emerald-950 font-mono">{gt.groupsCount || 0} حلقة</strong>
                  </div>

                  <div className="flex items-center gap-1.5 flex-row-reverse font-semibold text-slate-700">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>إجمالي الطلاب:</span>
                    <strong className="text-emerald-950 font-mono">{gt.totalStudents || 0} طلاب</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end text-xs font-bold text-emerald-700 group-hover:-translate-x-1 transition-transform gap-0.5 flex-row-reverse">
                  <span>عرض حلقات المسار</span>
                  <ChevronRight className="w-3.5 h-3.5 transform rotate-180" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">لا توجد مسارات أو تصنيفات دراسية مضافة حتى الآن.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ابدأ بإنشاء أول مسار دراسي (مثل: حفظ جزء عم، رواية ورش، الحفظ المكثف) لتنظيم الحلقات تحته.
          </p>
          <Link
            to="/dashboard/groups/new"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء أول مسار دراسي</span>
          </Link>
        </div>
      )}
    </div>
  );
}
