import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Award, Plus, Search, Star, Trash2, 
  BookOpen, User, Calendar, ChevronRight 
} from 'lucide-react';
import { StudentRating, Student, Teacher } from '../../../types';

export const Route = createFileRoute('/dashboard/ratings/')({
  component: RatingsHubPage,
});

function RatingsHubPage() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<StudentRating[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ratingsRes, studentsRes, teachersRes] = await Promise.all([
        axios.get('/api/ratings'),
        axios.get('/api/students'),
        axios.get('/api/teachers')
      ]);
      setRatings(ratingsRes.data.ratings || []);
      setStudents(studentsRes.data.students || []);
      setTeachers(teachersRes.data.teachers || []);
    } catch (err) {
      console.error('Failed to load ratings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableMonths = useMemo(() => {
    const months = Array.from(new Set(ratings.map((r) => r.month)));
    return months.sort().reverse();
  }, [ratings]);

  const filteredRatings = useMemo(() => {
    return ratings.filter((r) => {
      const studentName = r.student?.name || '';
      const matchesSearch = searchQuery === '' || 
        studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.surahEvaluated && r.surahEvaluated.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMonth = selectedMonth === 'all' || r.month === selectedMonth;
      return matchesSearch && matchesMonth;
    });
  }, [ratings, searchQuery, selectedMonth]);

  const handleDelete = async (r: StudentRating, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`هل أنت متأكد من حذف سجل التقييم للطالب "${r.student?.name || 'الطالب'}"؟`)) {
      setDeletingId(r.id);
      try {
        await axios.delete(`/api/ratings/${r.id}`);
        await fetchData();
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16 text-right" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 flex-row-reverse justify-end">
            <Award className="w-7 h-7 text-amber-500" />
            <span>سجل التقييمات والاختبارات الشهرية ({ratings.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            كشوفات درجات الحفظ الجديد، أحكام التجويد ومخارج الحروف، وجداول اختبارات التثبيت والمراجعة.
          </p>
        </div>

        <Link
          to="/dashboard/ratings/new"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إجراء تقييم جديد</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم الطالب أو السورة المختبرة..."
            className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-right"
          />
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full sm:w-48 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 text-right"
        >
          <option value="all">جميع الأشهر</option>
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              شهر: {m}
            </option>
          ))}
        </select>
      </div>

      {/* Ratings Cards Grid */}
      {filteredRatings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRatings.map((rating) => (
            <div
              key={rating.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-right"
            >
              <div className="space-y-3.5">
                {/* Header: Student photo + Score Badge */}
                <div className="flex items-start justify-between gap-3 flex-row-reverse">
                  <div className="flex items-center gap-3 min-w-0 flex-row-reverse">
                    <img
                      src={rating.student?.avatar || 'https://api.dicebear.com/7.x/micah/svg?seed=student'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400/40 shrink-0"
                    />
                    <div className="min-w-0 text-right">
                      {rating.student ? (
                        <Link
                          to="/dashboard/students/$id"
                          params={{ id: rating.student.id }}
                          className="font-extrabold text-slate-900 text-sm hover:text-emerald-700 block truncate"
                        >
                          {rating.student.name}
                        </Link>
                      ) : (
                        <span className="font-extrabold text-slate-900 text-sm block">طالب</span>
                      )}
                      <span className="text-[11px] text-slate-400 block">
                        الشهر: <strong className="text-slate-700">{rating.month}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-left shrink-0" dir="ltr">
                    <span className="text-base font-extrabold font-mono text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-xl block">
                      {rating.overallScore}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mt-1">
                      {rating.grade?.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Evaluated Surah Passage */}
                {rating.surahEvaluated && (
                  <div className="p-2.5 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs space-y-0.5 text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      المقطع المختبر
                    </span>
                    <span className="font-bold text-slate-900 block">
                      سورة {rating.surahEvaluated} {rating.ayahStart && rating.ayahEnd ? `(من الآية ${rating.ayahStart} إلى ${rating.ayahEnd})` : ''}
                    </span>
                  </div>
                )}

                {/* Score Breakdown Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">الحفظ</span>
                    <span className="font-mono font-bold text-slate-800" dir="ltr">{rating.hifzScore}/100</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">التجويد</span>
                    <span className="font-mono font-bold text-slate-800" dir="ltr">{rating.tajweedScore}/100</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">المراجعة</span>
                    <span className="font-mono font-bold text-slate-800" dir="ltr">{rating.murajaahScore}/100</span>
                  </div>
                </div>

                {rating.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 line-clamp-2 italic text-right">
                    "{rating.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-row-reverse">
                {rating.teacher ? (
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">
                    الشيخ: {rating.teacher.name}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">مسجل</span>
                )}

                <button
                  onClick={(e) => handleDelete(rating, e)}
                  disabled={deletingId === rating.id}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="حذف التقييم"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">لا توجد سجلات تقييم مطابقة</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            قم بإجراء التقييمات الشهرية للطلاب لمتابعة تطور الحفظ والتجويد عبر الأشهر.
          </p>
          <Link
            to="/dashboard/ratings/new"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all inline-block"
          >
            تسجيل أول تقييم شهري
          </Link>
        </div>
      )}
    </div>
  );
}
