import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TeacherForm } from '../../../components/forms/TeacherForm';
import { Group } from '../../../types';

export const Route = createFileRoute('/dashboard/teachers/new')({
  component: NewTeacherPage,
});

function NewTeacherPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGroups() {
      try {
        const res = await axios.get('/api/groups');
        setGroups(res.data.groups || []);
      } catch (e) {
        console.error('Failed to load groups:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadGroups();
  }, []);

  const handleSave = async (teacherData: any) => {
    await axios.post('/api/teachers', teacherData);
    navigate({ to: '/dashboard/teachers' });
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-400 text-xs">جاري تحميل النموذج...</div>;
  }

  return (
    <TeacherForm
      groups={groups}
      onSave={handleSave}
      onCancel={() => navigate({ to: '/dashboard/teachers' })}
      title="تسجيل معلم / شيخ جديد"
      subtitle="إدخال معلومات الاتصال للشيخ، تخصص القراءات والإجازات، وحساب الدخول الخاص به."
    />
  );
}
