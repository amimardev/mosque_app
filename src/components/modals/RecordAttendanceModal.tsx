import React, { useState, useEffect, useMemo } from 'react';
import api from '@/lib/apiClient';
import { 
  X, Calendar, Clock, UserCheck, AlertCircle, 
  CheckCircle2, Save
} from 'lucide-react';
import { Group, Student, Teacher, AttendanceStatus } from '../../types';
import { calculateSessionDisplayTime } from '../../lib/prayerTimes';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';

interface RecordAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  teachers?: Teacher[];
  students?: Student[];
  onSuccess: () => Promise<void>;
}

interface StudentStatusState {
  studentId: string;
  name: string;
  avatar: string;
  status: AttendanceStatus;
  reason: string;
  isAssessed: boolean; // true = evaluated/saved, false = pending
}

export const RecordAttendanceModal: React.FC<RecordAttendanceModalProps> = ({
  isOpen,
  onClose,
  group,
  teachers = [] as Teacher[],
  students = [] as Student[],
  onSuccess
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [sessionTimeText, setSessionTimeText] = useState<string>(() => {
    return calculateSessionDisplayTime(group).displayText || group.studyTime || 'من صلاة العصر إلى صلاة المغرب';
  });
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    if (group.teachers && group.teachers.length > 0) {
      return group.teachers[0].id;
    }
    if (teachers && teachers.length > 0) {
      return teachers[0].id;
    }
    return '';
  });

  const [studentStates, setStudentStates] = useState<StudentStatusState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load group's students and existing attendance for selected date
  useEffect(() => {
    async function loadSessionStudents() {
      try {
        setIsLoading(true);
        setError('');

        // Get group students if not passed
        let groupStudents = students;
        if (!groupStudents || groupStudents.length === 0) {
          const res = await api.get('/api/students');
          const allStudents: Student[] = res.data.students || [];
          groupStudents = allStudents.filter(s => 
            s.groupId && s.groupId.split(',').map(item => item.trim()).includes(group.id)
          );
        } else {
          groupStudents = students.filter(s => 
            s.groupId && s.groupId.split(',').map(item => item.trim()).includes(group.id)
          );
        }

        // Fetch existing attendance records for this group & date
        const attRes = await api.get(`/api/attendances?groupId=${group.id}&date=${date}`).catch(() => ({ data: { attendances: [] } }));
        const existingAtts = attRes.data.attendances || [];
        const attMap = new Map<string, any>(existingAtts.map((a: any) => [a.studentId, a]));

        const initializedStates: StudentStatusState[] = groupStudents.map(s => {
          const existing = attMap.get(s.id);
          return {
            studentId: s.id,
            name: s.name,
            avatar: s.avatar,
            status: existing ? (existing.status as AttendanceStatus) : 'present',
            reason: existing?.reason || '',
            isAssessed: Boolean(existing) // If saved in DB, considered assessed; otherwise pending
          };
        });

        setStudentStates(initializedStates);
      } catch (err: any) {
        console.error('Failed to load session attendance data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      loadSessionStudents();
    }
  }, [isOpen, group.id, date]);

  const updateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setStudentStates(prev => prev.map(s => 
      s.studentId === studentId ? { ...s, status, isAssessed: true } : s
    ));
  };

  const setAllStatus = (newStatus: AttendanceStatus) => {
    setStudentStates(prev => prev.map(s => ({ ...s, status: newStatus, isAssessed: true })));
  };

  const updateStudentReason = (studentId: string, reason: string) => {
    setStudentStates(prev => prev.map(s => 
      s.studentId === studentId ? { ...s, reason, isAssessed: true } : s
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (studentStates.length === 0) {
      setError('لا يوجد طلاب مسجلون في هذه الحلقة لتسجيل الحضور والغياب.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      await api.post('/api/attendances/bulk', {
        groupId: group.id,
        date,
        sessionTimeText,
        recordedByTeacherId: selectedTeacherId || null,
        records: studentStates.map(s => ({
          studentId: s.studentId,
          status: s.status,
          reason: s.reason
        }))
      });

      const absentCount = studentStates.filter(s => s.status === 'absent').length;
      setSuccessMsg(`تم حفظ سجل الحضور والغياب بنجاح! (${absentCount} غائبين من أصل ${studentStates.length})`);
      await onSuccess();
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      console.error('Failed to save attendance:', err);
      setError(err.response?.data?.error || err.message || 'فشل في حفظ سجل الحضور والغياب');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sorted list: ALWAYS show non-assessed (pending) students at the top of the list!
  const sortedStudents = useMemo(() => {
    return [...studentStates].sort((a, b) => {
      const aVal = a.isAssessed ? 1 : 0;
      const bVal = b.isAssessed ? 1 : 0;
      if (aVal !== bVal) {
        return aVal - bVal;
      }
      return a.name.localeCompare(b.name);
    });
  }, [studentStates]);

  const assessedCount = studentStates.filter(s => s.isAssessed).length;
  const pendingCount = studentStates.length - assessedCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              تسجيل الحضور والغياب • حلقة رقم {group.number}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span>إجمالي الطلاب: {studentStates.length}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">تم الرصد: {assessedCount}</span>
              <span>•</span>
              <span className="text-amber-700 font-bold">في الانتظار: {pendingCount}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 w-full p-6">
            <div className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Session Meta Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-xs text-slate-700 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>تاريخ الحصة:</span>
                  </FormLabel>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white font-mono text-xs"
                  />
                </FormItem>

                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-xs text-slate-700 font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>توقيت الحصة:</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={sessionTimeText}
                    onChange={(e) => setSessionTimeText(e.target.value)}
                    placeholder="من صلاة العصر إلى صلاة المغرب"
                    className="bg-white text-xs"
                  />
                </FormItem>

                <FormItem>
                  <FormLabel className="flex items-center gap-1 text-xs text-slate-700 font-bold">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>المعلم:</span>
                  </FormLabel>
                  <Select
                    value={selectedTeacherId}
                    onValueChange={setSelectedTeacherId}
                  >
                    <SelectTrigger className="w-full bg-white text-right text-xs">
                      <SelectValue placeholder="اختر المعلم" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 font-medium text-xs">قائمة طلاب الحلقة:</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAllStatus('present')}
                    className="h-7 text-xs rounded-lg"
                  >
                    تحديد الكل حاضر
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAllStatus('absent')}
                    className="h-7 text-xs rounded-lg"
                  >
                    تحديد الكل غائب
                  </Button>
                </div>
              </div>

              {/* Clean Students Table for Desktop & Cards for Mobile */}
              {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-400 font-medium">
                  جاري تحميل طلاب الحلقة...
                </div>
              ) : sortedStudents.length > 0 ? (
                <div>
                  {/* Desktop Table View */}
                  <div className="hidden md:block rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-right text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="py-2.5 px-4">صورة واسم الطالب</th>
                          <th className="py-2.5 px-4 text-center">حالة التقييم</th>
                          <th className="py-2.5 px-4">حالة الحضور</th>
                          <th className="py-2.5 px-4">سبب الغياب / العذر</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {sortedStudents.map((st) => {
                          const isAbsent = st.status === 'absent';
                          const isExcused = st.status === 'excused';
                          const isAssessed = st.isAssessed;

                          return (
                            <tr key={st.studentId} className="hover:bg-slate-50/50 transition-colors">
                              {/* 1. Student Picture & Name */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={st.avatar}
                                    alt={st.name}
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                  />
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                    {st.name}
                                  </span>
                                </div>
                              </td>

                              {/* 2. Assessment Status Column with Icon */}
                              <td className="py-3 px-4 text-center">
                                {isAssessed ? (
                                  <div className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>تم الرصد</span>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1 text-amber-700 font-bold">
                                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>في الانتظار</span>
                                  </div>
                                )}
                              </td>

                              {/* 3. Attendance Status Choice */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  {[
                                    { value: 'present', label: 'حاضر' },
                                    { value: 'absent', label: 'غائب' },
                                    { value: 'late', label: 'متأخر' },
                                    { value: 'excused', label: 'بعذر' }
                                  ].map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => updateStudentStatus(st.studentId, opt.value as AttendanceStatus)}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-colors cursor-pointer ${
                                      st.status === opt.value && isAssessed
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                  ))}
                                </div>
                              </td>

                              {/* 4. Reason Input if Absent/Excused */}
                              <td className="py-3 px-4">
                                {(isAbsent || isExcused) ? (
                                  <Input
                                    type="text"
                                    value={st.reason}
                                    onChange={(e) => updateStudentReason(st.studentId, e.target.value)}
                                    placeholder={isExcused ? 'أدخل العذر...' : 'السبب (اختياري)...'}
                                    className="h-8 text-xs bg-slate-50"
                                  />
                                ) : (
                                  <span className="text-slate-400 text-[11px]">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="block md:hidden space-y-2.5">
                    {sortedStudents.map((st) => {
                      const isAbsent = st.status === 'absent';
                      const isExcused = st.status === 'excused';
                      const isAssessed = st.isAssessed;

                      return (
                        <div
                          key={st.studentId}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 text-xs"
                        >
                          {/* Card Header: Picture, Name & Assessment Status Icon */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={st.avatar}
                                alt={st.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <span className="font-bold text-slate-900 text-xs">
                                {st.name}
                              </span>
                            </div>

                            {/* Assessment Status Icon */}
                            {isAssessed ? (
                              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>تم الرصد</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>في الانتظار</span>
                              </div>
                            )}
                          </div>

                          {/* Card Body: Attendance Status Choice */}
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            <div className="grid grid-cols-4 gap-1">
                              {[
                                { value: 'present', label: 'حاضر' },
                                { value: 'absent', label: 'غائب' },
                                { value: 'late', label: 'متأخر' },
                                { value: 'excused', label: 'بعذر' }
                              ].map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => updateStudentStatus(st.studentId, opt.value as AttendanceStatus)}
                                  className={`py-1 text-center text-xs font-bold rounded-md border transition-colors cursor-pointer ${
                                    st.status === opt.value && isAssessed
                                      ? 'bg-slate-900 text-white border-slate-900'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>

                            {/* Reason Input if Absent/Excused */}
                            {(isAbsent || isExcused) && (
                              <Input
                                type="text"
                                value={st.reason}
                                onChange={(e) => updateStudentReason(st.studentId, e.target.value)}
                                placeholder={isExcused ? 'أدخل عذر الغياب...' : 'سبب الغياب (اختياري)...'}
                                className="h-7 text-xs bg-slate-50"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  لا يوجد طلاب مسجلون في هذه الحلقة.
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-start gap-2 bg-slate-50 shrink-0">
            <Button
              type="submit"
              disabled={isSubmitting || studentStates.length === 0}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'جاري حفظ السجل...' : 'حفظ سجل الحضور والغياب'}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg text-xs"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
