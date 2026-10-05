import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { StudentForm } from '../../../../components/forms/StudentForm';
import { Student } from '../../../../types';

export const Route = createFileRoute('/dashboard/students/$id/edit')({
  component: EditStudentPage,
});

function EditStudentPage() {
  const { id } = useParams({ from: '/dashboard/students/$id/edit' });
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const studentRes = await api.get(`/api/students/${id}`);
        setStudent(studentRes.data.student || null);
      } catch (err) {
        console.error('Failed to load edit student data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (studentData: Partial<Student>) => {
    await api.put(`/api/students/${id}`, studentData);
    navigate({ to: '/dashboard/students/$id', params: { id } });
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-400 text-xs font-semibold">جاري تحميل بيانات الطالب...</div>;
  }

  if (!student) {
    return <div className="py-12 text-center text-rose-500 font-bold">لم يتم العثور على سجل الطالب.</div>;
  }

  return (
    <StudentForm
      initialData={student}
      onSave={handleSave}
      onCancel={() => navigate({ to: '/dashboard/students/$id', params: { id } })}
      title={`تعديل ملف الطالب: ${student.name}`}
      subtitle="تحديث البيانات الشخصية للطالب أو مستوى الحفظ القرآني الحالي. تتم إدارة الحلقة من صفحة الحلقة."
    />
  );
}
