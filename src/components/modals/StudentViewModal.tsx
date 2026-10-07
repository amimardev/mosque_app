import React from 'react';
import { X, User, Phone, Mail, Calendar, Users, Clock, Award, Star, Edit, Plus, CheckCircle2 } from 'lucide-react';
import { Student, getGroupDisplayName } from '../../types';
import { QURAN_SURAHS, getSurahByNumber } from '../../lib/quranData';
import { calculateAge } from '../../lib/ageUtils';
import { SessionTimeDisplay } from '../common/SessionTimeDisplay';

interface StudentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit: (student: Student) => void;
  onAddRating: (student: Student) => void;
}

export const StudentViewModal: React.FC<StudentViewModalProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
  onAddRating
}) => {
  if (!isOpen || !student) return null;

  const surahInfo = getSurahByNumber(student.currentSurahNumber);
  const totalQuranAyahs = 6236;
  const juzProgress = Math.min(100, Math.round(((student.memorizedJuzCount || 0) / 30) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
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
              <img
                src={student.avatar}
                alt={student.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(student.name)}`;
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {student.name}
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700">
                  المستوى: {student.level === 'primary' ? 'ابتدائي' : student.level === 'secondary' ? 'ثانوي' : 'متوسط'}
                </span>
                <span className="text-[11px] font-medium bg-slate-800 text-slate-200 px-2 py-0.5 rounded-full border border-slate-700">
                  {student.gender === 'male' ? 'Male (طالب)' : 'Female (طالبة)'}
                </span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
                {calculateAge(student.dateOfBirth || student.age) !== null && (
                  <span>{calculateAge(student.dateOfBirth || student.age)} سنة</span>
                )}
                {student.parentName && <span>Parent: {student.parentName}</span>}
                {student.parentPhone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    {student.parentPhone}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => {
                  onClose();
                  onAddRating(student);
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Award className="w-3.5 h-3.5" />
                Rate Progress
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Quran Progress Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <img src="/icon.png" alt="" className="w-4 h-4 object-contain" />
                  Current Memorization Progress
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-extrabold text-slate-900 font-sans">
                    Surah {student.currentSurahName || 'Al-Fatihah'}
                  </span>
                  <span className="text-sm font-arabic font-bold text-emerald-700">
                    ({surahInfo?.nameArabic || ''})
                  </span>
                  <span className="text-sm font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                    Ayah {student.currentAyah || 1} {surahInfo ? `/ ${surahInfo.totalAyahs}` : ''}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800">
                  {student.memorizedJuzCount || 0} of 30 Juz Memorized
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Target: {student.targetJuz || 30} Juz
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(juzProgress, 5)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Juz 1 (Start)</span>
                <span>{juzProgress}% of Complete Quran</span>
                <span>Juz 30 (Khatm)</span>
              </div>
            </div>
          </div>

          {/* Group & Study Schedule & Teachers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Halaqa & Study Schedule
              </span>
              {student.group ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {getGroupDisplayName(student.group)}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                      {student.group.level === 'primary' ? 'ابتدائي' : student.group.level === 'secondary' ? 'ثانوي' : 'متوسط'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Study Time: <SessionTimeDisplay entry={student.group} /></span>
                  </div>

                  {student.group.room && (
                    <span className="text-xs text-slate-600 block">
                      Room: {student.group.room}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No group assigned</p>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Assigned Teachers / Sheikhs
              </span>
              {student.group?.teachers && student.group.teachers.length > 0 ? (
                <div className="space-y-2">
                  {student.group.teachers.map((t) => (
                    <div key={t.id} className="flex items-center gap-2.5">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-slate-900 block">{t.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Assigned via group teacher allocation</p>
              )}
            </div>
          </div>

          {/* Monthly Ratings & Evaluations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                Monthly Performance & Ratings History
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onAddRating(student);
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Rating
              </button>
            </div>

            {student.ratings && student.ratings.length > 0 ? (
              <div className="space-y-3">
                {student.ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="p-4 bg-white border border-slate-200/80 rounded-2xl hover:border-emerald-200 transition-colors shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          Month: {rating.month}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {rating.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                        <span>Overall Score:</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                          {rating.overallScore} / 100
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 py-3 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-slate-500 text-[10px] block uppercase font-semibold">Hifz</span>
                        <span className="font-bold text-slate-900 text-sm">{rating.hifzScore}/100</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-slate-500 text-[10px] block uppercase font-semibold">Tajweed</span>
                        <span className="font-bold text-slate-900 text-sm">{rating.tajweedScore}/100</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-slate-500 text-[10px] block uppercase font-semibold">Muraja'ah</span>
                        <span className="font-bold text-slate-900 text-sm">{rating.murajaahScore}/100</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-slate-500 text-[10px] block uppercase font-semibold">Attendance</span>
                        <span className="font-bold text-slate-900 text-sm">{rating.attendanceScore}/100</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-slate-500 text-[10px] block uppercase font-semibold">Adab/Behavior</span>
                        <span className="font-bold text-slate-900 text-sm">{rating.behaviorScore}/100</span>
                      </div>
                    </div>

                    {(rating.surahEvaluated || rating.notes) && (
                      <div className="pt-2 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl space-y-1">
                        {rating.surahEvaluated && (
                          <p className="font-medium text-slate-800">
                            Evaluated on: <span className="font-semibold text-emerald-800">Surah {rating.surahEvaluated}</span> {rating.ayahStart && rating.ayahEnd ? `(Ayahs ${rating.ayahStart}-${rating.ayahEnd})` : ''}
                          </p>
                        )}
                        {rating.notes && <p className="italic text-slate-600">"{rating.notes}"</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <p className="text-xs text-slate-500 mb-2">No monthly evaluations recorded yet for this student.</p>
                <button
                  onClick={() => {
                    onClose();
                    onAddRating(student);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Record First Monthly Rating
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
