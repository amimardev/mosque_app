import React, { useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import { Award, User, Save, ArrowRight } from 'lucide-react';
import { Student, Teacher, StudentRating } from '../../types';
import { QURAN_SURAHS } from '../../lib/quranData';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';

interface RatingFormProps {
  initialData?: StudentRating | null;
  students: Student[];
  teachers: Teacher[];
  preselectedStudentId?: string;
  onSave: (ratingData: any) => Promise<void>;
  onCancel: () => void;
  title: string;
  subtitle: string;
}

export const RatingForm: React.FC<RatingFormProps> = ({
  initialData,
  students,
  teachers,
  preselectedStudentId,
  onSave,
  onCancel,
  title,
  subtitle
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const defaultStudentId = initialData?.studentId || preselectedStudentId || (students[0]?.id || '');
  const defaultTeacherId = initialData?.teacherId || (teachers[0]?.id || '');
  const matchedStudent = students.find(s => s.id === defaultStudentId);

  const form = useForm({
    defaultValues: {
      studentId: defaultStudentId,
      teacherId: defaultTeacherId,
      month: initialData?.month || '2026-09',
      hifzScore: initialData?.hifzScore ?? 95,
      tajweedScore: initialData?.tajweedScore ?? 90,
      murajaahScore: initialData?.murajaahScore ?? 92,
      attendanceScore: initialData?.attendanceScore ?? 95,
      behaviorScore: initialData?.behaviorScore ?? 100,
      surahEvaluated: initialData?.surahEvaluated || matchedStudent?.currentSurahName || 'Al-Baqarah',
      ayahStart: initialData?.ayahStart ?? 1,
      ayahEnd: initialData?.ayahEnd ?? 20,
      notes: initialData?.notes || '',
      updateStudentSurah: !initialData
    },
    onSubmit: async ({ value }) => {
      if (!value.studentId) {
        setError('يرجى اختيار الطالب المراد تقييمه');
        return;
      }

      setIsSubmitting(true);
      setError('');

      const overall = Math.round(
        (value.hifzScore * 0.35) +
        (value.tajweedScore * 0.25) +
        (value.murajaahScore * 0.20) +
        (value.attendanceScore * 0.10) +
        (value.behaviorScore * 0.10)
      );

      let calcGrade = 'مقبول (Acceptable)';
      if (overall >= 95) calcGrade = 'ممتاز مرتفع (Mumtaz)';
      else if (overall >= 88) calcGrade = 'ممتاز (Excellent)';
      else if (overall >= 80) calcGrade = 'جيد جداً (Very Good)';
      else if (overall >= 70) calcGrade = 'جيد (Good)';
      else if (overall < 60) calcGrade = 'ضعيف يحتاج متابعة (Needs Improvement)';

      try {
        await onSave({
          studentId: value.studentId,
          teacherId: value.teacherId || undefined,
          month: value.month,
          hifzScore: Number(value.hifzScore),
          tajweedScore: Number(value.tajweedScore),
          murajaahScore: Number(value.murajaahScore),
          attendanceScore: Number(value.attendanceScore),
          behaviorScore: Number(value.behaviorScore),
          overallScore: overall,
          grade: calcGrade,
          surahEvaluated: value.surahEvaluated,
          ayahStart: Number(value.ayahStart) || undefined,
          ayahEnd: Number(value.ayahEnd) || undefined,
          notes: value.notes.trim() || undefined,
          updateStudentSurah: value.updateStudentSurah
        });
      } catch (err: any) {
        setError(err.message || 'فشل في حفظ التقييم الشهري');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right pb-16" dir="rtl">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onCancel}
            className="rounded-xl shadow-2xs"
            title="الرجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => form.handleSubmit()}
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ التقييم'}</span>
        </Button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Main Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8"
      >
        {/* Real-time Dynamic Grade Summary */}
        <form.Subscribe
          selector={(state) => [
            state.values.hifzScore,
            state.values.tajweedScore,
            state.values.murajaahScore,
            state.values.attendanceScore,
            state.values.behaviorScore
          ]}
          children={([h, t, m, a, b]) => {
            const overall = Math.round(
              (Number(h) * 0.35) +
              (Number(t) * 0.25) +
              (Number(m) * 0.20) +
              (Number(a) * 0.10) +
              (Number(b) * 0.10)
            );

            let gradeStr = 'مقبول (Acceptable)';
            if (overall >= 95) gradeStr = 'ممتاز مرتفع (Mumtaz)';
            else if (overall >= 88) gradeStr = 'ممتاز (Excellent)';
            else if (overall >= 80) gradeStr = 'جيد جداً (Very Good)';
            else if (overall >= 70) gradeStr = 'جيد (Good)';
            else if (overall < 60) gradeStr = 'ضعيف يحتاج متابعة (Needs Improvement)';

            return (
              <div className="p-5 bg-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-800">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider block">
                    التقدير والدرجة الإجمالية المحسوبة
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold">{gradeStr}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    الوزن النسبي: الحفظ الجديد (35%) + التجويد ومخارج الحروف (25%) + المراجعة والتثبيت (20%) + الحضور والانضباط (10%) + السلوك والآداب (10%)
                  </p>
                </div>

                <div className="text-left sm:border-r sm:border-emerald-800 sm:pr-6" dir="ltr">
                  <span className="text-xs text-slate-300 uppercase block font-semibold">المعدل العام</span>
                  <span className="text-4xl font-extrabold font-mono text-emerald-400">
                    {overall}%
                  </span>
                </div>
              </div>
            );
          }}
        />

        {/* 1. Student, Evaluator & Month */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>1. تعيين الطالب والمعلم وشهر التقييم</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <form.Field
              name="studentId"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>اختيار الطالب <span className="text-rose-500">*</span></FormLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val);
                      const s = students.find(item => item.id === val);
                      if (s) {
                        form.setFieldValue('surahEvaluated', s.currentSurahName || 'Al-Baqarah');
                        form.setFieldValue('ayahEnd', s.currentAyah || 20);
                      }
                    }}
                  >
                    <SelectTrigger id={field.name} className="w-full bg-white text-right">
                      <SelectValue placeholder="-- اختر الطالب --" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({s.group ? `حلقة رقم ${s.group.number}` : 'بدون حلقة'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <form.Field
              name="teacherId"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>الشيخ / المعلم المقيم</FormLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} className="w-full bg-white text-right">
                      <SelectValue placeholder="-- اختر المعلم --" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} ({t.specialization})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <form.Field
              name="month"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>شهر التقييم</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="month"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="text-center font-mono font-bold"
                  />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 2. Rating Sliders */}
        <div className="space-y-5 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>2. درجات معايير التقييم (من 0 إلى 100)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field
              name="hifzScore"
              children={(field) => (
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">1. الحفظ الجديد والاستيعاب (35%)</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono" dir="ltr">{field.state.value}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              )}
            />

            <form.Field
              name="tajweedScore"
              children={(field) => (
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">2. أحكام التجويد ومخارج الحروف (25%)</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono" dir="ltr">{field.state.value}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              )}
            />

            <form.Field
              name="murajaahScore"
              children={(field) => (
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">3. المراجعة والتثبيت الماضي (20%)</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono" dir="ltr">{field.state.value}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              )}
            />

            <form.Field
              name="attendanceScore"
              children={(field) => (
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">4. الحضور والانضباط والآداب (20%)</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono" dir="ltr">{field.state.value}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              )}
            />
          </div>
        </div>

        {/* 3. Surah & Ayahs Tested */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>3. السورة ومقدار الآيات التي تم اختبار الطالب فيها</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <form.Field
              name="surahEvaluated"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>السورة القرآنية المختبر فيها</FormLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} className="w-full bg-white text-right">
                      <SelectValue placeholder="اختر السورة..." />
                    </SelectTrigger>
                    <SelectContent>
                      {QURAN_SURAHS.map((s) => (
                        <SelectItem key={s.number} value={s.nameArabic}>
                          {s.number}. سورة {s.nameArabic} ({s.totalAyahs} آية)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <form.Field
              name="ayahStart"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>من الآية رقم</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="text-center font-bold"
                  />
                </FormItem>
              )}
            />

            <form.Field
              name="ayahEnd"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>إلى الآية رقم</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="text-center font-bold"
                  />
                </FormItem>
              )}
            />
          </div>

          <form.Field
            name="notes"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>ملاحظات وتوجيهات الأداء (اختياري)</FormLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="ملاحظات حول التجويد ومخارج الحروف، التوجيهات لأولياء الأمور..."
                  className="text-right"
                />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="rounded-xl"
          >
            إلغاء
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ التقييم'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
