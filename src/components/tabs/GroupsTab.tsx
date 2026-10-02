import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Clock, MapPin, Award, Eye, Edit, Trash2, 
  ArrowLeft, BookOpen, Phone, User, CheckCircle2, ChevronRight, Sparkles 
} from 'lucide-react';
import { Group, Student, Teacher } from '../../types';
import { calculateAge } from '../../lib/ageUtils';
import { SessionTimeDisplay } from '../common/SessionTimeDisplay';

interface GroupsTabProps {
  groups: Group[];
  students: Student[];
  teachers: Teacher[];
  onAddGroup: () => void;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (id: string) => Promise<void>;
  onViewStudent: (student: Student) => void;
  onAddStudent: (preselectedGroupId?: string) => void;
  onRateStudent: (student: Student) => void;
  activeGroupDetailId?: string | null;
  onSelectGroupDetail: (groupId: string | null) => void;
}

export const GroupsTab: React.FC<GroupsTabProps> = ({
  groups,
  students,
  teachers,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  onViewStudent,
  onAddStudent,
  onRateStudent,
  activeGroupDetailId,
  onSelectGroupDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Active group for dedicated "View Group Page"
  const activeGroup = useMemo(() => {
    if (!activeGroupDetailId) return null;
    return groups.find(g => g.id === activeGroupDetailId) || null;
  }, [groups, activeGroupDetailId]);

  // Students belonging to the active group
  const groupStudents = useMemo(() => {
    if (!activeGroup) return [];
    return students.filter(s => s.groupId && s.groupId.split(',').map(id => id.trim()).includes(activeGroup.id));
  }, [students, activeGroup]);

  // Teachers belonging to the active group
  const groupTeachers = useMemo(() => {
    if (!activeGroup) return [];
    return activeGroup.teachers || [];
  }, [activeGroup]);

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      if (!searchQuery) return true;
      const lower = searchQuery.toLowerCase();
      return (
        String(g.number).includes(lower) ||
      g.type?.toLowerCase().includes(lower) ||
        g.studyTime.toLowerCase().includes(lower) ||
        (g.room && g.room.toLowerCase().includes(lower)) ||
        (g.level && g.level.toLowerCase().includes(lower))
      );
    });
  }, [groups, searchQuery]);

  const handleDelete = async (group: Group, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف حلقة رقم ${group.number}؟ سيفقد جميع الطلاب المنتسبين انتسابهم.`)) {
      setDeletingId(group.id);
      try {
        await onDeleteGroup(group.id);
        if (activeGroupDetailId === group.id) {
          onSelectGroupDetail(null);
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  // ==========================================
  // DEDICATED VIEW GROUP PAGE
  // ==========================================
  if (activeGroup) {
    const capacityPercent = Math.min(100, Math.round((groupStudents.length / (activeGroup.capacity || 20)) * 100));

    return (
      <div className="space-y-6 pb-16 animate-in fade-in duration-200">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onSelectGroupDetail(null)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Halaqat
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditGroup(activeGroup)}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 shadow-xs transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-blue-600" />
              Edit Halaqa
            </button>
            <button
              onClick={() => onAddStudent(activeGroup.id)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Enroll Student to this Group
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TOP OF THE PAGE: GROUP HEADER, STUDY TIME & TEACHERS     */}
        {/* (Requirement: "each group has n students and teachers that will be displayed in the top of the page of a view group page, each group will have a study time") */}
        {/* ======================================================== */}
        <div className="bg-slate-950 rounded-3xl text-white p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            {/* Top row: Title, Level, Capacity */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-900 text-emerald-300 font-bold text-xs rounded-full border border-emerald-700">
                    {activeGroup.level}
                  </span>
                  {activeGroup.room && (
                    <span className="px-3 py-1 bg-slate-800 text-slate-200 text-xs rounded-full flex items-center gap-1 border border-slate-700">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {activeGroup.room}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  حلقة رقم {activeGroup.number} ({activeGroup.type})
                </h1>
                {activeGroup.description && (
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                    {activeGroup.description}
                  </p>
                )}
              </div>

              {/* Study Time Highlight Box */}
              <div className="bg-emerald-950 border border-emerald-700 p-4 rounded-2xl shrink-0">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Official Study Time
                </span>
                <span className="text-sm sm:text-base font-extrabold text-white">
                  <SessionTimeDisplay entry={activeGroup} />
                </span>
              </div>
            </div>

            {/* Prominently Displayed Teachers Section at Top */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Assigned Sheikhs & Instructors ({groupTeachers.length})
                </span>
              </div>

              {groupTeachers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {groupTeachers.map((tch) => (
                    <div
                      key={tch.id}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs hover:bg-white/15 transition-colors"
                    >
                      <img
                        src={tch.avatar}
                        alt={tch.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-400/40 shrink-0 bg-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(tch.name)}`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-white block truncate">
                          {tch.name}
                        </span>
                        <span className="text-xs text-emerald-300 block truncate">
                          {tch.specialization}
                        </span>
                        {tch.phone && (
                          <span className="text-[11px] text-slate-300 font-mono flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 opacity-70" />
                            {tch.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white/5 rounded-2xl text-xs text-slate-300 italic">
                  No teachers assigned to this group yet. Edit group to assign Sheikhs.
                </div>
              )}
            </div>

            {/* Quick Metrics Bar at Top */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Enrolled Students</span>
                <span className="text-lg font-extrabold text-white">{groupStudents.length}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Max Capacity</span>
                <span className="text-lg font-extrabold text-white">{activeGroup.capacity || 20}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-center">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Capacity Filled</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">{capacityPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ENROLLED STUDENTS CARDS (N STUDENTS IN THIS GROUP)       */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                الطلاب المسجلون في هذه الحلقة ({groupStudents.length})
              </h2>
              <p className="text-xs text-slate-500">
                عرض جميع الطلاب الدارسين في حلقة رقم {activeGroup.number} ({activeGroup.type})
              </p>
            </div>

            <button
              onClick={() => onAddStudent(activeGroup.id)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Student
            </button>
          </div>

          {groupStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupStudents.map((student) => {
                const rating = student.latestRating;
                return (
                  <div
                    key={student.id}
                    onClick={() => onViewStudent(student)}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-3">
                      {/* Header: Photo, Name, Age/Gender */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-emerald-500/20 shrink-0 bg-slate-100 shadow-2xs">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(student.name)}`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-emerald-700 transition-colors">
                            {student.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 block">
                            {calculateAge(student.dateOfBirth || student.age) !== null ? `${calculateAge(student.dateOfBirth || student.age)} سنة • ` : ''}{student.gender === 'male' ? 'طالب (ذكر)' : 'طالبة (أنثى)'}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                            {student.memorizedJuzCount || 0} / {student.targetJuz || 30} Juz
                          </span>
                        </div>
                      </div>

                      {/* Quran Progress */}
                      <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-900 truncate">
                            Surah {student.currentSurahName || 'Al-Fatihah'}
                          </span>
                        </div>
                        <span className="font-mono font-bold bg-emerald-200/80 text-emerald-950 px-2 py-0.5 rounded-md text-[11px] shrink-0">
                          Ayah {student.currentAyah || 1}
                        </span>
                      </div>

                      {/* Parent Phone */}
                      {student.parentPhone && (
                        <a
                          href={`tel:${student.parentPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-slate-50 hover:bg-emerald-50 rounded-xl flex items-center justify-between text-xs transition-colors border border-slate-200/60"
                        >
                          <div className="flex items-center gap-1.5 font-mono text-slate-800">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{student.parentPhone}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold">Call</span>
                        </a>
                      )}

                      {/* Monthly Rating */}
                      {rating && (
                        <div className="flex items-center justify-between text-xs px-2.5 py-1 bg-amber-50 rounded-lg text-amber-900">
                          <span className="font-semibold">{rating.grade}</span>
                          <span className="font-mono font-bold">{rating.overallScore}%</span>
                        </div>
                      )}
                    </div>

                    {/* Card Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700">View Profile</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRateStudent(student);
                        }}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Rate Progress
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-6">
              <p className="text-xs text-slate-400 mb-3">No students currently enrolled in this group.</p>
              <button
                onClick={() => onAddStudent(activeGroup.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Enroll First Student
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // ALL GROUPS DIRECTORY VIEW
  // ==========================================
  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-600" />
            Halaqat & Groups Directory ({groups.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Study circles, timings, curriculum levels, and assigned teachers.
          </p>
        </div>

        <button
          onClick={onAddGroup}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Group / Halaqa
        </button>
      </div>

      {/* Grid of Groups / Halaqat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGroups.map((group) => {
          const groupEnrolledStudents = students.filter(s => s.groupId && s.groupId.split(',').map(id => id.trim()).includes(group.id));
          const enrolledCount = groupEnrolledStudents.length;
          const capacityPercent = Math.min(100, Math.round((enrolledCount / (group.capacity || 20)) * 100));

          return (
            <div
              key={group.id}
              onClick={() => onSelectGroupDetail(group.id)}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header: Title & Level */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 inline-block mb-1.5">
                      {group.level}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      حلقة رقم {group.number} ({group.type})
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditGroup(group);
                      }}
                      title="Edit Group"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(group, e)}
                      disabled={deletingId === group.id}
                      title="Delete Group"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {group.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {group.description}
                  </p>
                )}

                {/* Prominently Highlighted Study Time */}
                <div className="p-3 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Study Time Schedule</span>
                    <SessionTimeDisplay entry={group} />
                  </div>
                </div>

                {/* Room / Hall */}
                {group.room && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Location: {group.room}</span>
                  </div>
                )}
              </div>

              {/* Footer: Assigned Teachers & Capacity */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {/* Teachers */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Assigned Sheikhs:</span>
                  {group.teachers && group.teachers.length > 0 ? (
                    <div className="flex items-center -space-x-2">
                      {group.teachers.map((t) => (
                        <img
                          key={t.id}
                          src={t.avatar}
                          alt={t.name}
                          title={`${t.name} (${t.specialization})`}
                          className="w-7 h-7 rounded-full ring-2 ring-white object-cover shadow-xs"
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">None assigned</span>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{enrolledCount} Enrolled Students</span>
                    <span className="text-slate-500 font-normal">Cap: {group.capacity || 20}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        capacityPercent >= 90 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                </div>

                {/* Open View Group Page CTA */}
                <div className="pt-2 flex items-center justify-end text-xs font-bold text-emerald-700 group-hover:text-emerald-800 gap-1">
                  <span>Open Full Group View</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
