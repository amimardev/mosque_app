import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { 
  X, Clock, CheckSquare, Square, 
  Save, AlertCircle, CheckCircle2, Layers
} from 'lucide-react';
import { Group, GroupSessionTime, formatSessionTimeArabic } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import { SessionTimePicker } from '../forms/SessionTimePicker';

interface BulkTimingModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  groupTypeName?: string;
  onSuccess: () => Promise<void>;
}

export const BulkTimingModal: React.FC<BulkTimingModalProps> = ({
  isOpen,
  onClose,
  groups,
  groupTypeName,
  onSuccess
}) => {
  if (!isOpen) return null;

  // Selected group IDs state - default select all groups
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(() => groups.map(g => g.id));

  // Unified Session Time state
  const [sessionTime, setSessionTime] = useState<GroupSessionTime>(() => ({
    startType: 'prayer',
    startTime: '16:30',
    startPrayer: 'asr',
    startOffsetHours: 0,
    endType: 'prayer',
    endTime: '18:00',
    endPrayer: 'maghrib',
    endOffsetHours: 0
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const liveFormattedSummary = useMemo(() => {
    return formatSessionTimeArabic(sessionTime);
  }, [sessionTime]);

  // Group selection helpers
  const isAllSelected = groups.length > 0 && selectedGroupIds.length === groups.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedGroupIds([]);
    } else {
      setSelectedGroupIds(groups.map(g => g.id));
    }
  };

  const toggleGroupSelection = (id: string) => {
    setSelectedGroupIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGroupIds.length === 0) {
      setError('يرجى تحديد حلقة واحدة على الأقل لتطبيق التوقيت عليها.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      await axios.post('/api/groups/bulk-update-time', {
        groupIds: selectedGroupIds,
        sessionTime,
        studyTime: liveFormattedSummary
      });

      setSuccessMsg(`تم تحديث توقيت ${selectedGroupIds.length} حلقات بنجاح!`);
      await onSuccess();
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Failed to bulk update group timings:', err);
      setError(err.response?.data?.error || err.message || 'حدث خطأ أثناء تحديث التوقيت بالجملة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl h-[85vh] max-h-[680px] flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>تعديل مواعيد الحلقات بالجملة</span>
              </h2>
              <p className="text-xs text-slate-500">
                {groupTypeName ? `تخصيص توقيت الحصص للحلقات التابعة لمسار "${groupTypeName}"` : 'تطبيق نفس التوقيت الزمني على عدة حلقات دفعة واحدة'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 w-full p-4 sm:p-6">
            <div className="space-y-6">
              {error && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Unified Session Time Picker */}
              <SessionTimePicker
                value={sessionTime}
                onChange={setSessionTime}
                showPreview={true}
                label="تحديد التوقيت الجديد (بداية ونهاية الحصة)"
              />

              {/* Groups Selection Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-extrabold text-slate-800">
                      اختيار الحلقات المراد تطبيق التوقيت عليها ({selectedGroupIds.length} / {groups.length})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isAllSelected ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>إلغاء تحديد الكل</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5 text-slate-400" />
                        <span>تحديد كل الحلقات</span>
                      </>
                    )}
                  </button>
                </div>

                {groups.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {groups.map(g => {
                      const isSelected = selectedGroupIds.includes(g.id);
                      const currentTimingText = formatSessionTimeArabic(g.sessionTime, g.studyTime) || 'لم يحدد موعد بعد';

                      return (
                        <div
                          key={g.id}
                          onClick={() => toggleGroupSelection(g.id)}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs' 
                              : 'bg-white border-slate-200 hover:border-slate-300 opacity-75'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                              isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900">
                                  حلقة رقم {g.number}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                                  {g.level === 'Beginner' ? 'مبتدئ' : g.level === 'Advanced' ? 'متقدم' : 'متوسط'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                التوقيت الحالي: <span className="font-bold text-slate-700">{currentTimingText}</span>
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {g.gender === 'male' ? 'ذكور' : 'إناث'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 font-bold bg-slate-50 rounded-xl border border-slate-200">
                    لا توجد أي حلقات في هذا المسار لتطبيق التوقيت عليها.
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Footer Actions */}
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-start gap-2 bg-slate-50/50 shrink-0">
            <button
              type="submit"
              disabled={isSubmitting || selectedGroupIds.length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري تطبيق التحديثات...' : `تطبيق التوقيت على (${selectedGroupIds.length}) حلقات`}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
