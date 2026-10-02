import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, Save, FolderPlus, Layers } from 'lucide-react';

export const Route = createFileRoute('/dashboard/groups/new')({
  component: NewGroupTypePage,
});

function NewGroupTypePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('اسم المسار أو نوع الحلقة مطلوب');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await axios.post('/api/group-types', {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
      });

      const newType = res.data.groupType;
      // Navigate to the newly created group type's groups list
      if (newType?.slug) {
        navigate({ to: `/dashboard/groups/${encodeURIComponent(newType.slug)}` as any });
      } else {
        navigate({ to: '/dashboard/groups' });
      }
    } catch (err: any) {
      console.error('Failed to create group type:', err);
      setError(err.response?.data?.error || err.message || 'فشل في حفظ المسار الدراسي');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 text-right" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Go Back button - on the Right */}
        <div className="flex items-center justify-start">
          <Link
            to="/dashboard/groups"
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span>العودة للمسارات</span>
          </Link>
        </div>

        {/* Title Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              إنشاء مسار دراسي / تصنيف جديد
            </h1>
            <p className="text-xs text-slate-500">
              إضافة تصنيف تنظيمي جديد لتجميع حلقات التحفيظ (مثل: جزء عم، القراءات، ورش)
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
            onChange={(e) => {
              setName(e.target.value);
              // Auto-suggest slug if not explicitly set
              if (!slug) {
                setSlug(
                  e.target.value
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                );
              }
            }}
            placeholder="مثال: حفظ جزء عم، رواية ورش، مسار الإتقان والتثبيت"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-right"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            المعرف بالرابط (Slug - اختياري)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="hifz-juz-amma"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-left"
            dir="ltr"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            يستخدم كعنوان للصفحة في المتصفح مثل: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">/dashboard/groups/{slug || 'name'}</code>
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            وصف المسار والأهداف التعليمية
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: يهدف هذا المسار إلى تدريب الطلاب الصغار على تلاوة وتجويد وحفظ قصار السور من سورة الناس إلى سورة النبأ، مع ضبط مخارج الحروف..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-right leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-start gap-3 flex-row-reverse">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ المسار الجديد'}</span>
          </button>
          <Link
            to="/dashboard/groups"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
