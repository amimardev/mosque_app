import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { StudentForm } from '../../../components/forms/StudentForm';
import { Group } from '../../../types';

export const Route = createFileRoute('/dashboard/students/new')({
  component: NewStudentPage,
});

function NewStudentPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await api.get('/api/groups');
        setGroups(res.data.groups || []);
      } catch (e) {
        console.error('Failed to load groups:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadGroups();
  }, []);

  const handleSave = async (studentData: any) => {
    const res = await api.post('/api/students', studentData);
    navigate({ to: '/dashboard/students' });
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs font-semibold">
        جاري تحميل النموذج...
      </div>
    );
  }

  return (
    <StudentForm
      groups={groups}
      onSave={handleSave}
      onCancel={() => navigate({ to: '/dashboard/students' })}
      title="تسجيل طالب جديد في المدرسة"
      subtitle="أدخل بيانات الطالب الشخصية، وحدد موضع الحفظ القرآني الحالي، وأسنده إلى الحلقة المناسبة."
    />
  );
}
