import React from 'react';
import { Student } from '../../types';
import { StudentForm } from '../forms/StudentForm';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Partial<Student>) => Promise<void>;
  student?: Student | null; // if provided -> edit mode, else add mode
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 text-right my-auto">
        <StudentForm
          title={student ? 'تعديل بيانات الطالب' : 'تسجيل طالب جديد'}
          subtitle="تعديل أو إدخال البيانات الشخصية والقرآنية ومستوى الطالب"
          initialData={student}
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
