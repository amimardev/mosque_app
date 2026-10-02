import React from 'react';
import { Group, Teacher, Student } from '../../types';
import { GroupForm } from '../forms/GroupForm';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: Partial<Group> & { teacherIds?: string[]; studentIds?: string[] }) => Promise<void>;
  group?: Group | null;
  teachers: Teacher[];
  students?: Student[];
}

export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  group,
  teachers,
  students = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 text-right my-auto">
        <GroupForm
          title={group ? `تعديل حلقة رقم ${group.number}` : 'إنشاء حلقة قرآنية جديدة'}
          subtitle="تحديد المسار، الأوقات، القاعة، الشيوخ والطلاب المسندين"
          initialData={group}
          teachers={teachers}
          students={students}
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
