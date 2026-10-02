import React, { useState, useEffect, useMemo } from 'react';
import api from '@/lib/apiClient';
import { useForm } from '@tanstack/react-form';
import { 
  Users, Clock, Award, Save, ArrowRight, Check, 
  Search, X, UserMinus, Plus, ShieldCheck, UserCheck,
  Calendar, RotateCcw, ArrowLeftRight
} from 'lucide-react';
import { 
  Group, Teacher, Student, GroupType, 
  GroupSessionTime, formatSessionTimeArabic 
} from '../../types';
import { SessionTimePicker } from './SessionTimePicker';
import { calculateSessionDisplayTime } from '../../lib/prayerTimes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';

interface GroupFormProps {
  initialData?: Group | null;
  teachers: Teacher[];
  students?: Student[];
  groupTypes?: GroupType[];
  preselectedTypeId?: string;
  onSave: (groupData: Partial<Group> & { 
    teacherIds?: string[]; 
    studentIds?: string[]; 
    typeId?: string;
    sessionTime?: GroupSessionTime;
  }) => Promise<void>;
  onCancel: () => void;
  title: string;
  subtitle: string;
}

const COMMON_DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DAY_TRANSLATIONS: Record<string, string> = {
  'Saturday': 'السبت',
  'Sunday': 'الأحد',
  'Monday': 'الاثنين',
  'Tuesday': 'الثلاثاء',
  'Wednesday': 'الأربعاء',
  'Thursday': 'الخميس',
  'Friday': 'الجمعة',
};

const DEFAULT_STUDENTS: Student[] = [];
const DEFAULT_GROUP_TYPES: GroupType[] = [];

export const GroupForm: React.FC<GroupFormProps> = ({
  initialData,
  teachers,
  students = DEFAULT_STUDENTS,
  groupTypes = DEFAULT_GROUP_TYPES,
  preselectedTypeId,
  onSave,
  onCancel,
  title,
  subtitle
}) => {
  const [availableTypes, setAvailableTypes] = useState<GroupType[]>(groupTypes);
  const [availableStudents, setAvailableStudents] = useState<Student[]>(students);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Search overlays state
  const [showTeacherSearch, setShowTeacherSearch] = useState(false);
  const [teacherQuery, setTeacherQuery] = useState('');
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [studentQuery, setStudentQuery] = useState('');

  // Sync group types once or when prop changes
  useEffect(() => {
    let isMounted = true;
    if (groupTypes && groupTypes.length > 0) {
      setAvailableTypes(groupTypes);
      return;
    }

    async function loadGroupTypes() {
      try {
        const res = await api.get('/api/group-types');
        if (!isMounted) return;
        setAvailableTypes(res.data.groupTypes || []);
      } catch (e) {
        console.error('Failed to load group types:', e);
      }
    }
    loadGroupTypes();
    return () => { isMounted = false; };
  }, [groupTypes.length]);

  // Load students for search if not passed
  useEffect(() => {
    let isMounted = true;
    if (students && students.length > 0) {
      setAvailableStudents(students);
      return;
    }

    async function loadAllStudents() {
      try {
        const res = await api.get('/api/students');
        if (!isMounted) return;
        setAvailableStudents(res.data.students || []);
      } catch (e) {
        console.error('Failed to load students for group form:', e);
      }
    }
    loadAllStudents();
    return () => { isMounted = false; };
  }, [students.length]);

  // Initial values setup
  const initialTypeId = preselectedTypeId || initialData?.typeId || (availableTypes[0]?.id || '');
  const initialStudentIds = initialData?.id && students.length > 0 
    ? students.filter(s => s.groupId && s.groupId.split(',').map(id => id.trim()).includes(initialData.id)).map(s => s.id)
    : [];

  const form = useForm({
    defaultValues: {
      typeId: initialTypeId,
      number: initialData?.number ? String(initialData.number) : '',
      gender: (initialData?.gender || 'male') as 'male' | 'female',
      level: initialData?.level || 'Intermediate',
      room: initialData?.room || 'قاعة المحراب الرئيسية',
      capacity: initialData?.capacity ? Number(initialData.capacity) : 20,
      days: initialData?.days || ['Monday', 'Wednesday', 'Saturday'],
      sessionTime: {
        startType: initialData?.sessionTime?.startType || 'prayer',
        startTime: initialData?.sessionTime?.startTime || '16:30',
        startPrayer: initialData?.sessionTime?.startPrayer || 'asr',
        startOffsetHours: initialData?.sessionTime?.startOffsetHours ?? 0,
        endType: initialData?.sessionTime?.endType || 'prayer',
        endTime: initialData?.sessionTime?.endTime || '18:00',
        endPrayer: initialData?.sessionTime?.endPrayer || 'maghrib',
        endOffsetHours: initialData?.sessionTime?.endOffsetHours ?? 0,
      } as GroupSessionTime,
      teacherIds: (initialData?.teachers ? initialData.teachers.map(t => t.id) : []) as string[],
      studentIds: initialStudentIds as string[]
    },
    onSubmit: async ({ value }) => {
      if (!value.number.trim()) {
        setError('رقم الحلقة مطلوب');
        return;
      }
      if (!value.typeId) {
        setError('يرجى اختيار نوع ومسار الحلقة الدراسية من القائمة');
        return;
      }
      if (value.days.length === 0) {
        setError('يرجى اختيار يوم واحد على الأقل من أيام الدراسة');
        return;
      }

      setIsSubmitting(true);
      setError('');

      const matchedType = availableTypes.find(t => t.id === value.typeId);
      const computedDisplay = calculateSessionDisplayTime(value.sessionTime);

      try {
        await onSave({
          number: Number(value.number),
          typeId: value.typeId,
          type: matchedType?.name || initialData?.type || 'عام',
          gender: value.gender,
          level: value.level,
          room: value.room.trim() || undefined,
          capacity: Number(value.capacity) || 20,
          days: value.days,
          studyTime: computedDisplay.displayText || formatSessionTimeArabic(value.sessionTime),
          timeSlot: computedDisplay.timeSlot,
          sessionTime: value.sessionTime,
          teacherIds: value.teacherIds,
          studentIds: value.studentIds
        });
      } catch (err: any) {
        setError(err.message || 'فشل في حفظ بيانات الحلقة القرآنية');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right pb-16" dir="rtl">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onCancel}
            className="rounded-xl shadow-2xs"
            title="الرجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => form.handleSubmit()}
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ بيانات الحلقة'}</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Main Form Layout */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-8"
      >
        {/* 1. Basic Group Settings */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>1. الهوية والمسار الدراسي للحلقة</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Group Type / Pathway */}
            <form.Field
              name="typeId"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>المسار / نوع الحلقة القرآنية <span className="text-rose-500">*</span></FormLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} className="w-full bg-white text-right">
                      <SelectValue placeholder="اختر المسار الدراسي..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Group Number */}
            <form.Field
              name="number"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>رقم الحلقة <span className="text-rose-500">*</span></FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="مثال: 1, 2, 3..."
                    className="text-right font-mono font-bold"
                  />
                </FormItem>
              )}
            />

            {/* Gender Audience */}
            <form.Field
              name="gender"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>الفئة المستهدفة (الجنس) <span className="text-rose-500">*</span></FormLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: 'male' | 'female') => field.handleChange(val)}
                  >
                    <SelectTrigger id={field.name} className="w-full bg-white text-right">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">حلقة ذكور (رجال وأشبال)</SelectItem>
                      <SelectItem value="female">حلقة إناث (نساء وفتيات)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Level */}
            <form.Field
              name="level"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>المستوى التعليمي</FormLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} className="w-full bg-white text-right">
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">مبتدئ (تلقين وتأسيس)</SelectItem>
                      <SelectItem value="Intermediate">متوسط (حفظ وتثبيت)</SelectItem>
                      <SelectItem value="Advanced">متقدم (ضبط المتشابهات)</SelectItem>
                      <SelectItem value="Ijazah & Sanad">إجازة وسند متصل</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Room */}
            <form.Field
              name="room"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>القاعة / مكان التسميع</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="مثال: قاعة المحراب، الرواق الغربي..."
                    className="text-right"
                  />
                </FormItem>
              )}
            />

            {/* Capacity */}
            <form.Field
              name="capacity"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>الحد الأقصى للطلاب (السعة الاستيعابية)</FormLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={1}
                    max={100}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="text-right font-mono font-bold"
                  />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 2. Structured Session Time & Study Schedule */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>2. التوقيت الزمني وأيام انعقاد الحلقات</span>
          </h2>

          <form.Field
            name="sessionTime"
            children={(field) => (
              <SessionTimePicker
                value={field.state.value}
                onChange={(updated) => field.handleChange(updated)}
                showPreview={true}
                label="جدولة مواعيد الحصة (مرتبطة بالصلوات أو ساعات دقيقة)"
              />
            )}
          />

          {/* Days Selection Chips */}
          <form.Field
            name="days"
            children={(field) => {
              const currentDays = field.state.value;
              const toggleDay = (d: string) => {
                if (currentDays.includes(d)) {
                  field.handleChange(currentDays.filter(item => item !== d));
                } else {
                  field.handleChange([...currentDays, d]);
                }
              };

              return (
                <div className="space-y-2 pt-2">
                  <FormLabel>أيام الدراسة الأسبوعية <span className="text-rose-500">*</span></FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {COMMON_DAYS.map((d) => {
                      const isSelected = currentDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleDay(d)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {DAY_TRANSLATIONS[d] || d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          />
        </div>

        {/* 3. Assigned Teachers */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>3. الشيوخ والمعلمون المسندون</span>
            </h2>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTeacherSearch(true)}
              className="gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إسناد شيخ / معلم</span>
            </Button>
          </div>

          <form.Field
            name="teacherIds"
            children={(field) => {
              const currentIds = field.state.value;
              const assignedTeachers = teachers.filter(t => currentIds.includes(t.id));

              const removeTeacher = (id: string) => {
                field.handleChange(currentIds.filter(i => i !== id));
              };

              return assignedTeachers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assignedTeachers.map((t) => (
                    <div key={t.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-900 truncate">{t.name}</span>
                          <span className="block text-[10px] text-slate-500 truncate">{t.specialization}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeacher(t.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="إلغاء الإسناد"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  لم يتم إسناد شيوخ لهذه الحلقة بعد. اضغط "إسناد شيخ" للإضافة.
                </div>
              );
            }}
          />
        </div>

        {/* 4. Enrolled Students */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>4. الطلاب المسجلون في الحلقة</span>
            </h2>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowStudentSearch(true)}
              className="gap-1.5 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل طالب</span>
            </Button>
          </div>

          <form.Field
            name="studentIds"
            children={(field) => {
              const currentIds = field.state.value;
              const assignedStudents = availableStudents.filter(s => currentIds.includes(s.id));

              const removeStudent = (id: string) => {
                field.handleChange(currentIds.filter(i => i !== id));
              };

              return assignedStudents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {assignedStudents.map((s) => (
                    <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-900 truncate">{s.name}</span>
                          <span className="block text-[10px] text-slate-500 truncate">سورة {s.currentSurahName} ({s.currentAyah})</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStudent(s.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="إلغاء التسجيل"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  لا يوجد طلاب مسجلون في هذه الحلقة حالياً. اضغط "تسجيل طالب" للإضافة.
                </div>
              );
            }}
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="rounded-xl"
          >
            إلغاء
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ بيانات الحلقة'}</span>
          </Button>
        </div>
      </form>

      {/* OVERLAY 1: TEACHER SEARCH MODAL */}
      {showTeacherSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                <span>إسناد شيخ أو معلم للحلقة</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowTeacherSearch(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Input
                  type="text"
                  value={teacherQuery}
                  onChange={(e) => setTeacherQuery(e.target.value)}
                  placeholder="ابحث عن الشيخ بالاسم الكامل..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const currentTeacherIds = form.getFieldValue('teacherIds');
                const matchedTeachers = teachers.filter(t => 
                  t.name.toLowerCase().includes(teacherQuery.toLowerCase()) &&
                  !currentTeacherIds.includes(t.id)
                );

                if (matchedTeachers.length === 0) {
                  return (
                    <div className="py-8 text-center text-xs text-slate-400 italic font-semibold">
                      {teacherQuery ? "لم يتم العثور على شيوخ بهذا الاسم." : "اكتب الاسم الكامل للبحث وتصفية النتائج."}
                    </div>
                  );
                }

                return matchedTeachers.map(teacher => (
                  <div
                    key={teacher.id}
                    onClick={() => {
                      form.setFieldValue('teacherIds', [...currentTeacherIds, teacher.id]);
                      setShowTeacherSearch(false);
                    }}
                    className="p-3 bg-slate-50 border border-slate-150 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200/80 shadow-2xs"
                      />
                      <div className="text-right min-w-0">
                        <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors truncate">{teacher.name}</span>
                        <span className="block text-[10px] text-slate-500 font-medium truncate">{teacher.specialization}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      إسناد للحلقة +
                    </span>
                  </div>
                ));
              })()}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowTeacherSearch(false)}
                className="rounded-xl"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 2: STUDENT SEARCH MODAL */}
      {showStudentSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="text-right">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-600" />
                  <span>تسجيل طالب جديد في هذه الحلقة</span>
                </h2>
                <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>تصفية الأمان: يتم إظهار {form.getFieldValue('gender') === 'male' ? 'الطلاب الذكور' : 'الطالبات الإناث'} فقط تلقائياً.</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentSearch(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Input
                  type="text"
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  placeholder="ابحث عن الطالب بالاسم الكامل..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const currentStudentIds = form.getFieldValue('studentIds');
                const currentGender = form.getFieldValue('gender');
                const matchedStudents = availableStudents.filter(s => 
                  s.gender === currentGender &&
                  s.name.toLowerCase().includes(studentQuery.toLowerCase()) &&
                  !currentStudentIds.includes(s.id)
                );

                if (matchedStudents.length === 0) {
                  return (
                    <div className="py-8 text-center text-xs text-slate-400 italic font-semibold">
                      {studentQuery ? "لم يتم العثور على طلاب بهذا الاسم متوافقين مع جنس الحلقة." : "اكتب الاسم الكامل للطالب للبحث وتصفية النتائج."}
                    </div>
                  );
                }

                return matchedStudents.map(student => (
                  <div
                    key={student.id}
                    onClick={() => {
                      form.setFieldValue('studentIds', [...currentStudentIds, student.id]);
                      setShowStudentSearch(false);
                    }}
                    className="p-3 bg-slate-50 border border-slate-150 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={student.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400"}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200/80 shadow-2xs"
                      />
                      <div className="text-right min-w-0">
                        <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors truncate">{student.name}</span>
                        <span className="block text-[10px] text-slate-500 font-medium truncate">سورة {student.currentSurahName} (آية {student.currentAyah})</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      تسجيل في الحلقة +
                    </span>
                  </div>
                ));
              })()}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowStudentSearch(false)}
                className="rounded-xl"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
