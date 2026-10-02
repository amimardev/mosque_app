import React from 'react';
import { 
  Users, UserCheck, BookOpen, Clock, Award, Star, 
  ArrowUpRight, Plus, Sparkles, TrendingUp, ChevronRight 
} from 'lucide-react';
import { Student, Teacher, Group, StudentRating, MadrasaStats } from '../../types';
import { SessionTimeDisplay } from '../common/SessionTimeDisplay';

interface OverviewTabProps {
  stats: MadrasaStats | null;
  students: Student[];
  teachers: Teacher[];
  groups: Group[];
  ratings: StudentRating[];
  onNavigateTab: (tab: 'students' | 'teachers' | 'groups' | 'ratings') => void;
  onAddStudent: () => void;
  onAddTeacher: () => void;
  onAddGroup: () => void;
  onAddRating: () => void;
  onViewStudent: (student: Student) => void;
  onViewGroup: (group: Group) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  students,
  teachers,
  groups,
  ratings,
  onNavigateTab,
  onAddStudent,
  onAddTeacher,
  onAddGroup,
  onAddRating,
  onViewStudent,
  onViewGroup
}) => {
  const recentRatings = ratings.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner (Solid Opaque Emerald/Slate) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Mosque & Madrasa Quran Management System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the Quran Center Dashboard. Track your students, teachers, halaqat study times, Surah & Ayah progress, and monthly evaluations in one integrated portal.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={onAddStudent}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
            <button
              onClick={onAddTeacher}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Teacher
            </button>
            <button
              onClick={onAddGroup}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Group / Halaqa
            </button>
            <button
              onClick={onAddRating}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Award className="w-4 h-4" />
              Monthly Rating
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards (Solid Opaque Colors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Students Card */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Students
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.totalStudents || students.length}
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Active Enrolled
            </span>
          </div>
        </div>

        {/* Teachers Card */}
        <div 
          onClick={() => onNavigateTab('teachers')}
          className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Qualified Teachers
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.totalTeachers || teachers.length}
            </span>
            <span className="text-xs font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
              Sheikhs & Ustadhs
            </span>
          </div>
        </div>

        {/* Groups Card */}
        <div 
          onClick={() => onNavigateTab('groups')}
          className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Halaqat / Groups
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.totalGroups || groups.length}
            </span>
            <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
              Study Circles
            </span>
          </div>
        </div>

        {/* Avg Monthly Rating Card */}
        <div 
          onClick={() => onNavigateTab('ratings')}
          className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Avg Monthly Rating
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats?.averageRating || 92}%
            </span>
            <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
              Mumtaz Grade
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Halaqat & Top Memorizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Halaqat & Study Times Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Active Circles & Study Times
            </h2>
            <button
              onClick={() => onNavigateTab('groups')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View All Halaqat ({groups.length})
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.slice(0, 4).map((grp) => (
              <div
                key={grp.id}
                onClick={() => onViewGroup(grp)}
                className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors">
                      {grp.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {grp.level}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {grp.studentsCount || 0} Students
                  </span>
                </div>

                {/* Highlighted Study Time */}
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-950 bg-emerald-100 border border-emerald-300 p-2.5 rounded-xl">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <SessionTimeDisplay entry={grp} className="truncate" />
                </div>

                {/* Assigned Teachers avatars */}
                {grp.teachers && grp.teachers.length > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 text-[11px]">Sheikhs:</span>
                    <div className="flex items-center -space-x-2">
                      {grp.teachers.map((t) => (
                        <img
                          key={t.id}
                          src={t.avatar}
                          alt={t.name}
                          title={t.name}
                          className="w-6 h-6 rounded-full ring-2 ring-white object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Memorizers Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Top Hifz Progress
            </h2>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              All Students
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 divide-y divide-slate-100 shadow-xs">
            {students
              .slice()
              .sort((a, b) => (b.memorizedJuzCount || 0) - (a.memorizedJuzCount || 0))
              .slice(0, 5)
              .map((student, idx) => (
                <div
                  key={student.id}
                  onClick={() => onViewStudent(student)}
                  className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    idx === 0 ? 'bg-amber-200 text-amber-900 font-extrabold ring-1 ring-amber-400' :
                    idx === 1 ? 'bg-slate-200 text-slate-800 font-bold' :
                    idx === 2 ? 'bg-amber-100 text-amber-800' : 'text-slate-400 bg-slate-100'
                  }`}>
                    {idx + 1}
                  </div>

                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-900 text-xs block truncate">
                      {student.name}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium truncate block">
                      Surah {student.currentSurahName} (Ayah {student.currentAyah})
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {student.memorizedJuzCount || 0} Juz
                    </span>
                    <span className="text-[10px] text-slate-400">
                      / {student.targetJuz || 30} Target
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Monthly Ratings Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            Recent Monthly Evaluations
          </h2>
          <button
            onClick={() => onNavigateTab('ratings')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Open Ratings Hub
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Current Progress</th>
                  <th className="py-3.5 px-4">Month</th>
                  <th className="py-3.5 px-4 text-center">Hifz</th>
                  <th className="py-3.5 px-4 text-center">Tajweed</th>
                  <th className="py-3.5 px-4 text-center">Overall Score</th>
                  <th className="py-3.5 px-4">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRatings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rating.student?.avatar || 'https://api.dicebear.com/7.x/micah/svg?seed=student'}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <span className="font-bold text-slate-900">{rating.student?.name || 'Student'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Surah {rating.student?.currentSurahName || 'Al-Baqarah'} : {rating.student?.currentAyah || 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {rating.month}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {rating.hifzScore}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {rating.tajweedScore}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-emerald-900 font-mono bg-emerald-200 px-2 py-0.5 rounded-md">
                        {rating.overallScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700">
                        {rating.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
