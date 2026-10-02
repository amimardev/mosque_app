import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { RatingForm } from '../../../components/forms/RatingForm';
import { Student, Teacher } from '../../../types';

const ratingSearchSchema = z.object({
  studentId: z.string().optional(),
});

type RatingSearch = z.infer<typeof ratingSearchSchema>;

export const Route = createFileRoute('/dashboard/ratings/new')({
  validateSearch: (search: Record<string, unknown>): RatingSearch => {
    return {
      studentId: typeof search.studentId === 'string' ? search.studentId : undefined,
    };
  },
  component: NewRatingPage,
});

function NewRatingPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/dashboard/ratings/new' });
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [studentsRes, teachersRes] = await Promise.all([
          axios.get('/api/students'),
          axios.get('/api/teachers')
        ]);
        setStudents(studentsRes.data.students || []);
        setTeachers(teachersRes.data.teachers || []);
      } catch (e) {
        console.error('Failed to load rating form data:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (ratingData: any) => {
    await axios.post('/api/ratings', ratingData);
    navigate({ to: '/dashboard/ratings' });
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-400 text-xs font-semibold">جاري تحميل النموذج...</div>;
  }

  return (
    <RatingForm
      students={students}
      teachers={teachers}
      preselectedStudentId={search.studentId}
      onSave={handleSave}
      onCancel={() => navigate({ to: '/dashboard/ratings' })}
      title="إجراء تقييم شهري جديد"
      subtitle="تقييم حفظ الطالب الجديد، أحكام التجويد ومخارج الحروف، المراجعة، والانضباط الشهري."
    />
  );
}
