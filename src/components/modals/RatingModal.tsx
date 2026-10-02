import React from 'react';
import { Student, Teacher, StudentRating } from '../../types';
import { RatingForm } from '../forms/RatingForm';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ratingData: any) => Promise<void>;
  students: Student[];
  teachers: Teacher[];
  preselectedStudent?: Student | null;
  rating?: StudentRating | null; // edit mode if present
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  students,
  teachers,
  preselectedStudent,
  rating
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 text-right my-auto">
        <RatingForm
          title={rating ? 'تعديل التقييم الشهري' : 'تسجيل تقييم شهري جديد'}
          subtitle="تقييم الحفظ، التجويد، المراجعة، الحضور، والسلوك"
          initialData={rating}
          students={students}
          teachers={teachers}
          preselectedStudentId={preselectedStudent?.id}
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
