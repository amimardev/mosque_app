import React, { useState } from 'react';
import api from '@/lib/apiClient';
import { useForm } from '@tanstack/react-form';
import { X, Save, User, Phone, Mail, MapPin, FileText, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { Parent } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentToEdit?: Parent | null;
  onSuccess: () => Promise<void>;
}

export const ParentModal: React.FC<ParentModalProps> = ({
  isOpen,
  onClose,
  parentToEdit,
  onSuccess
}) => {
  if (!isOpen) return null;

  const { user } = useAuth();
  const isEditing = Boolean(parentToEdit?.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const form = useForm({
    defaultValues: {
      name: parentToEdit?.name || '',
      phone: parentToEdit?.phone || '',
      email: parentToEdit?.email || '',
      password: '',
      address: parentToEdit?.address || '',
      notes: parentToEdit?.notes || ''
    },
    onSubmit: async ({ value }) => {
      if (!value.name.trim()) {
        setError('يرجى إدخال اسم ولي الأمر');
        return;
      }
      if (!value.phone.trim()) {
        setError('يرجى إدخال رقم هاتف ولي الأمر');
        return;
      }

      setIsSubmitting(true);
      setError('');
      setSuccessMsg('');

      try {
        const payload = {
          name: value.name.trim(),
          phone: value.phone.trim(),
          email: value.email.trim() || null,
          password: value.password.trim() || undefined,
          address: value.address.trim() || null,
          notes: value.notes.trim() || null
        };

        if (isEditing && parentToEdit) {
          await api.put(`/api/parents/${parentToEdit.id}`, payload);
          setSuccessMsg('تم تعديل بيانات ولي الأمر بنجاح');
        } else {
          await api.post('/api/parents', payload);
          setSuccessMsg('تمت إضافة ولي الأمر بنجاح');
        }

        await onSuccess();
        setTimeout(() => {
          onClose();
        }, 700);
      } catch (err: any) {
        console.error('Failed to save parent:', err);
        setError(err.response?.data?.error || err.message || 'فشل في حفظ بيانات ولي الأمر');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                {isEditing ? 'تعديل بيانات ولي الأمر' : 'إضافة ولي أمر جديد'}
              </h2>
              <p className="text-xs text-slate-500">
                تسجيل بيانات التواصل الخاصة بأولياء أمور طلاب المدرسة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="p-5 sm:p-6 space-y-4"
        >
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Name */}
          <form.Field
            name="name"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>اسم ولي الأمر الكامل: <span className="text-rose-500">*</span></span>
                </FormLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="مثال: د. عبد الرحمن بن محمد"
                  className="bg-slate-50 font-semibold"
                />
              </FormItem>
            )}
          />

          {/* Phone */}
          <form.Field
            name="phone"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>رقم الهاتف للجوال / واتساب: <span className="text-rose-500">*</span></span>
                </FormLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="مثال: +213 550 12 34 56"
                  className="bg-slate-50 font-semibold font-mono"
                  dir="ltr"
                />
              </FormItem>
            )}
          />

          {/* Email */}
          <form.Field
            name="email"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>البريد الإلكتروني (اختياري):</span>
                </FormLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="parent@example.com"
                  className="bg-slate-50 font-semibold"
                />
              </FormItem>
            )}
          />

          {/* Address */}
          <form.Field
            name="address"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>العنوان السكني (اختياري):</span>
                </FormLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="المدينة، الحي أو الشارع..."
                  className="bg-slate-50 font-semibold"
                />
              </FormItem>
            )}
          />

          {/* Notes */}
          <form.Field
            name="notes"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>ملاحظات إضافية:</span>
                </FormLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={2}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="أي ملاحظات حول التواصل أو متابعة أوقات الحضور..."
                  className="bg-slate-50 text-xs"
                />
              </FormItem>
            )}
          />

          {/* Password Updates (Admin only!) */}
          {user?.role === 'admin' && (
            <form.Field
              name="password"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                    <span>تعيين كلمة مرور لولوج ولي الأمر (أدخل لتغييرها):</span>
                  </FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="مثال: password123 (اتركها فارغة لعدم التعديل)"
                    className="bg-slate-50 font-mono text-left"
                  />
                </FormItem>
              )}
            />
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-start gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الحفظ...' : isEditing ? 'حفظ التعديلات' : 'إضافة ولي الأمر'}</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="rounded-xl"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
