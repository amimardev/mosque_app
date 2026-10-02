import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useForm, useStore } from '@tanstack/react-form';
import { 
  Search, Plus, User
} from 'lucide-react';
import { Student, Group } from '../../../types';
import { StudentCard } from '../../../components/common/StudentCard';
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
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize TanStack Form for high-performance filter state management
  const filterForm = useForm({
    defaultValues: {
      searchQuery: '',
      groupFilter: 'all',
      statusFilter: 'all',
    },
  });

  const searchQuery = useStore(filterForm.store, (state) => state.values.searchQuery);
  const selectedGroupFilter = useStore(filterForm.store, (state) => state.values.groupFilter);
  const statusFilter = useStore(filterForm.store, (state) => state.values.statusFilter);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [studentsRes, groupsRes] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/groups')
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
    fetchData();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = searchQuery === '' || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.parentName && student.parentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.currentSurahName && student.currentSurahName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.parentPhone && student.parentPhone.includes(searchQuery));

      const matchesGroup = selectedGroupFilter === 'all' || 
        (student.groupId && student.groupId.split(',').map(id => id.trim()).includes(selectedGroupFilter));
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [students, searchQuery, selectedGroupFilter, statusFilter]);

  return (
    <div className="space-y-6 pb-16 text-right" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            دليل وسجل الطلاب ({students.length})
          </h1>
          <p className="text-xs text-slate-500">
            مستويات الحفظ، الانتماء للحلقات، ومعلومات الاتصال لأولياء الأمور.
          </p>
        </div>

        <Link
          to="/dashboard/students/new"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          تسجيل طالب جديد
        </Link>
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

          {/* Status Filter using Shadcn Select */}
          <div className="w-full sm:w-40 text-right">
            <filterForm.Field
              name="statusFilter"
              children={(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val)}
                >
                  <SelectTrigger className="w-full text-right text-xs bg-slate-50 border-slate-200 text-slate-700 rounded-xl h-10 px-3 flex items-center justify-between">
                    <SelectValue placeholder="حالة الطالب" />
                  </SelectTrigger>
                  <SelectContent className="text-right">
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="graduated">متخرج</SelectItem>
                    <SelectItem value="paused">موقوف مؤقتاً</SelectItem>
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
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => navigate({ to: '/dashboard/students/$id', params: { id: student.id } })}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <p className="text-xs text-slate-500 mb-3">لم يتم العثور على أي طلاب يطابقون معايير البحث.</p>
          <Link
            to="/dashboard/students/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-block"
          >
            تسجيل طالب جديد
          </Link>
        </div>
      )}
    </div>
  );
}
