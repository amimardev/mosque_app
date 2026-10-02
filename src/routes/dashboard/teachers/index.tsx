import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useForm, useStore } from '@tanstack/react-form';
import { 
  Search, Plus, UserCheck
} from 'lucide-react';
import { Teacher, Group } from '../../../types';
import { TeacherCard } from '../../../components/common/TeacherCard';

export const Route = createFileRoute('/dashboard/teachers/')({
  component: TeachersDirectoryPage,
});

function TeachersDirectoryPage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use TanStack Form for high performance teacher searching
  const searchForm = useForm({
    defaultValues: {
      searchQuery: '',
    },
  });

  const searchQuery = useStore(searchForm.store, (state) => state.values.searchQuery);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [teachersRes, groupsRes] = await Promise.all([
        axios.get('/api/teachers'),
        axios.get('/api/groups')
      ]);
      setTeachers(teachersRes.data.teachers || []);
      setGroups(groupsRes.data.groups || []);
    } catch (err) {
      console.error('Failed to load teachers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      if (!searchQuery) return true;
      const lower = searchQuery.toLowerCase();
      return (
        teacher.name.toLowerCase().includes(lower) ||
        (teacher.specialization && teacher.specialization.toLowerCase().includes(lower)) ||
        (teacher.email && teacher.email.toLowerCase().includes(lower)) ||
        (teacher.phone && teacher.phone.includes(searchQuery))
      );
    });
  }, [teachers, searchQuery]);

  return (
    <div className="space-y-6 pb-16 text-right" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-row-reverse justify-end">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            <span>دليل الشيوخ والمعلمين ({teachers.length})</span>
          </h1>
          <p className="text-xs text-slate-500">
            شيوخ المقارئ المعتمدين، إجازات الرواية والقراءات، والحلقات الدراسية المسندة.
          </p>
        </div>

        <Link
          to="/dashboard/teachers/new"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          إضافة معلم جديد
        </Link>
      </div>

      {/* Search Bar using TanStack Form */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <searchForm.Field
            name="searchQuery"
            children={(field) => (
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="البحث عن المعلمين بالاسم الكامل، التخصص، أو الهاتف..."
                className="w-full pr-10 pl-16 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-right"
              />
            )}
          />
          {searchQuery && (
            <button
              onClick={() => searchForm.setFieldValue('searchQuery', '')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* TEACHER CARDS GRID */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-semibold">جاري تحميل دليل الشيوخ...</div>
      ) : filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onClick={() => navigate({ to: '/dashboard/teachers/$id', params: { id: teacher.id } })}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <p className="text-xs text-slate-500 mb-3">لم يتم العثور على أي شيوخ يطابقون معايير البحث.</p>
          <Link
            to="/dashboard/teachers/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-block animate-pulse"
          >
            إضافة معلم جديد
          </Link>
        </div>
      )}
    </div>
  );
}
