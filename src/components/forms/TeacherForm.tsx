import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { UserCheck, Phone, Save, ArrowRight, ShieldAlert } from 'lucide-react';
import { Teacher, Group } from '../../types';
import { AvatarPicker } from '../common/AvatarPicker';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';

interface TeacherFormProps {
  initialData?: Teacher | null;
  groups: Group[];
  onSave: (teacherData: Partial<Teacher> & { groupIds?: string[]; password?: string; isAdmin?: boolean }) => Promise<void>;
  onCancel: () => void;
  title: string;
  subtitle: string;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  initialData,
  groups,
  onSave,
  onCancel,
  title,
  subtitle
}) => {
  const { user } = useAuth();
  const [teacherId] = useState(() => initialData?.id || `tch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      avatar: initialData?.avatar || `/api/storage/teacher-${initialData?.id || teacherId}`,
      specialization: initialData?.specialization || 'حفظ القرآن والتجويد',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      password: '',
      isAdmin: !!initialData?.isAdmin,
      bio: initialData?.bio || '',
      status: (initialData?.status || 'active') as 'active' | 'on_leave',
      groupIds: initialData?.assignedGroups ? initialData.assignedGroups.map(g => g.id) : [] as string[]
    },
    onSubmit: async ({ value }) => {
      if (!value.name.trim()) {
        setError('الاسم الكامل للمعلم مطلوب');
        return;
      }

      setIsSubmitting(true);
      setError('');

      try {
        await onSave({
          id: teacherId,
          name: value.name.trim(),
          avatar: value.avatar.trim() || `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(value.name)}`,
          specialization: value.specialization.trim(),
          phone: value.phone.trim() || undefined,
          email: value.email.trim() || undefined,
          bio: value.bio.trim() || undefined,
          status: value.status,
          groupIds: value.groupIds,
          password: value.password.trim() || undefined,
          isAdmin: value.isAdmin
        });
      } catch (err: any) {
        setError(err.message || 'فشل في حفظ سجل المعلم');
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
        {/* 1. Identity & Avatar */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>1. الملف الشخصي وصورة المعلم</span>
          </h2>

          <form.Field
            name="avatar"
            children={(field) => (
              <AvatarPicker
                id={teacherId}
                type="teacher"
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
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="مثال: الشيخ عبد الرحمن أحمد"
                    className="text-right font-medium"
                    required
                  />
                  {field.state.meta.errors && (
                    <FormMessage>{field.state.meta.errors.join(', ')}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <form.Field
              name="specialization"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>
                    التخصص العلمي والقراءات <span className="text-rose-500">*</span>
                  </FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="مثال: القراءات العشر الصغرى، ورش وعاصم"
                    className="text-right font-medium"
                    required
                  />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 2. Contact & Status */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>2. معلومات الاتصال وحالة التعليم</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <form.Field
              name="phone"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>رقم الجوال</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="مثال: 0555123456"
                    className="font-mono text-left"
                    dir="ltr"
                  />
                </FormItem>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>البريد الإلكتروني</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="teacher@madrasa.org"
                    className="font-mono text-left"
                    dir="ltr"
                  />
                </FormItem>
              )}
            />

            <form.Field
              name="status"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>الحالة والتوفر</FormLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: 'active' | 'on_leave') => field.handleChange(val)}
                  >
                    <SelectTrigger id={field.name} className="text-right">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">معلم منتظم ونشط</SelectItem>
                      <SelectItem value="on_leave">في إجازة مؤقتة</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <form.Field
            name="bio"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>
                  السيرة العلمية، الإجازات، والمتون المحفوظة
                </FormLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="اكتب نبذة عن شيوخ المعلم، الأسانيد التي يحملها، والمتون المجاز فيها (مثل الشاطبية، الجزرية)..."
                  className="text-right leading-relaxed"
                />
              </FormItem>
            )}
          />
        </div>

        {/* 3. Credentials & Admin privileges (Only accessible by Admin role!) */}
        {user?.role === 'admin' && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 flex-row-reverse justify-end">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>3. بيانات الدخول وحساب المشرف</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form.Field
                name="password"
                children={(field) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      تعيين كلمة مرور الحساب (أدخل لتغييرها)
                    </FormLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="مثال: password123 (اتركها فارغة لعدم التعديل)"
                      className="font-mono text-left"
                      dir="ltr"
                    />
                  </FormItem>
                )}
              />

              <form.Field
                name="isAdmin"
                children={(field) => (
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 bg-slate-50 border-slate-300 rounded-lg focus:ring-emerald-500"
                      />
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        منح المعلم صلاحيات مدير المدرسة (Admin)
                      </span>
                    </label>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 flex-row-reverse">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'جاري حفظ البيانات...' : 'حفظ بيانات الشيخ'}</span>
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
