import React from 'react';
import { Clock, Phone } from 'lucide-react';
import { Teacher } from '../../types';
import { SessionTimeDisplay } from './SessionTimeDisplay';

interface TeacherCardProps {
  teacher: Teacher;
  onClick?: () => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4 text-right"
      dir="rtl"
    >
      <div className="space-y-4">
        {/* 1. Header: Tall Rectangle Avatar on Left, Sheikh Name & Specialization on Right */}
        <div className="flex items-start gap-3.5">
          <div className="flex-1 min-w-0 space-y-1 text-right">
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-extrabold text-slate-900 text-base truncate group-hover:text-emerald-700 transition-colors">
                {teacher.name}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                teacher.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {teacher.status === 'active' ? 'نشط' : 'في إجازة'}
              </span>
            </div>

            <p className="text-xs text-emerald-800 font-semibold line-clamp-2">
              {teacher.specialization}
            </p>

            <div className="text-[11px] text-slate-500 pt-1 text-right">
              البريد: {teacher.email || 'غير متوفر'}
            </div>
          </div>
          <img
            src={teacher.avatar}
            alt={teacher.name}
            referrerPolicy="no-referrer"
            className="w-20 sm:w-24 aspect-[3/4] rounded-2xl object-cover object-top shrink-0 bg-slate-100 ring-2 ring-emerald-600/20 shadow-xs"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('dicebear')) {
                target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(teacher.name)}`;
              }
            }}
          />
        </div>

        {/* 2. Assigned Circles & Meeting Times */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-right">
            الحلقات المسندة ({teacher.assignedGroups?.length || 0})
          </span>

          {teacher.assignedGroups && teacher.assignedGroups.length > 0 ? (
            <div className="space-y-1.5">
              {teacher.assignedGroups.map((g) => (
                <div key={g.id} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 truncate max-w-[170px] text-right">
                    حلقة رقم {g.number} ({g.type})
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <SessionTimeDisplay entry={g} />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic text-center">لا توجد حلقات مسندة بعد</p>
          )}
        </div>

        {/* 3. Contact Phone & Email */}
        <div className="space-y-2 text-xs">
          {/* Direct Phone Call Button */}
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              الهاتف:
            </span>
            {teacher.phone ? (
              <a
                href={`tel:${teacher.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>{teacher.phone}</span>
              </a>
            ) : (
              <span className="text-slate-400 text-[11px] italic">غير متوفر</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
