import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import api from '@/lib/apiClient';
import { 
  Sparkles, Clock, Star, ChevronRight 
} from 'lucide-react';
import { Student, Teacher, Group, StudentRating } from '../../types';
import { StudentCard } from '../../components/common/StudentCard';
import { useAuth } from '../../context/AuthContext';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndexPage,
});

export function DashboardIndexPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [ratings, setRatings] = useState<StudentRating[]>([]);
  const [counts, setCounts] = useState({ students: 0, teachers: 0, groups: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      try {
        setIsLoading(true);

        // Fetch counts for fast dashboard cards
        const countsRes = await api.get('/api/stats/counts').catch(() => null);
        if (countsRes?.data?.counts) {
          setCounts({
            students: countsRes.data.counts.students || 0,
            teachers: countsRes.data.counts.teachers || 0,
            groups: countsRes.data.counts.groups || 0
          });
        }

        // Fetch full data in parallel with Promise.allSettled
        const results = await Promise.allSettled([
          api.get('/api/students'),
          api.get('/api/teachers'),
          api.get('/api/groups'),
          api.get('/api/ratings')
        ]);

        let studentList: Student[] = [];
        let teacherList: Teacher[] = [];
        let groupList: Group[] = [];
        let ratingList: StudentRating[] = [];

        if (results[0].status === 'fulfilled' && results[0].value.data?.students) {
          studentList = results[0].value.data.students;
        }
        if (results[1].status === 'fulfilled' && results[1].value.data?.teachers) {
          teacherList = results[1].value.data.teachers;
        }
        if (results[2].status === 'fulfilled' && results[2].value.data?.groups) {
          groupList = results[2].value.data.groups;
        }
        if (results[3].status === 'fulfilled' && results[3].value.data?.ratings) {
          ratingList = results[3].value.data.ratings;
        }

        setStudents(studentList);
        setTeachers(teacherList);
        setGroups(groupList);
        setRatings(ratingList);

        if (studentList.length || teacherList.length || groupList.length) {
          setCounts({
            students: studentList.length,
            teachers: teacherList.length,
            groups: groupList.length
          });
        }
      } catch (err: any) {
        console.warn('Dashboard data fetch warning:', err?.message || err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Exactly 3 primary menu options with 100% faceless illustrated 3D graphic images
  const menuOptions = [
    {
      to: '/dashboard/students',
      label: 'الطلاب',
      image: '/src/assets/images/students_faceless_1790530817292.jpg',
      alt: 'دليل الطلاب',
      countLabel: `${counts.students || students.length} طالباً مسجلاً`,
    },
    {
      to: '/dashboard/teachers',
      label: 'المعلمون والمشايخ',
      image: '/src/assets/images/teachers_faceless_1790530831937.jpg',
      alt: 'المعلمون والتحفيظ',
      countLabel: `${counts.teachers || teachers.length} معلماً ومحفظاً`,
    },
    {
      to: '/dashboard/groups',
      label: 'الحلقات الدراسية',
      image: '/src/assets/images/halaqat_faceless_1790530844707.jpg',
      alt: 'حلقات تحفيظ القرآن',
      countLabel: `${counts.groups || groups.length} حلقة حفظ`,
    },
  ];

  return (
    <div className="space-y-8 pb-16 text-right" dir="rtl">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-7 border border-emerald-700/80 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-semibold border border-emerald-700">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>نظام إدارة حلقات تحفيظ القرآن الكريم والمسجد</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h1>
          <p className="text-xs text-emerald-100 font-medium">
            مرحباً بكم في البوابة القرآنية للمدرسة. اختر أحد الأقسام أدناه لإدارة مركز تحفيظ القرآن الكريم.
          </p>
        </div>
      </div>

      {/* 2. Menu Navigation Grid (2 on phone, 3 on tablet, 3 on PC) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {menuOptions.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl hover:bg-slate-50 transition-all group text-center cursor-pointer"
            >
              {/* Illustrated Faceless Graphic */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden p-1 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 bg-slate-50 border border-slate-100">
                <img
                  src={item.image}
                  alt={item.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl shadow-2xs"
                />
              </div>

              {/* Clean Text Label Underneath */}
              <span className="mt-3 text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors block">
                {item.label}
              </span>

              {/* Minimal Counter Badge */}
              <span className="text-[11px] text-slate-400 font-semibold mt-0.5 block">
                {item.countLabel}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Simple Summary Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simple Halaqat List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              الحلقات النشطة وأوقات الحفظ
            </h2>
            <Link
              to="/dashboard/groups"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              <span>عرض الكل</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>
 
          <div className="divide-y divide-slate-100">
            {groups.slice(0, 4).map((group, idx) => {
              const groupType = `حلقة رقم ${group.number} (${group.type})`;
              const typeSlug = encodeURIComponent(group.typeSlug || 'general');
              return (
                <Link
                  key={group.id || `grp-${idx}`}
                  to={`/dashboard/groups/$groupType/$groupNumber` as any}
                  params={{ groupType: typeSlug, groupNumber: String(group.number) } as any}
                  className="py-3 flex items-center justify-between hover:text-emerald-700 transition-colors group block"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 block truncate">
                      {groupType}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {group.studyTime}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                    {group.studentsCount || 0} طالباً
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
 
        {/* Student Cards Preview Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              مستويات ومعدل تقدم حفظ الطلاب
            </h2>
            <Link
              to="/dashboard/students"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              <span>عرض جميع الطلاب ({students.length})</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {students
              .slice()
              .sort((a, b) => (b.memorizedJuzCount || 0) - (a.memorizedJuzCount || 0))
              .slice(0, 3)
              .map((student, idx) => (
                <StudentCard
                  key={student.id || `std-${idx}`}
                  student={student}
                  onClick={() => navigate({ to: '/dashboard/students/$id', params: { id: student.id } })}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
