import React from 'react';
import { BookOpen, Clock, Phone } from 'lucide-react';
import { Student } from '../../types';
import { calculateAge } from '../../lib/ageUtils';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  const targetJuz = student.targetJuz || 30;
  const memorized = student.memorizedJuzCount || 0;
  const progressPercent = Math.min(100, Math.round((memorized / targetJuz) * 100));

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'graduated':
        return 'متخرج';
      case 'paused':
        return 'موقوف مؤقتاً';
      default:
        return status;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4 text-right"
      dir="rtl"
    >
      <div className="space-y-4">
        {/* 1. Header: Tall Rectangle Avatar on Left, Details on Right */}
        <div className="flex items-start gap-3.5">
          <div className="flex-1 min-w-0 space-y-1 text-right">
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-extrabold text-slate-900 text-base truncate group-hover:text-emerald-700 transition-colors">
                {student.name}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                student.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {getStatusLabel(student.status)}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-0.5 text-right">
              <div className="font-semibold text-slate-800">
                الجنس: <span className="font-normal">{student.gender === 'male' ? 'طالب (ذكر)' : 'طالبة (أنثى)'}</span>
              </div>
              {calculateAge(student.dateOfBirth || student.age) !== null && (
                <div className="font-semibold text-slate-800">
                  العمر: <span className="font-normal">{calculateAge(student.dateOfBirth || student.age)} سنة</span>
                </div>
              )}
              <div className="text-[11px] text-slate-500 truncate">
                ولي الأمر: {student.parentName || 'غير متوفر'}
              </div>
            </div>
          </div>
          <img
            src={student.avatar}
            alt={student.name}
            referrerPolicy="no-referrer"
            className="w-20 sm:w-24 aspect-[3/4] rounded-2xl object-cover object-top shrink-0 bg-slate-100 ring-2 ring-emerald-600/20 shadow-xs"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('dicebear')) {
                target.src = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(student.name)}`;
              }
            }}
          />
        </div>

        {/* 2. Quran Memorization Progress */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>مستوى تقدم الحفظ</span>
            </span>
            <span className="font-bold text-slate-900 font-mono">
              {memorized} / {targetJuz} جزء <span className="text-emerald-700">({progressPercent}%)</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>

          {/* Current Bookmark */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
            <span>الحفظ الحالي: <strong>سورة {student.currentSurahName || 'الفاتحة'}</strong></span>
            <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
              آية {student.currentAyah || 1}
            </span>
          </div>
        </div>

        {/* 3. Study Circle & Parent Contact */}
        <div className="space-y-2 text-xs">
          {/* Circle */}
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              الحلقة:
            </span>
            <span className="font-bold text-slate-900 truncate max-w-[180px]">
              {student.group ? `حلقة رقم ${student.group.number} (${student.group.type})` : 'لم يتم التعيين لحلقة'}
            </span>
          </div>

          {/* Phone Contact Button */}
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              الهاتف:
            </span>
            {student.parentPhone ? (
              <a
                href={`tel:${student.parentPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/60 transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>{student.parentPhone}</span>
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
