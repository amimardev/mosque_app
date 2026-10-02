import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StudentForm } from '../../../../components/forms/StudentForm';
import { Student, Group } from '../../../../types';

export const Route = createFileRoute('/dashboard/students/$id/edit')({
  component: EditStudentPage,
});

function EditStudentPage() {
  const { id } = useParams({ from: '/dashboard/students/$id/edit' });
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [studentRes, groupsRes] = await Promise.all([
          axios.get(`/api/students/${id}`),
          axios.get('/api/groups')
        ]);
        setStudent(studentRes.data.student || null);
        setGroups(groupsRes.data.groups || []);
      } catch (err) {
        console.error('Failed to load edit student data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (studentData: Partial<Student>) => {
    await axios.put(`/api/students/${id}`, studentData);
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
      groups={groups}
      onSave={handleSave}
      onCancel={() => navigate({ to: '/dashboard/students/$id', params: { id } })}
      title={`تعديل ملف الطالب: ${student.name}`}
      subtitle="تحديث البيانات الشخصية للطالب، الحلقة الدراسية، أو مستوى الحفظ القرآني الحالي."
    />
  );
}
