import React from 'react';
import { X, UserCheck, Phone, Mail, Award, Clock, Users, Edit } from 'lucide-react';
import { Teacher, getGroupDisplayName } from '../../types';
import { ProfileImage } from '../common/ProfileImage';

interface TeacherViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onEdit: (teacher: Teacher) => void;
}

export const TeacherViewModal: React.FC<TeacherViewModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onEdit
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Banner (Solid Opaque Emerald/Slate) */}
        <div className="relative bg-emerald-950 text-white p-6 pb-8 border-b border-emerald-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-emerald-600 shadow-md shrink-0 bg-slate-800">
              <ProfileImage
                src={teacher.avatar}
                alt={teacher.name}
                className="w-full h-full object-center"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {teacher.name}
                </h1>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  teacher.status === 'active' ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}>
                  {teacher.status === 'active' ? 'Active Instructor' : 'On Leave'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                {teacher.phone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    {teacher.phone}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onEdit(teacher);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 self-start sm:self-center"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {teacher.bio && (
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Teacher Bio & Qualifications
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {teacher.bio}
              </p>
            </div>
          )}

          {/* Assigned Halaqat / Groups */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                Assigned Circles & Study Times ({teacher.assignedGroups?.length || 0})
              </span>
            </div>

            {teacher.assignedGroups && teacher.assignedGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teacher.assignedGroups.map((grp) => (
                  <div key={grp.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl hover:border-emerald-200 transition-colors shadow-xs">
                    <span className="font-bold text-slate-900 text-sm block mb-1">
                      {getGroupDisplayName(grp)}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{grp.studyTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No circles currently assigned.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
