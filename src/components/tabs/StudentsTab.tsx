import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Eye, Edit, Trash2, Award, 
  Clock, Phone, User, Star, ChevronRight,
  Sparkles, MessageSquare
} from 'lucide-react';
import { Student, Group, getGroupDisplayName } from '../../types';
import { ProfileImage } from '../common/ProfileImage';
import { calculateAge } from '../../lib/ageUtils';
import { SessionTimeDisplay } from '../common/SessionTimeDisplay';

interface StudentsTabProps {
  students: Student[];
  groups: Group[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => Promise<void>;
  onRateStudent: (student: Student) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  groups,
  onAddStudent,
  onEditStudent,
  onViewStudent,
  onDeleteStudent,
  onRateStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter students based on full name search, parent name, group, status
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = searchQuery === '' || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.parentName && student.parentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.currentSurahName && student.currentSurahName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.parentPhone && student.parentPhone.includes(searchQuery));

      const matchesGroup = selectedGroupFilter === 'all' || 
        (student.groupId && student.groupId.split(',').map(id => id.trim()).includes(selectedGroupFilter));
      const matchesLevel = levelFilter === 'all' || student.level === levelFilter;

      return matchesSearch && matchesGroup && matchesLevel;
    });
  }, [students, searchQuery, selectedGroupFilter, levelFilter]);

  const handleDelete = async (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete student "${student.name}"?`)) {
      setDeletingId(student.id);
      try {
        await onDeleteStudent(student.id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-emerald-600" />
            Students Directory ({students.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Student cards displaying Quran milestone, assigned circle, and parent contact.
          </p>
        </div>

        <button
          onClick={onAddStudent}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Full Name Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student full name, parent, or Surah..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Group Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="w-full md:w-56 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="all">All Groups / Halaqat</option>
            {groups.map((grp) => (
              <option key={grp.id} value={grp.id}>
                {getGroupDisplayName(grp)}
              </option>
            ))}
          </select>

          {/* Education level filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="all">All Education Levels</option>
            <option value="primary">ابتدائي</option>
            <option value="middle">متوسط</option>
            <option value="secondary">ثانوي</option>
          </select>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STUDENT CARDS GRID VIEW                                  */}
      {/* ======================================================== */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => {
            const rating = student.latestRating;
            return (
              <div
                key={student.id}
                onClick={() => onViewStudent(student)}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Profile Picture, Name, Age/Gender */}
                  <div className="flex items-start gap-3.5">
                    {/* Profile Picture */}
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 shrink-0 bg-slate-100 shadow-xs">
                      <ProfileImage
                        src={student.avatar}
                        alt={student.name}
                        className="w-full h-full object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Name & Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-extrabold text-slate-900 text-base truncate group-hover:text-emerald-700 transition-colors">
                          {student.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        {calculateAge(student.dateOfBirth || student.age) !== null && (
                          <span>{calculateAge(student.dateOfBirth || student.age)} سنة</span>
                        )}
                        <span>•</span>
                        <span>{student.gender === 'male' ? 'Male (طالب)' : 'Female (طالبة)'}</span>
                      </div>

                      {/* Memorized Juz Count */}
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                        {student.memorizedJuzCount || 0} / {student.targetJuz || 30} Juz Memorized
                      </span>
                    </div>
                  </div>

                  {/* Quran Milestone (Surah & Ayah) */}
                  <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src="/icon.png" alt="" className="w-4 h-4 object-contain shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-emerald-800 uppercase font-bold block">Current Surah</span>
                        <span className="text-xs font-bold text-slate-900 truncate block">
                          Surah {student.currentSurahName || 'Al-Fatihah'}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold bg-emerald-200/80 text-emerald-950 px-2.5 py-1 rounded-xl shrink-0">
                      Ayah {student.currentAyah || 1}
                    </span>
                  </div>

                  {/* Group & Study Time */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      Halaqa / Group
                    </span>
                    {student.group ? (
                      <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                        <span className="font-bold text-slate-800 text-xs block truncate">
                          {getGroupDisplayName(student.group)}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                          <SessionTimeDisplay entry={student.group} className="truncate" />
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-slate-50 rounded-xl text-xs text-slate-400 italic">
                        No circle assigned
                      </div>
                    )}
                  </div>

                  {/* Parent Contact Number */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      Parent Contact
                    </span>
                    {student.parentPhone ? (
                      <a
                        href={`tel:${student.parentPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 hover:border-emerald-300 rounded-xl flex items-center justify-between text-xs transition-colors group/phone"
                      >
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover/phone:scale-110 transition-transform" />
                          <div>
                            <span className="font-bold text-slate-900 block font-mono">{student.parentPhone}</span>
                            {student.parentName && (
                              <span className="text-[10px] text-slate-500 font-normal">{student.parentName}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          Call
                        </span>
                      </a>
                    ) : (
                      <div className="p-2 bg-slate-50 rounded-xl text-xs text-slate-400 italic">
                        No parent phone provided
                      </div>
                    )}
                  </div>

                  {/* Monthly Rating Summary */}
                  {rating ? (
                    <div className="flex items-center justify-between p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900">{rating.grade}</span>
                          <span className="text-[10px] text-slate-500 block">Month: {rating.month}</span>
                        </div>
                      </div>
                      <span className="font-mono font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg text-xs">
                        {rating.overallScore}%
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRateStudent(student);
                      }}
                      className="w-full py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      + Add Monthly Evaluation
                    </button>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Quick Rate */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRateStudent(student);
                      }}
                      title="Rate Student"
                      className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Award className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStudent(student);
                      }}
                      title="Edit Student"
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => handleDelete(student, e)}
                      disabled={deletingId === student.id}
                      title="Delete Student"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Students Found</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new student to the Madrasa.
          </p>
          <button
            onClick={onAddStudent}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            Add New Student
          </button>
        </div>
      )}
    </div>
  );
};
