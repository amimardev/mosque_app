import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Eye, Edit, Trash2, UserCheck, 
  Phone, Mail, BookOpen, Clock, Users, ChevronRight, Award
} from 'lucide-react';
import { Teacher, Group, getGroupDisplayName } from '../../types';
import { SessionTimeDisplay } from '../common/SessionTimeDisplay';

interface TeachersTabProps {
  teachers: Teacher[];
  groups: Group[];
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
  onViewTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => Promise<void>;
}

export const TeachersTab: React.FC<TeachersTabProps> = ({
  teachers,
  groups,
  onAddTeacher,
  onEditTeacher,
  onViewTeacher,
  onDeleteTeacher
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search by teacher name, phone, or email
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      if (!searchQuery) return true;
      const lower = searchQuery.toLowerCase();
      return (
        teacher.name.toLowerCase().includes(lower) ||
        (teacher.phone && teacher.phone.includes(searchQuery))
      );
    });
  }, [teachers, searchQuery]);

  const handleDelete = async (teacher: Teacher, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove teacher "${teacher.name}"?`)) {
      setDeletingId(teacher.id);
      try {
        await onDeleteTeacher(teacher.id);
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
            <UserCheck className="w-7 h-7 text-emerald-600" />
            Teachers & Sheikhs Directory ({teachers.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Certified Quran instructors, Qira'at specialists, and assigned Halaqat.
          </p>
        </div>

        <button
          onClick={onAddTeacher}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teachers by full name or phone..."
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
      </div>

      {/* ======================================================== */}
      {/* TEACHER CARDS GRID VIEW                                  */}
      {/* ======================================================== */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              onClick={() => onViewTeacher(teacher)}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              <div className="space-y-3.5">
                {/* Header: Profile Picture, Name, Specialization */}
                <div className="flex items-start gap-3.5">
                  {/* Profile Picture */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 shrink-0 bg-slate-100 shadow-xs">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(teacher.name)}`;
                      }}
                    />
                  </div>

                  {/* Name & Specialization */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-extrabold text-slate-900 text-base truncate group-hover:text-emerald-700 transition-colors">
                        {teacher.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        teacher.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {teacher.status === 'active' ? 'Active' : 'On Leave'}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 block mt-1">
                      {teacher.studentsCount || 0} Enrolled Students
                    </span>
                  </div>
                </div>

                {/* Assigned Circles & Study Times */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Assigned Halaqat & Study Times ({teacher.assignedGroups?.length || 0})
                  </span>
                  {teacher.assignedGroups && teacher.assignedGroups.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {teacher.assignedGroups.map((g) => (
                        <div
                          key={g.id}
                          className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-0.5"
                        >
                          <span className="font-bold text-slate-800 text-xs block truncate">
                            {getGroupDisplayName(g)}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                            <SessionTimeDisplay entry={g} className="truncate" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-400 italic">
                      No circles assigned yet
                    </div>
                  )}
                </div>

                {/* Direct Contact Phone Number & Email */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Contact Information
                  </span>
                  {teacher.phone ? (
                    <a
                      href={`tel:${teacher.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 hover:border-emerald-300 rounded-xl flex items-center justify-between text-xs transition-colors group/phone"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 group-hover/phone:scale-110 transition-transform" />
                        <span className="font-bold text-slate-900 font-mono">{teacher.phone}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        Call
                      </span>
                    </a>
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-xl text-xs text-slate-400 italic">
                      No phone number provided
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                <div className="flex items-center gap-1">
                  {/* Edit */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTeacher(teacher);
                    }}
                    title="Edit Teacher"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => handleDelete(teacher, e)}
                    disabled={deletingId === teacher.id}
                    title="Delete Teacher"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Teachers Found</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new teacher.
          </p>
          <button
            onClick={onAddTeacher}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            Add New Teacher
          </button>
        </div>
      )}
    </div>
  );
};
