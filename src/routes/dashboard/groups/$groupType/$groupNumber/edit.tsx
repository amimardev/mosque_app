import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GroupForm } from '../../../../../components/forms/GroupForm';
import { Group, Teacher, GroupType } from '../../../../../types';

export const Route = createFileRoute('/dashboard/groups/$groupType/$groupNumber/edit')({
  component: EditGroupUnderTypePage,
});

function EditGroupUnderTypePage() {
  const { groupType: groupTypeParam, groupNumber: groupNumberParam } = useParams({
    from: '/dashboard/groups/$groupType/$groupNumber/edit'
  });
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [groupRes, teachersRes, typesRes] = await Promise.all([
          axios.get(`/api/groups/by-type-and-number/${encodeURIComponent(groupTypeParam)}/${encodeURIComponent(groupNumberParam)}`),
          axios.get('/api/teachers'),
          axios.get('/api/group-types')
        ]);
        setGroup(groupRes.data.group || null);
        setTeachers(teachersRes.data.teachers || []);
        setGroupTypes(typesRes.data.groupTypes || []);
      } catch (err: any) {
        console.error('Failed to load group for edit:', err);
        setError(err.response?.data?.error || err.message || 'فشل في تحميل بيانات الحلقة');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [groupTypeParam, groupNumberParam]);

  const handleSave = async (updatedData: any) => {
    if (!group) return;
    const res = await axios.put(`/api/groups/${group.id}`, updatedData);
    const updatedGroup = res.data.group || group;
    const targetTypeSlug = updatedData.typeId 
      ? (groupTypes.find(t => t.id === updatedData.typeId)?.slug || groupTypeParam)
      : (group.typeSlug || groupTypeParam);
    const targetNumber = updatedData.number !== undefined ? updatedData.number : group.number;
    navigate({
      to: `/dashboard/groups/${encodeURIComponent(targetTypeSlug)}/${encodeURIComponent(targetNumber)}` as any
    });
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-400 text-xs font-semibold">جاري تحميل بيانات الحلقة للتحرير...</div>;
  }

  if (error || !group) {
    return (
      <div className="py-16 text-center space-y-4 text-right" dir="rtl">
        <p className="text-slate-600 font-bold">الحلقة غير موجودة أو تعذر تحميلها.</p>
      </div>
    );
  }

  const currentTypeSlug = encodeURIComponent(group.typeSlug || groupTypeParam);

  return (
    <GroupForm
      initialData={group}
      teachers={teachers}
      groupTypes={groupTypes}
      preselectedTypeId={group.typeId || undefined}
      onSave={handleSave}
      onCancel={() =>
        navigate({
          to: `/dashboard/groups/${currentTypeSlug}/${encodeURIComponent(group.number)}` as any
        })
      }
      title={`تعديل بيانات حلقة رقم ${group.number}`}
      subtitle={`المسار الحالي: ${group.type}`}
    />
  );
}
