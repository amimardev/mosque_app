import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Clock, MapPin } from 'lucide-react';
import { 
  GroupSessionTime, PrayerName, PRAYER_OPTIONS, 
  OFFSET_HOURS_OPTIONS, formatSessionTimeArabic 
} from '../../types';
import { 
  getAlgeriaPrayerTimes, PrayerTimings, 
  getPrayerTime, addTimeToTimeStr, calculateSessionClockTimes 
} from '../../lib/prayerTimes';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SessionTimePickerProps {
  value: GroupSessionTime;
  onChange: (updated: GroupSessionTime) => void;
  showPreview?: boolean;
  className?: string;
  label?: string;
}

export const SessionTimePicker: React.FC<SessionTimePickerProps> = ({
  value,
  onChange,
  showPreview = true,
  className = '',
  label = 'تحديد التوقيت الزمني (بداية ونهاية الحصة)'
}) => {
  const startType = value?.startType || 'prayer';
  const startTime = value?.startTime || '16:30';
  const startPrayer = value?.startPrayer || 'asr';
  const startOffsetHours = value?.startOffsetHours ?? 0;

  const endType = value?.endType || 'prayer';
  const endTime = value?.endTime || '18:00';
  const endPrayer = value?.endPrayer || 'maghrib';
  const endOffsetHours = value?.endOffsetHours ?? 0;

  const [timings, setTimings] = useState<PrayerTimings>({
    Fajr: '05:17',
    Sunrise: '06:43',
    Dhuhr: '12:37',
    Asr: '15:59',
    Sunset: '18:31',
    Maghrib: '18:31',
    Isha: '19:52'
  });

  useEffect(() => {
    getAlgeriaPrayerTimes().then(data => {
      if (data?.timings) {
        setTimings(data.timings);
      }
    });
  }, []);

  const updateField = (fields: Partial<GroupSessionTime>) => {
    onChange({
      ...value,
      ...fields
    });
  };

  const formattedSummary = useMemo(() => {
    return formatSessionTimeArabic({
      startType,
      startTime: startType === 'time' ? startTime : null,
      startPrayer: startType === 'prayer' ? startPrayer : null,
      startOffsetHours: startType === 'prayer' ? Number(startOffsetHours) : 0,
      endType,
      endTime: endType === 'time' ? endTime : null,
      endPrayer: endType === 'prayer' ? endPrayer : null,
      endOffsetHours: endType === 'prayer' ? Number(endOffsetHours) : 0
    });
  }, [startType, startTime, startPrayer, startOffsetHours, endType, endTime, endPrayer, endOffsetHours]);

  const clockTimes = useMemo(() => {
    return calculateSessionClockTimes(
      startType,
      startTime,
      startPrayer,
      startOffsetHours,
      endType,
      endTime,
      endPrayer,
      endOffsetHours,
      timings
    );
  }, [startType, startTime, startPrayer, startOffsetHours, endType, endTime, endPrayer, endOffsetHours, timings]);

  return (
    <div className={`space-y-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-5 text-right ${className}`} dir="rtl">
      {label && (
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{label}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>حسب أذان الجزائر</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Start Time / Prayer */}
        <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <label className="block text-xs font-bold text-slate-800">
            1. بداية الموعد
          </label>

          <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => updateField({ startType: 'prayer' })}
              className={`flex-1 py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${
                startType === 'prayer' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              أوقات الصلاة
            </button>
            <button
              type="button"
              onClick={() => updateField({ startType: 'time' })}
              className={`flex-1 py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${
                startType === 'time' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ساعة محددة
            </button>
          </div>

          {startType === 'prayer' ? (
            <div className="space-y-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">اختر الصلاة:</span>
                <Select
                  value={startPrayer}
                  onValueChange={(val) => updateField({ startPrayer: val as PrayerName })}
                >
                  <SelectTrigger className="w-full bg-slate-50 text-right text-xs">
                    <SelectValue placeholder="اختر الصلاة" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRAYER_OPTIONS.map(p => {
                      const prayerTimeStr = getPrayerTime(p.id, timings);
                      return (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nameAr} ({prayerTimeStr})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">إضافة فارق زمني:</span>
                <Select
                  value={String(startOffsetHours)}
                  onValueChange={(val) => updateField({ startOffsetHours: Number(val) })}
                >
                  <SelectTrigger className="w-full bg-slate-50 text-right text-xs">
                    <SelectValue placeholder="فارق زمني" />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFSET_HOURS_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">الساعة:</span>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => updateField({ startTime: e.target.value })}
                className="w-full bg-slate-50 text-xs font-mono font-bold text-center text-slate-800"
              />
            </div>
          )}
        </div>

        {/* 2. End Time / Prayer */}
        <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <label className="block text-xs font-bold text-slate-800">
            2. نهاية الموعد
          </label>

          <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => updateField({ endType: 'prayer' })}
              className={`flex-1 py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${
                endType === 'prayer' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              أوقات الصلاة
            </button>
            <button
              type="button"
              onClick={() => updateField({ endType: 'time' })}
              className={`flex-1 py-1.5 px-2 rounded-md font-bold transition-all cursor-pointer ${
                endType === 'time' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ساعة محددة
            </button>
          </div>

          {endType === 'prayer' ? (
            <div className="space-y-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">اختر الصلاة:</span>
                <Select
                  value={endPrayer}
                  onValueChange={(val) => updateField({ endPrayer: val as PrayerName })}
                >
                  <SelectTrigger className="w-full bg-slate-50 text-right text-xs">
                    <SelectValue placeholder="اختر الصلاة" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRAYER_OPTIONS.map(p => {
                      const prayerTimeStr = getPrayerTime(p.id, timings);
                      return (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nameAr} ({prayerTimeStr})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">إضافة فارق زمني:</span>
                <Select
                  value={String(endOffsetHours)}
                  onValueChange={(val) => updateField({ endOffsetHours: Number(val) })}
                >
                  <SelectTrigger className="w-full bg-slate-50 text-right text-xs">
                    <SelectValue placeholder="فارق زمني" />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFSET_HOURS_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">الساعة:</span>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => updateField({ endTime: e.target.value })}
                className="w-full bg-slate-50 text-xs font-mono font-bold text-center text-slate-800"
              />
            </div>
          )}
        </div>
      </div>

      {/* Real-time Live Preview with Accurate Calculated Clock Time */}
      {showPreview && (
        <div className="p-3 bg-emerald-950 text-emerald-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold border border-emerald-800">
          <div className="space-y-0.5">
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>الصياغة والوقت المحسوب بدقة:</span>
            </span>
            <span className="text-emerald-200 font-extrabold block">{formattedSummary}</span>
          </div>
          <div className="px-3 py-1 bg-emerald-900/80 rounded-lg border border-emerald-700 font-mono text-xs text-white">
            {clockTimes.calculatedStartTime} — {clockTimes.calculatedEndTime}
          </div>
        </div>
      )}
    </div>
  );
};
