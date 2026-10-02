import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { TeacherForm } from '../../../../components/forms/TeacherForm';
import { Teacher, Group } from '../../../../types';

export const Route = createFileRoute('/dashboard/teachers/$id/edit')({
  component: EditTeacherPage,
});

function EditTeacherPage() {
  const { id } = useParams({ from: '/dashboard/teachers/$id/edit' });
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [teacherRes, groupsRes] = await Promise.all([
          api.get(`/api/teachers/${id}`),
          api.get('/api/groups')
        ]);
        setTeacher(teacherRes.data.teacher || null);
        setGroups(groupsRes.data.groups || []);
      } catch (err) {
        console.error('Failed to load edit teacher data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (teacherData: any) => {
    await api.put(`/api/teachers/${id}`, teacherData);
    navigate({ to: '/dashboard/teachers/$id', params: { id } });
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-400 text-xs font-semibold">جاري تحميل بيانات الشيخ...</div>;
  }

  if (!teacher) {
    return <div className="py-12 text-center text-rose-500 font-bold">المعلم غير موجود.</div>;
  }

  return (
    <TeacherForm
      initialData={teacher}
      groups={groups}
      onSave={handleSave}
      onCancel={() => navigate({ to: '/dashboard/teachers/$id', params: { id } })}
      title={`تعديل بيانات الشيخ: ${teacher.name}`}
      subtitle="تحديث التخصص العلمي، الإجازات، معلومات الاتصال، أو كلمة مرور الدخول."
    />
  );
}
