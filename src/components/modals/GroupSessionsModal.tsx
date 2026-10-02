import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import api from '@/lib/apiClient';
import { 
  X, Calendar, Clock, Filter, ArrowLeft, Search, 
  Sparkles, AlertCircle, RefreshCw, ChevronLeft, CheckCircle2
} from 'lucide-react';
import { SessionTimeDisplay } from '../common/SessionTimeDisplay';

interface GroupSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupNumber: number;
}

export const GroupSessionsModal: React.FC<GroupSessionsModalProps> = ({
  isOpen,
  onClose,
  groupId,
  groupNumber
}) => {
  if (!isOpen) return null;

  const navigate = useNavigate();

  // Date range defaults: 30 days ago to 14 days in future
  const getInitialDates = () => {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - 30);
    const future = new Date();
    future.setDate(now.getDate() + 14);

    return {
      start: past.toISOString().split('T')[0],
      end: future.toISOString().split('T')[0]
    };
  };

  const initial = getInitialDates();
  const [startDate, setStartDate] = useState(initial.start);
  const [endDate, setEndDate] = useState(initial.end);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      let query = `/api/sessions?groupId=${encodeURIComponent(groupId)}`;
      if (startDate) query += `&startDate=${encodeURIComponent(startDate)}`;
      if (endDate) query += `&endDate=${encodeURIComponent(endDate)}`;
      if (statusFilter !== 'all') query += `&status=${encodeURIComponent(statusFilter)}`;

      const res = await api.get(query);
      let list = res.data.sessions || [];

      // Sort descending (newest / last session first)
      list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        list = list.filter((s: any) => 
          s.date.includes(term) ||
          (s.teacherName && s.teacherName.toLowerCase().includes(term)) ||
          (s.sessionTimeText && s.sessionTimeText.toLowerCase().includes(term))
        );
      }

      setSessions(list);
    } catch (err: any) {
      console.error('Failed to fetch group sessions:', err);
      setError(err.response?.data?.error || err.message || 'فشل في تحميل حصص الحلقة');
    } finally {
      setIsLoading(false);
    }
  }, [groupId, startDate, endDate, statusFilter, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen, fetchSessions]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSessions();
  };

  const handleApplyPreset = (type: 'last30' | 'currentMonth' | 'all') => {
    const now = new Date();
    if (type === 'last30') {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      setStartDate(past.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (type === 'currentMonth') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
    } else if (type === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleGoToSession = (sessionId: string) => {
    onClose();
    navigate({ to: `/dashboard/sessions/${sessionId}` as any });
  };

  const formatArabicDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-DZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0 border border-teal-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                حصص وسجل الحلقة رقم {groupNumber}
              </h2>
              <p className="text-xs text-slate-500">
                استعراض جدول الحصص السابقة والقادمة مع إمكانية الانتقال المباشر لتقييم ورصد أي حصة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-3 shrink-0">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
            {/* Start Date */}
            <div className="sm:col-span-4 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">من تاريخ (البداية):</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* End Date */}
            <div className="sm:col-span-4 space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">إلى تاريخ (النهاية):</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Submit / Filter Button */}
            <div className="sm:col-span-4">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>تحديث النتائج</span>
              </button>
            </div>
          </form>

          {/* Preset Buttons & Status Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-1 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500">خيارات سريعة:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset('last30')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer"
              >
                آخر 30 يوم
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('currentMonth')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer"
              >
                الشهر الحالي
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('all')}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer"
              >
                جميع التواريخ
              </button>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-1 bg-white p-0.5 border border-slate-200 rounded-xl text-[11px]">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-teal-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  statusFilter === 'completed' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                مكتملة
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('scheduled')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  statusFilter === 'scheduled' ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                مجدولة
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {isLoading ? (
            <div className="py-16 text-center space-y-2 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
              <p className="text-xs font-bold">جاري تحميل حصص الحلقة...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-16 text-center space-y-2 p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">لا توجد حصص مسجلة في هذا النطاق الزمني.</p>
              <p className="text-xs text-slate-500">حاول تغيير نطاق تواريخ البداية والنهاية من الأعلى.</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isException = session.sessionType === 'exception';
              const isCompleted = session.status === 'completed';

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 p-4 shadow-2xs hover:shadow-md transition-all space-y-3 text-right group"
                >
                  {/* Top Row: Date & Status Badges */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-200">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm block">
                          {formatArabicDate(session.date)}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">
                          {session.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isException ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isException ? 'استثنائية' : 'أساسية'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {isCompleted ? 'مكتملة ومقيّمة' : 'مجدولة'}
                      </span>
                    </div>
                  </div>

                  {/* Prayer Timing Banner */}
                  <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-teal-950 font-extrabold text-xs">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <SessionTimeDisplay entry={session} format="description" />
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dir-ltr">
                      <span>
                        <SessionTimeDisplay entry={session} format="slot" />
                      </span>
                      <span className="text-[10px] text-teal-800 font-sans font-semibold">
                        (<SessionTimeDisplay entry={session} format="12h" />)
                      </span>
                    </div>
                  </div>

                  {/* Teacher & Jump Action */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-slate-500 font-medium">
                      المعلم المشرف: <strong className="text-slate-800 font-bold">{session.teacherName || 'غير محدد'}</strong>
                    </span>

                    <button
                      onClick={() => handleGoToSession(session.id)}
                      className="px-4 py-2 bg-slate-900 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer group-hover:bg-teal-700 shrink-0"
                    >
                      <span>الانتقال للحصة ورصد التقييمات</span>
                      <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
