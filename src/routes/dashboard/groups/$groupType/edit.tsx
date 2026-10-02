import { createFileRoute, useNavigate, useParams, Link } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { ArrowRight, Save, Trash2, Edit3 } from 'lucide-react';
import { GroupType } from '../../../../types';

export const Route = createFileRoute('/dashboard/groups/$groupType/edit')({
  component: EditGroupTypePage,
});

function EditGroupTypePage() {
  const { groupType: groupTypeParam } = useParams({ from: '/dashboard/groups/$groupType/edit' });
  const navigate = useNavigate();
  const [groupType, setGroupType] = useState<GroupType | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadType() {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/group-types/${encodeURIComponent(groupTypeParam)}`);
        const gt = res.data.groupType;
        setGroupType(gt);
        if (gt) {
          setName(gt.name || '');
          setSlug(gt.slug || '');
          setDescription(gt.description || '');
        }
      } catch (err: any) {
        console.error('Failed to load group type for edit:', err);
        setError(err.response?.data?.error || err.message || 'فشل في تحميل بيانات المسار');
      } finally {
        setIsLoading(false);
      }
    }
    loadType();
  }, [groupTypeParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('اسم المسار أو نوع الحلقة مطلوب');
      return;
    }

    if (!groupType) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await api.put(`/api/group-types/${encodeURIComponent(groupType.id)}`, {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
      });

      const updated = res.data.groupType;
      const targetSlug = updated?.slug || groupTypeParam;
      navigate({ to: `/dashboard/groups/${encodeURIComponent(targetSlug)}` as any });
    } catch (err: any) {
      console.error('Failed to update group type:', err);
      setError(err.response?.data?.error || err.message || 'فشل في تحديث بيانات المسار');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!groupType) return;
    if (window.confirm(`هل أنت متأكد من حذف المسار الدراسي "${groupType.name}"؟`)) {
      try {
        await api.delete(`/api/group-types/${encodeURIComponent(groupType.id)}`);
        navigate({ to: '/dashboard/groups' });
      } catch (err: any) {
        alert(err.response?.data?.error || 'فشل في حذف المسار');
      }
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-slate-400 text-xs font-semibold">جاري تحميل بيانات المسار...</div>;
  }

  if (error || !groupType) {
    return (
      <div className="py-16 text-center space-y-4 text-right" dir="rtl">
        <p className="text-slate-600 font-bold">لم يتم العثور على المسار المطلوب.</p>
        <Link
          to="/dashboard/groups"
          className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs inline-block"
        >
          العودة لقائمة المسارات
        </Link>
      </div>
    );
  }

  const currentSlug = encodeURIComponent(groupType.slug || groupTypeParam);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 text-right" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Go Back button - on the Right */}
        <div className="flex items-center justify-start">
          <Link
            to={`/dashboard/groups/${currentSlug}` as any}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span>العودة للمسار</span>
          </Link>
        </div>

        {/* Title Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Edit3 className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              تعديل المسار الدراسي: {groupType.name}
            </h1>
            <p className="text-xs text-slate-500">
              تحديث اسم المسار، وصف المنهج، أو الرابط التعريفي.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            اسم المسار أو نوع الحلقات <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-right"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            المعرف بالرابط (Slug)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-left"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            وصف المسار والأهداف التعليمية
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-right leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-row-reverse">
          <div className="flex items-center gap-3 flex-row-reverse">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
            </button>
            <Link
              to={`/dashboard/groups/${currentSlug}` as any}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              إلغاء
            </Link>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف المسار</span>
          </button>
        </div>
      </form>
    </div>
  );
}
