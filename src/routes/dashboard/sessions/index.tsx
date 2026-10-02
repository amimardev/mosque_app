import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '@/lib/apiClient';
import { 
  Calendar as CalendarIcon, List, Clock, Filter, X, Search, 
  ChevronRight, ChevronLeft, AlertCircle, RefreshCw, CalendarRange,
  CheckCircle2, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DatePicker } from '../../../components/ui/date-picker';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { SessionTimeDisplay } from '../../../components/common/SessionTimeDisplay';

export const Route = createFileRoute('/dashboard/sessions/')({
  component: SessionsListPage,
});

interface Session {
  id: string;
  groupId: string;
  teacherId: string | null;
  sessionType: 'main' | 'exception';
  date: string;
  startTime: string;
  endTime: string;
  sessionTimeText: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
  groupStudyTime?: string;
  level?: string;
  room?: string;
  groupNumber?: number;
  teacherName?: string;
  teacherAvatar?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function SessionsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // View Mode: calendar vs list
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Shared Data State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Calendar state: offset in weeks from current week
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // List Mode Pagination & Filter State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  // Date Filter State for List Mode
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
  
  // Temporary state for the date filter dialog
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');

  // Search & Status filter for List Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  // Compute start and end date for current calendar week
  const currentWeekRange = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (currentWeekOffset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startStr = startOfWeek.toISOString().split('T')[0];
    const endStr = endOfWeek.toISOString().split('T')[0];

    const arabDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const days: Array<{ dayName: string; dateStr: string; isToday: boolean }> = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        dayName: arabDays[i],
        dateStr,
        isToday: dateStr === today.toISOString().split('T')[0]
      });
    }

    return {
      startDate: startStr,
      endDate: endStr,
      days
    };
  }, [currentWeekOffset]);

  // Fetch sessions for Calendar Mode (only current week)
  const fetchCalendarSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await api.get('/api/sessions', {
        params: {
          startDate: currentWeekRange.startDate,
          endDate: currentWeekRange.endDate
        }
      });
      setSessions(res.data.sessions || []);
      setPagination(null);
    } catch (err: any) {
      console.error('Failed to load calendar sessions:', err);
      setError('فشل في جلب حصص الأسبوع المحدد');
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekRange.startDate, currentWeekRange.endDate]);

  // Fetch sessions for List Mode (paginated & filtered)
  const fetchListSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: Record<string, any> = {
        page,
        limit
      };

      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/api/sessions', { params });
      setSessions(res.data.sessions || []);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err: any) {
      console.error('Failed to load list sessions:', err);
      setError('فشل في جلب قائمة الحصص المفلترة');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filterStartDate, filterEndDate, searchQuery, statusFilter]);

  // Load data based on viewMode
  useEffect(() => {
    if (!user) return;
    if (viewMode === 'calendar') {
      fetchCalendarSessions();
    } else {
      fetchListSessions();
    }
  }, [viewMode, fetchCalendarSessions, fetchListSessions, user]);

  const handleOpenSession = (session: Session) => {
    navigate({
      to: '/dashboard/sessions/$sessionId',
      params: { sessionId: session.id },
    });
  };

  // Date Filter Dialog Handlers
  const handleOpenDateFilterModal = () => {
    setTempStartDate(filterStartDate);
    setTempEndDate(filterEndDate);
    setIsDateFilterModalOpen(true);
  };

  const handleApplyDateFilter = () => {
    setFilterStartDate(tempStartDate);
    setFilterEndDate(tempEndDate);
    setPage(1); // Reset to page 1 on new filter
    setIsDateFilterModalOpen(false);
  };

  const handleClearDateFilter = () => {
    setTempStartDate('');
    setTempEndDate('');
    setFilterStartDate('');
    setFilterEndDate('');
    setPage(1);
    setIsDateFilterModalOpen(false);
  };

  // Quick Preset Filters
  const applyPreset = (preset: 'today' | 'this_week' | 'this_month' | 'last_30_days') => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'today') {
      setTempStartDate(todayStr);
      setTempEndDate(todayStr);
    } else if (preset === 'this_week') {
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      setTempStartDate(startOfWeek.toISOString().split('T')[0]);
      setTempEndDate(endOfWeek.toISOString().split('T')[0]);
    } else if (preset === 'this_month') {
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const startOfMonth = `${y}-${m}-01`;
      const lastDay = new Date(y, today.getMonth() + 1, 0).getDate();
      const endOfMonth = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
      setTempStartDate(startOfMonth);
      setTempEndDate(endOfMonth);
    } else if (preset === 'last_30_days') {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      setTempStartDate(past.toISOString().split('T')[0]);
      setTempEndDate(todayStr);
    }
  };

  const hasActiveDateFilter = Boolean(filterStartDate || filterEndDate);

  const formatArabicDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
  };

  const getActiveFilterLabel = () => {
    if (filterStartDate && filterEndDate) {
      if (filterStartDate === filterEndDate) {
        return `تاريخ: ${filterStartDate}`;
      }
      return `${filterStartDate} إلى ${filterEndDate}`;
    }
    if (filterStartDate) return `من ${filterStartDate}`;
    if (filterEndDate) return `حتى ${filterEndDate}`;
    return 'تصفية بالتاريخ';
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* Header Cards & Title with Controls in the same line */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-600" />
            <span>الحصص واللقاءات اليومية</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            جدول اللقاءات، وتوثيق مقدار الحفظ الفردي والملاحظات والحضور اليومي.
          </p>
        </div>

        {/* Controls Area: Datepicker Filter Button (in list mode) + View Mode Toggle */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {/* DATE FILTER BUTTON (Active in List Display Mode) */}
          {viewMode === 'list' && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleOpenDateFilterModal}
                className={`h-9 px-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  hasActiveDateFilter
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs hover:bg-emerald-100/70'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CalendarRange className={`w-4 h-4 ${hasActiveDateFilter ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span className="truncate max-w-[160px]">{getActiveFilterLabel()}</span>
                {hasActiveDateFilter && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                )}
              </button>

              {/* Quick Cancel Filter Button */}
              {hasActiveDateFilter && (
                <button
                  type="button"
                  onClick={handleClearDateFilter}
                  className="h-9 w-9 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center transition-all cursor-pointer"
                  title="إلغاء تصفية التاريخ"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* View Mode Toggle: Calendar vs List */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>عرض التقويم</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>عرض القائمة</span>
            </button>
          </div>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. CALENDAR VIEW (Fetches only current week) */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          {/* Calendar Week Navigator */}
          <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setCurrentWeekOffset(o => o + 1)}
              className="p-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="الأسبوع القادم"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="hidden sm:inline">الأسبوع القادم</span>
            </button>

            <div className="text-center">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                {currentWeekOffset === 0 ? 'الأسبوع الحالي' : currentWeekOffset === -1 ? 'الأسبوع الماضي' : currentWeekOffset === 1 ? 'الأسبوع القادم' : `أسبوع (${currentWeekOffset > 0 ? '+' : ''}${currentWeekOffset})`}
              </span>
              <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                {formatArabicDate(currentWeekRange.startDate)} — {formatArabicDate(currentWeekRange.endDate)}
              </span>
            </div>

            <button
              onClick={() => setCurrentWeekOffset(o => o - 1)}
              className="p-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="الأسبوع الماضي"
            >
              <span className="hidden sm:inline">الأسبوع الماضي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-slate-500 font-bold bg-white rounded-3xl border border-slate-100 shadow-xs">
              جاري تحميل حصص الأسبوع المحدد...
            </div>
          ) : (
            <>
              {/* Desktop Mode (Large screens, row-based) */}
              <div className="hidden lg:flex flex-col gap-4">
                {currentWeekRange.days.map((day) => {
                  const daySessions = sessions.filter(s => s.date === day.dateStr);

                  return (
                    <div 
                      key={day.dateStr} 
                      className={`bg-white rounded-3xl border p-4 flex items-center justify-between gap-6 transition-all ${
                        day.isToday ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/10' : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Date Row Header */}
                      <div className={`p-4 rounded-2xl w-36 text-center shrink-0 ${
                        day.isToday ? 'bg-emerald-600 text-white' : 'bg-slate-50 border border-slate-100'
                      }`}>
                        <span className="block text-sm font-extrabold">{day.dayName}</span>
                        <span className={`text-[11px] font-mono font-bold block mt-0.5 ${
                          day.isToday ? 'text-emerald-100' : 'text-slate-400'
                        }`}>
                          {day.dateStr}
                        </span>
                      </div>

                      {/* Sessions List in the Center Row */}
                      <div className="flex-1 flex flex-wrap gap-3 items-center">
                        {daySessions.length === 0 ? (
                          <span className="text-xs text-slate-400 font-bold italic">لا توجد حصص مجدولة لهذا اليوم</span>
                        ) : (
                          daySessions.map((session) => {
                            const isException = session.sessionType === 'exception';
                            return (
                              <button
                                key={session.id}
                                onClick={() => handleOpenSession(session)}
                                className={`text-right p-3.5 rounded-2xl border transition-all text-xs cursor-pointer min-w-[200px] max-w-[280px] shadow-2xs hover:shadow-xs flex-1 ${
                                  isException 
                                    ? 'bg-amber-50 border-amber-200 text-amber-950' 
                                    : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100/50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3 mb-1">
                                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold ${
                                    isException ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {isException ? 'استثنائية' : 'أساسية'}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-500 font-bold">
                                    <SessionTimeDisplay entry={session} format="slot" />
                                  </span>
                                </div>
                                <div className="font-extrabold text-slate-900 truncate">
                                  حلقة رقم {session.groupNumber} ({session.level})
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium mt-1 truncate">
                                  المعلم: {session.teacherName || 'غير محدد'}
                                </div>
                                <div className="mt-2.5 flex justify-between items-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    session.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    {session.status === 'completed' ? 'تم الرصد' : 'مجدولة'}
                                  </span>
                                  <span className="text-[9px] text-emerald-700 font-bold hover:underline">رصد وتقييم الحصة ←</span>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tablet & Mobile Mode (Stacked style for screens smaller than lg) */}
              <div className="lg:hidden flex flex-col gap-4">
                {currentWeekRange.days.map((day) => {
                  const daySessions = sessions.filter(s => s.date === day.dateStr);

                  return (
                    <div 
                      key={day.dateStr} 
                      className={`bg-white rounded-2xl border p-4 flex flex-col gap-3 ${
                        day.isToday ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/10' : 'border-slate-200/80'
                      }`}
                    >
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-extrabold ${day.isToday ? 'text-emerald-800' : 'text-slate-800'}`}>
                            {day.dayName}
                          </span>
                          {day.isToday && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">اليوم</span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-slate-400 font-bold">{day.dateStr}</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {daySessions.length === 0 ? (
                          <span className="text-xs text-slate-400 font-bold text-center py-4">لا توجد حصص مجدولة</span>
                        ) : (
                          daySessions.map((session) => {
                            const isException = session.sessionType === 'exception';
                            return (
                              <button
                                key={session.id}
                                onClick={() => handleOpenSession(session)}
                                className={`text-right p-3 rounded-xl border transition-all text-xs cursor-pointer flex items-center justify-between gap-4 ${
                                  isException 
                                    ? 'bg-amber-50 border-amber-200 text-amber-950' 
                                    : 'bg-slate-50 border-slate-150'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="font-extrabold text-slate-900">
                                    حلقة {session.groupNumber} ({session.level})
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    المعلم: {session.teacherName || 'غير محدد'}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  <span className="font-mono text-[10px] text-slate-500 font-bold">
                                    <SessionTimeDisplay entry={session} format="slot" />
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                    session.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    {session.status === 'completed' ? 'تم الرصد' : 'مجدولة'}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. LIST VIEW (Paginated with backend date & text filters) */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* List Toolbar: Search & Quick Status Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="بحث برقم الحلقة، المعلم، المستوى..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pr-9 text-xs bg-slate-50 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-500 font-bold">الحالة:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { value: 'all', label: 'الكل' },
                  { value: 'scheduled', label: 'مجدولة' },
                  { value: 'completed', label: 'مكتملة' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(opt.value as any);
                      setPage(1);
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      statusFilter === opt.value
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sessions List Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {isLoading ? (
              <div className="py-20 text-center text-slate-500 font-bold">
                جاري تحميل قائمة الحصص...
              </div>
            ) : (
              <>
                {/* Mobile Responsive Cards View */}
                <div className="md:hidden space-y-3 p-3 sm:p-4 bg-slate-50/50">
                  {sessions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-bold text-xs bg-white rounded-2xl border border-slate-200">
                      {hasActiveDateFilter ? 'لا توجد حصص في نطاق التاريخ المحدد' : 'لا توجد حصص مسجلة حالياً'}
                    </div>
                  ) : (
                    sessions.map((session) => {
                      const isException = session.sessionType === 'exception';
                      return (
                        <div key={session.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3 text-right">
                          {/* Header row: Date & Badges */}
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                                <CalendarIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 text-xs block">{formatArabicDate(session.date)}</span>
                                <span className="text-[10px] font-mono font-bold text-slate-400 block">{session.date}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isException ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {isException ? 'استثنائية' : 'أساسية'}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                session.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700'
                              }`}>
                                {session.status === 'completed' ? 'مكتملة' : 'مجدولة'}
                              </span>
                            </div>
                          </div>

                          {/* Group & Teacher Info */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">الحلقة والمساق:</span>
                              <span className="font-bold text-slate-900 block">حلقة رقم {session.groupNumber}</span>
                              <span className="text-[11px] text-teal-800 font-medium block truncate">{session.level}</span>
                            </div>

                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">المعلم المشرف:</span>
                              <span className="font-bold text-slate-900 block truncate">{session.teacherName || 'غير محدد'}</span>
                            </div>
                          </div>

                          {/* Prayer Time Banner */}
                          <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl space-y-1">
                            <div className="flex items-center gap-1.5 text-teal-950 font-extrabold text-xs">
                              <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <SessionTimeDisplay entry={session} format="description" />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-700">
                              <span>
                                <SessionTimeDisplay entry={session} format="slot" />
                              </span>
                              <span className="text-[10px] text-teal-800 font-sans font-semibold">
                                (<SessionTimeDisplay entry={session} format="12h" />)
                              </span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => handleOpenSession(session)}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>{user?.role === 'parent' ? 'عرض السجل' : 'تقييم ورصد الحصة'}</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse text-right text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <th className="p-4 font-bold">التاريخ</th>
                        <th className="p-4 font-bold">الحلقة الدراسية</th>
                        <th className="p-4 font-bold">المعلم</th>
                        <th className="p-4 font-bold">التوقيت والتفاصيل</th>
                        <th className="p-4 font-bold">الحالة والنوع</th>
                        <th className="p-4 font-bold text-center">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sessions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-400 font-bold">
                            {hasActiveDateFilter ? 'لا توجد حصص في نطاق التاريخ المحدد' : 'لا توجد حصص مسجلة حالياً'}
                          </td>
                        </tr>
                      ) : (
                        sessions.map((session) => {
                          const isException = session.sessionType === 'exception';
                          return (
                            <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4">
                                <span className="font-extrabold text-slate-900 block">{formatArabicDate(session.date)}</span>
                                <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">{session.date}</span>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-slate-800 block">حلقة رقم {session.groupNumber}</span>
                                <span className="text-xs text-slate-500 font-medium">{session.level}</span>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-slate-800 block">{session.teacherName || 'غير محدد'}</span>
                              </td>
                              <td className="p-4">
                                <div className="inline-flex flex-col gap-1 p-2.5 bg-teal-50/80 border border-teal-200/80 rounded-2xl text-right">
                                  <div className="flex items-center gap-1.5 text-teal-950 font-extrabold text-xs">
                                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                    <SessionTimeDisplay entry={session} format="description" />
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-700">
                                    <span>
                                      <SessionTimeDisplay entry={session} format="slot" />
                                    </span>
                                    <span className="text-[10px] text-teal-800 font-sans font-semibold">
                                      (<SessionTimeDisplay entry={session} format="12h" />)
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 space-x-1.5 space-x-reverse">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isException ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {isException ? 'استثنائية' : 'أساسية'}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  session.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {session.status === 'completed' ? 'مكتملة' : 'مجدولة'}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleOpenSession(session)}
                                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                  {user?.role === 'parent' ? 'عرض السجل' : 'تقييم ورصد الحصة'}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Pagination Controls Footer */}
            {pagination && pagination.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="text-slate-500 font-medium">
                  عرض {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} - {Math.min(pagination.page * pagination.limit, pagination.total)} من إجمالي <span className="font-bold text-slate-900">{pagination.total}</span> حصة
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Previous Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                    className="h-8 px-3 rounded-lg text-xs"
                  >
                    السابق
                  </Button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                    .map((pageNum, idx, arr) => {
                      const showEllipsisBefore = idx > 0 && pageNum - arr[idx - 1] > 1;
                      return (
                        <React.Fragment key={pageNum}>
                          {showEllipsisBefore && (
                            <span className="px-1 text-slate-400">...</span>
                          )}
                          <Button
                            variant={pagination.page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className={`h-8 w-8 rounded-lg text-xs font-mono font-bold ${
                              pagination.page === pageNum ? 'bg-slate-900 text-white' : ''
                            }`}
                          >
                            {pageNum}
                          </Button>
                        </React.Fragment>
                      );
                    })}

                  {/* Next Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="h-8 px-3 rounded-lg text-xs"
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DATEPICKER FILTER DIALOG (Modal using Shadcn UI DatePicker components) */}
      {isDateFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-right">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <CalendarRange className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    تصفية الحصص حسب التاريخ
                  </h3>
                  <span className="text-[10px] text-slate-400">حدد تاريخ البداية والنهاية لعرض الحصص</span>
                </div>
              </div>
              <button
                onClick={() => setIsDateFilterModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Quick Preset Buttons */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">اختيار سريع:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { key: 'today', label: 'اليوم' },
                    { key: 'this_week', label: 'هذا الأسبوع' },
                    { key: 'this_month', label: 'هذا الشهر' },
                    { key: 'last_30_days', label: 'آخر 30 يوم' }
                  ].map(item => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => applyPreset(item.key as any)}
                      className="py-1 px-2 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer text-center"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Date & End Date using Shadcn DatePicker */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    من تاريخ (البداية):
                  </label>
                  <DatePicker
                    value={tempStartDate}
                    onChange={setTempStartDate}
                    placeholder="اختر تاريخ البداية"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    إلى تاريخ (النهاية):
                  </label>
                  <DatePicker
                    value={tempEndDate}
                    onChange={setTempEndDate}
                    placeholder="اختر تاريخ النهاية"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleApplyDateFilter}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs px-4"
                  >
                    تطبيق التصفية
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDateFilterModalOpen(false)}
                    className="rounded-xl text-xs"
                  >
                    إلغاء
                  </Button>
                </div>

                {(tempStartDate || tempEndDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempStartDate('');
                      setTempEndDate('');
                    }}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    مسح التحديد
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
