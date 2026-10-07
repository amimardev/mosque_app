import React, { useState, useMemo } from 'react';
import { 
  Award, Star, Plus, Filter, Search, 
  Calendar, User, Trash2, Edit, CheckCircle2, ChevronDown 
} from 'lucide-react';
import { StudentRating, Student, Teacher, Group, getGroupDisplayName } from '../../types';
import { ProfileImage } from '../common/ProfileImage';

interface RatingsTabProps {
  ratings: StudentRating[];
  students: Student[];
  teachers: Teacher[];
  groups: Group[];
  onAddRating: (student?: Student) => void;
  onEditRating: (rating: StudentRating) => void;
  onDeleteRating: (id: string) => Promise<void>;
  onViewStudent: (student: Student) => void;
}

export const RatingsTab: React.FC<RatingsTabProps> = ({
  ratings,
  students,
  teachers,
  groups,
  onAddRating,
  onEditRating,
  onDeleteRating,
  onViewStudent
}) => {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Available unique months from ratings
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add('2026-09');
    set.add('2026-08');
    set.add('2026-07');
    ratings.forEach(r => {
      if (r.month) set.add(r.month);
    });
    return Array.from(set).sort().reverse();
  }, [ratings]);

  const filteredRatings = useMemo(() => {
    return ratings.filter((r) => {
      const matchesMonth = selectedMonth === 'all' || r.month === selectedMonth;
      const matchesGroup = selectedGroup === 'all' || r.groupId === selectedGroup;
      const matchesSearch = searchQuery === '' ||
        (r.student?.name && r.student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.teacher?.name && r.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.surahEvaluated && r.surahEvaluated.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesMonth && matchesGroup && matchesSearch;
    });
  }, [ratings, selectedMonth, selectedGroup, searchQuery]);

  const handleDelete = async (rating: StudentRating) => {
    if (window.confirm(`Are you sure you want to delete this rating for ${rating.student?.name || 'student'}?`)) {
      setDeletingId(rating.id);
      try {
        await onDeleteRating(rating.id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-amber-500" />
            Monthly Student Ratings & Progress ({ratings.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official monthly grades, Hifz retention, Tajweed precision, and Surah progression.
          </p>
        </div>

        <button
          onClick={() => onAddRating()}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Monthly Rating
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, teacher, or evaluated Surah..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
          />
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full md:w-44 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="all">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Group Filter */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full md:w-48 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="all">All Halaqat</option>
            {groups.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {getGroupDisplayName(grp)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student Profile</th>
                <th className="py-3.5 px-4">Month</th>
                <th className="py-3.5 px-4">Evaluated Portion</th>
                <th className="py-3.5 px-4 text-center">Hifz / 100</th>
                <th className="py-3.5 px-4 text-center">Tajweed / 100</th>
                <th className="py-3.5 px-4 text-center">Overall</th>
                <th className="py-3.5 px-4">Official Grade</th>
                <th className="py-3.5 px-4">Teacher Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRatings.length > 0 ? (
                filteredRatings.map((rating) => {
                  const studentObj = students.find(s => s.id === rating.studentId);
                  return (
                    <tr key={rating.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <ProfileImage
                            src={rating.student?.avatar}
                            alt=""
                            className="w-9 h-9 rounded-full shrink-0 ring-2 ring-emerald-500/20"
                          />
                          <div>
                            <span
                              onClick={() => studentObj && onViewStudent(studentObj)}
                              className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer block"
                            >
                              {rating.student?.name || 'Student'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Current: Surah {rating.student?.currentSurahName} : {rating.student?.currentAyah}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Month */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg">
                          {rating.month}
                        </span>
                      </td>

                      {/* Evaluated Portion */}
                      <td className="py-3.5 px-4">
                        {rating.surahEvaluated ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 font-semibold">
                            <img src="/icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
                            <span>Surah {rating.surahEvaluated}</span>
                            {rating.ayahStart && rating.ayahEnd && (
                              <span className="text-[10px] font-mono text-emerald-700">
                                ({rating.ayahStart}-{rating.ayahEnd})
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">General review</span>
                        )}
                      </td>

                      {/* Hifz */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {rating.hifzScore}
                      </td>

                      {/* Tajweed */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {rating.tajweedScore}
                      </td>

                      {/* Overall Score */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold font-mono text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg text-xs">
                          {rating.overallScore}%
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {rating.grade}
                      </td>

                      {/* Teacher Notes */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate text-[11px]">
                        {rating.notes ? `"${rating.notes}"` : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditRating(rating)}
                            title="Edit Rating"
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(rating)}
                            disabled={deletingId === rating.id}
                            title="Delete Rating"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-semibold mb-1">No ratings found for the selected filters.</p>
                    <button
                      onClick={() => onAddRating()}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs mt-2"
                    >
                      Record Monthly Rating
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
