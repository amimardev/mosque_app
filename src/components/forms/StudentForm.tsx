import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { useForm } from '@tanstack/react-form';
import { User, Phone, BookOpen, Users, Save, ArrowRight, UserCheck } from 'lucide-react';
import { Student, Group, Parent } from '../../types';
import { AvatarPicker } from '../common/AvatarPicker';
import { SurahAyahPicker } from '../common/SurahAyahPicker';
import { DatePicker } from '../ui/date-picker';
import { calculateAge } from '../../lib/ageUtils';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';

interface StudentFormProps {
  initialData?: Student | null;
  groups: Group[];
  onSave: (studentData: Partial<Student>) => Promise<void>;
  onCancel: () => void;
  title: string;
  subtitle: string;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  groups,
  onSave,
  onCancel,
  title,
  subtitle
}) => {
  const [studentId] = useState(() => initialData?.id || `std_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);
  const [parents, setParents] = useState<Parent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadParents() {
      try {
        const res = await api.get('/api/parents');
        setParents(res.data.parents || []);
      } catch (err) {
        console.error('Failed to load parents:', err);
      }
    }
    loadParents();
  }, []);

  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      avatar: initialData?.avatar || `https://api.dicebear.com/7.x/micah/svg?seed=${initialData?.id || studentId}`,
      gender: (initialData?.gender || 'male') as 'male' | 'female',
      dateOfBirth: initialData?.dateOfBirth || (typeof initialData?.age === 'string' && initialData.age.includes('-') ? initialData.age : ''),
      parentId: initialData?.parentId || '',
      email: initialData?.email || '',
      groupIds: initialData?.groupId ? initialData.groupId.split(',').map(id => id.trim()).filter(Boolean) : [] as string[],
      currentSurahNumber: initialData?.currentSurahNumber || 1,
      currentSurahName: initialData?.currentSurahName || 'Al-Fatihah',
      currentAyah: initialData?.currentAyah || 1,
      targetJuz: initialData?.targetJuz ?? 30,
      memorizedJuzCount: initialData?.memorizedJuzCount ?? 1,
      status: (initialData?.status || 'active') as 'active' | 'graduated' | 'paused',
      notes: initialData?.notes || ''
    },
    onSubmit: async ({ value }) => {
      if (!value.name.trim()) {
        setError('الاسم الكامل للطالب مطلوب');
        return;
      }

      setIsSubmitting(true);
      setError('');

      try {
        await onSave({
          id: studentId,
          name: value.name.trim(),
          avatar: value.avatar.trim() || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(value.name)}`,
          gender: value.gender,
          dateOfBirth: value.dateOfBirth || undefined,
          age: value.dateOfBirth || undefined,
          parentId: value.parentId || undefined,
          email: value.email.trim() || undefined,
          groupId: value.groupIds.join(',') || undefined,
          currentSurahNumber: Number(value.currentSurahNumber),
          currentSurahName: value.currentSurahName,
          currentAyah: Number(value.currentAyah),
          targetJuz: Number(value.targetJuz) || 30,
          memorizedJuzCount: Number(value.memorizedJuzCount) || 0,
          status: value.status,
          notes: value.notes.trim() || undefined
        });
      } catch (err: any) {
        setError(err.message || 'Failed to save student record');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onCancel}
            className="rounded-xl shadow-2xs"
            title="رجوع"
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
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium text-right" dir="rtl">
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
        className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8 text-right"
        dir="rtl"
      >
        {/* 1. Profile Picture & Core Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end">
            <User className="w-4 h-4 text-emerald-600" />
            <span>1. هوية الطالب وبياناته الشخصية</span>
          </h2>

          <form.Field
            name="avatar"
            children={(field) => (
              <AvatarPicker
                id={studentId}
                type="student"
                value={field.state.value}
                onChange={(url) => field.handleChange(url)}
              />
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <form.Field
              name="name"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>
                    الاسم الكامل للطالب <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="مثال: زيد بن حارثة"
                    className="text-right font-medium"
                    required
                  />
                  {field.state.meta.errors && (
                    <FormMessage>{field.state.meta.errors.join(', ')}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <form.Field
                name="gender"
                children={(field) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>جنس الطالب / الطالبة</FormLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val: 'male' | 'female') => {
                        field.handleChange(val);
                        // Filter groupIds to match gender
                        const currentGroups = form.getFieldValue('groupIds');
                        const validGroupIds = currentGroups.filter(gid => {
                          const grp = groups.find(g => g.id === gid);
                          return grp && grp.gender === val;
                        });
                        form.setFieldValue('groupIds', validGroupIds);
                      }}
                    >
                      <SelectTrigger id={field.name} className="text-right">
                        <SelectValue placeholder="اختر الجنس" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">طالب (ذكر)</SelectItem>
                        <SelectItem value="female">طالبة (أنثى)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <form.Field
                name="dateOfBirth"
                children={(field) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1">
                      <FormLabel htmlFor={field.name} className="mb-0">
                        تاريخ الميلاد
                      </FormLabel>
                      {field.state.value && calculateAge(field.state.value) !== null && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          العمر: {calculateAge(field.state.value)} سنة
                        </span>
                      )}
                    </div>
                    <DatePicker
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                      placeholder="اختر تاريخ ميلاد الطالب"
                    />
                  </FormItem>
                )}
              />
            </div>

            <form.Field
              name="status"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>حالة القبول والانتظام</FormLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: 'active' | 'graduated' | 'paused') => field.handleChange(val)}
                  >
                    <SelectTrigger id={field.name} className="text-right">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">طالب نشط ومنتظم</SelectItem>
                      <SelectItem value="graduated">متخرج</SelectItem>
                      <SelectItem value="paused">موقوف مؤقتاً</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>البريد الإلكتروني للطالب (اختياري)</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="student@example.com"
                    className="text-right font-mono"
                    dir="ltr"
                  />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 2. Quran Surah & Ayah Progress */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>2. مرحلة الحفظ الحالية (السورة والآية)</span>
          </h2>

          <form.Subscribe
            selector={(state) => [state.values.currentSurahNumber, state.values.currentAyah]}
            children={([surahNum, ayahNum]) => (
              <SurahAyahPicker
                surahNumber={Number(surahNum) || 1}
                currentSurahNumber={Number(surahNum) || 1}
                ayah={Number(ayahNum) || 1}
                currentAyah={Number(ayahNum) || 1}
                onSurahChange={(num, name) => {
                  form.setFieldValue('currentSurahNumber', num);
                  form.setFieldValue('currentSurahName', name);
                }}
                onAyahChange={(ayah) => form.setFieldValue('currentAyah', ayah)}
              />
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <form.Field
              name="memorizedJuzCount"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>عدد الأجزاء المحفوظة</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    max={30}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="text-center font-bold"
                  />
                </FormItem>
              )}
            />

            <form.Field
              name="targetJuz"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>الهدف المنشود (الأجزاء المستهدفة)</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={1}
                    max={30}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="text-center font-bold"
                  />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 3. Parent / Guardian Contact Details via Foreign Key */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>3. معلومات ولي الأمر والاتصال (ربط المفتاح الخارجي)</span>
          </h2>

          <form.Field
            name="parentId"
            children={(field) => {
              const currentParentId = field.state.value;
              const selectedParent = parents.find(p => p.id === currentParentId);

              return (
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      ولي أمر الطالب (اختيار من قائمة أولياء الأمور المسجلين):
                    </FormLabel>
                    <Select
                      value={currentParentId || 'none'}
                      onValueChange={(val) => field.handleChange(val === 'none' ? '' : val)}
                    >
                      <SelectTrigger id={field.name} className="w-full bg-white text-right">
                        <SelectValue placeholder="-- بدون ولي أمر محدد (يمكن التعيين لاحقاً) --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- بدون ولي أمر محدد (يمكن التعيين لاحقاً) --</SelectItem>
                        {parents.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.phone}) {p.studentsCount ? `- الأبناء: ${p.studentsCount}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>

                  {/* Read-only Parent Info Preview from Foreign Key Link */}
                  {selectedParent && (
                    <div className="p-3.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {selectedParent.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono mt-0.5" dir="ltr">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{selectedParent.phone}</span>
                            {selectedParent.email && (
                              <span className="text-slate-400 font-sans">• {selectedParent.email}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shrink-0">
                        مرتبط بالمفتاح الخارجي
                      </span>
                    </div>
                  )}
                </div>
              );
            }}
          />

          <form.Field
            name="notes"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>
                  ملاحظات وتوجيهات للمعلم (اختياري)
                </FormLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="أي ملاحظات خاصة بالتجويد، مخارج الحروف، جدول المراجعة..."
                  className="text-right"
                />
              </FormItem>
            )}
          />
        </div>

        {/* 4. Group Assignment */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>4. الحلقات القرآنية المسندة للطالب</span>
          </h2>

          <form.Subscribe
            selector={(state) => [state.values.gender, state.values.groupIds]}
            children={([studentGender, groupIds]) => {
              const currentGender = studentGender as 'male' | 'female';
              const selectedIds = (groupIds as string[]) || [];

              return (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {groups
                      .filter(g => g.gender === currentGender)
                      .map((grp) => {
                        const isSelected = selectedIds.includes(grp.id);
                        return (
                          <div
                            key={grp.id}
                            onClick={() => {
                              if (isSelected) {
                                form.setFieldValue('groupIds', selectedIds.filter(id => id !== grp.id));
                              } else {
                                form.setFieldValue('groupIds', [...selectedIds, grp.id]);
                              }
                            }}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-right ${
                              isSelected
                                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-2xs'
                                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/60'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                                حلقة رقم {grp.number} ({grp.type})
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {grp.studyTime}
                              </div>
                            </div>
                            <span className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && '✓'}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }}
          />
        </div>

        {/* Form Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-start gap-3 flex-row-reverse">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ بيانات الطالب'}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer"
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
};
