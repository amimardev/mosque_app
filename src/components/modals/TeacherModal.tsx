import React from 'react';
import { Teacher, Group } from '../../types';
import { TeacherForm } from '../forms/TeacherForm';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherData: Partial<Teacher> & { groupIds?: string[]; password?: string; isAdmin?: boolean }) => Promise<void>;
  teacher?: Teacher | null; // edit mode if present
  groups: Group[];
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacher,
  groups
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 text-right my-auto">
        <TeacherForm
          title={teacher ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
          subtitle="تعديل أو إدخال البيانات الشخصية والمهنية وتعيين الحلقات"
          initialData={teacher}
          groups={groups}
          onSave={async (data) => {
            await onSave(data);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
