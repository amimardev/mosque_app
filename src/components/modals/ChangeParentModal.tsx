import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@tanstack/react-form';
import { X, Save, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { Parent, Student } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';

interface ChangeParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onSuccess: () => Promise<void>;
}

export const ChangeParentModal: React.FC<ChangeParentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadParents() {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/parents');
        setParents(res.data.parents || []);
      } catch (err) {
        console.error('Failed to load parents list:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadParents();
  }, [isOpen]);

  const form = useForm({
    defaultValues: {
      parentId: student.parentId || 'none'
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setError('');
      setSuccessMsg('');

      try {
        await axios.put(`/api/students/${student.id}`, {
          parentId: value.parentId === 'none' ? null : (value.parentId || null)
        });

        setSuccessMsg('تم تحديث ارتباط ولي الأمر للطالب بنجاح');
        await onSuccess();
        setTimeout(() => {
          onClose();
        }, 700);
      } catch (err: any) {
        console.error('Failed to update student parent:', err);
        setError(err.response?.data?.error || err.message || 'فشل في ربط ولي الأمر بالطالب');
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
                اختيار وتحديد ولي الأمر للطالب
              </h2>
              <p className="text-xs text-slate-500">
                الطالب: <span className="font-bold text-teal-800">{student.name}</span>
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

          {/* Select Parent Dropdown */}
          <form.Field
            name="parentId"
            children={(field) => {
              const selectedParent = parents.find(p => p.id === field.state.value);

              return (
                <div className="space-y-3">
                  <FormItem>
                    <FormLabel htmlFor={field.name}>اختر ولي الأمر من القائمة المسجلة:</FormLabel>
                    {isLoading ? (
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400">
                        جاري تحميل قائمة أولياء الأمور...
                      </div>
                    ) : (
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger id={field.name} className="w-full bg-slate-50 text-right">
                          <SelectValue placeholder="-- بدون ولي أمر محدد (إلغاء الارتباط) --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- بدون ولي أمر محدد (إلغاء الارتباط) --</SelectItem>
                          {parents.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({p.phone}) {p.studentsCount ? `- الأبناء: ${p.studentsCount}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormItem>

                  {/* Selected Parent Details Preview */}
                  {selectedParent && (
                    <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-2">
                      <span className="text-[11px] font-bold text-teal-800 block">
                        بيانات ولي الأمر المحدد:
                      </span>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-extrabold text-slate-900">{selectedParent.name}</span>
                        <span className="font-mono text-teal-800 font-bold flex items-center gap-1" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-teal-600" />
                          {selectedParent.phone}
                        </span>
                      </div>
                      {selectedParent.email && (
                        <div className="text-[11px] text-slate-500">
                          البريد الإلكتروني: <span className="font-medium text-slate-700">{selectedParent.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }}
          />

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-start gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الربط...' : 'تأكيد اختيار ولي الأمر'}</span>
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
