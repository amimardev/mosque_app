import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { useForm, useStore } from '@tanstack/react-form';
import { 
  Search, Plus, User
} from 'lucide-react';
import { Student, Group } from '../../../types';
import { StudentCard } from '../../../components/common/StudentCard';
import { useAuth } from '../../../context/AuthContext';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

export const Route = createFileRoute('/dashboard/students/')({
  component: StudentsDirectoryPage,
});

function StudentsDirectoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isParent = user?.role === 'parent';
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize TanStack Form for high-performance filter state management
  const filterForm = useForm({
    defaultValues: {
      searchQuery: '',
      groupFilter: 'all',
      levelFilter: 'all',
    },
  });

  const searchQuery = useStore(filterForm.store, (state) => state.values.searchQuery);
  const selectedGroupFilter = useStore(filterForm.store, (state) => state.values.groupFilter);
  const levelFilter = useStore(filterForm.store, (state) => state.values.levelFilter);
  const debouncedSearchQuery = useDebounce(searchQuery);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const querySearch = params.get('q') || '';
    const queryGroup = params.get('groupId') || 'all';
    const queryLevel = params.get('level') || 'all';
    filterForm.setFieldValue('searchQuery', querySearch);
    filterForm.setFieldValue('groupFilter', queryGroup);
    filterForm.setFieldValue('levelFilter', queryLevel);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearchQuery.trim()) params.set('q', debouncedSearchQuery.trim());
      if (selectedGroupFilter !== 'all') params.set('groupId', selectedGroupFilter);
      if (levelFilter !== 'all') params.set('level', levelFilter);
      const [studentsRes, groupsRes] = await Promise.all([
        api.get(`/api/students?${params.toString()}`),
        api.get('/api/groups')
      ]);
      setStudents(studentsRes.data.students || []);
      setGroups(groupsRes.data.groups || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery.trim()) params.set('q', debouncedSearchQuery.trim());
    if (selectedGroupFilter !== 'all') params.set('groupId', selectedGroupFilter);
    if (levelFilter !== 'all') params.set('level', levelFilter);
    window.history.replaceState(null, '', `${window.location.pathname}${params.toString() ? `?${params}` : ''}`);
    fetchData();
  }, [debouncedSearchQuery, selectedGroupFilter, levelFilter]);

  return (
    <div className="space-y-6 pb-16 text-right" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            {isParent ? `قائمة الأبناء (${students.length})` : `دليل وسجل الطلاب (${students.length})`}
          </h1>
          <p className="text-xs text-slate-500">
            {isParent
              ? 'مستويات الحفظ، ومتابعة الأبناء المسجلين في المدرسة القرآنية.'
              : 'مستويات الحفظ، الانتماء للحلقات، ومعلومات الاتصال لأولياء الأمور.'}
          </p>
        </div>

        {isAdmin && (
          <Link
            to="/dashboard/students/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            تسجيل طالب جديد
          </Link>
        )}
      </div>

      {/* Filter and Search Bar using TanStack Form & Shadcn UI Select */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-4">
        {/* Full Name Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <filterForm.Field
            name="searchQuery"
            children={(field) => (
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="البحث باسم الطالب، ولي الأمر، أو السورة..."
                className="w-full pr-10 pl-16 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-right"
              />
            )}
          />
          {searchQuery && (
            <button
              onClick={() => filterForm.setFieldValue('searchQuery', '')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              مسح
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-row-reverse">
          {/* Group Filter using Shadcn Select */}
          <div className="w-full sm:w-56 text-right">
            <filterForm.Field
              name="groupFilter"
              children={(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val)}
                >
                  <SelectTrigger className="w-full text-right text-xs bg-slate-50 border-slate-200 text-slate-700 rounded-xl h-10 px-3 flex items-center justify-between">
                    <SelectValue placeholder="اختر حلقة" />
                  </SelectTrigger>
                  <SelectContent className="text-right">
                    <SelectItem value="all">جميع الحلقات</SelectItem>
                    {groups.map((grp) => (
                      <SelectItem key={grp.id} value={grp.id}>
                        حلقة رقم {grp.number} ({grp.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Education level filter */}
          <div className="w-full sm:w-40 text-right">
            <filterForm.Field
              name="levelFilter"
              children={(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val)}
                >
                  <SelectTrigger className="w-full text-right text-xs bg-slate-50 border-slate-200 text-slate-700 rounded-xl h-10 px-3 flex items-center justify-between">
                    <SelectValue placeholder="المستوى التعليمي" />
                  </SelectTrigger>
                  <SelectContent className="text-right">
                    <SelectItem value="all">جميع المستويات</SelectItem>
                    <SelectItem value="primary">ابتدائي</SelectItem>
                    <SelectItem value="middle">متوسط</SelectItem>
                    <SelectItem value="secondary">ثانوي</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      {/* STUDENT CARDS GRID */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-semibold">جاري تحميل سجل الطلاب...</div>
      ) : students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => navigate({ to: '/dashboard/students/$id', params: { id: student.id } })}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <p className="text-xs text-slate-500 mb-3">
            {isParent
              ? 'لم يتم العثور على أبناء مسجلين بحسابك.'
              : 'لم يتم العثور على أي طلاب يطابقون معايير البحث.'}
          </p>
          {isAdmin && (
            <Link
              to="/dashboard/students/new"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-block"
            >
              تسجيل طالب جديد
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
