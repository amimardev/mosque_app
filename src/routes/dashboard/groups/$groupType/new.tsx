import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { GroupForm } from '../../../../components/forms/GroupForm';
import { Teacher, GroupType } from '../../../../types';

export const Route = createFileRoute('/dashboard/groups/$groupType/new')({
  component: NewGroupUnderTypePage,
});

function NewGroupUnderTypePage() {
  const { groupType: groupTypeParam } = useParams({ from: '/dashboard/groups/$groupType/new' });
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [currentGroupType, setCurrentGroupType] = useState<GroupType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [teachersRes, typesRes] = await Promise.all([
          api.get('/api/teachers'),
          api.get('/api/group-types')
        ]);
        const allTeachers = teachersRes.data.teachers || [];
        const allTypes = typesRes.data.groupTypes || [];
        setTeachers(allTeachers);
        setGroupTypes(allTypes);

        const match = allTypes.find((t: GroupType) => 
          t.slug === groupTypeParam || t.id === groupTypeParam || t.name === groupTypeParam
        );
        setCurrentGroupType(match || null);
      } catch (e) {
        console.error('Failed to load data for new group:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [groupTypeParam]);

  const handleSave = async (groupData: any) => {
    await api.post('/api/groups', groupData);
    navigate({ to: `/dashboard/groups/${encodeURIComponent(groupTypeParam)}` as any });
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-400 text-xs font-semibold">جاري تحميل النموذج...</div>;
  }

  const currentSlug = encodeURIComponent(currentGroupType?.slug || groupTypeParam);

  return (
    <GroupForm
      teachers={teachers}
      groupTypes={groupTypes}
      preselectedTypeId={currentGroupType?.id || groupTypeParam}
      onSave={handleSave}
      onCancel={() => navigate({ to: `/dashboard/groups/${currentSlug}` as any })}
      title={`إنشاء حلقة جديدة في مسار: ${currentGroupType?.name || groupTypeParam}`}
      subtitle="تحديد رقم الحلقة، جدول التوقيت الدراسي، قاعة التدريس، وتعيين المشايخ والطلاب."
    />
  );
}
