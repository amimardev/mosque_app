import * as React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../../lib/utils';

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
}

const MONTH_NAMES_AR = [
  'يناير (1)', 'فبراير (2)', 'مارس (3)', 'أبريل (4)', 'مايو (5)', 'يونيو (6)',
  'يوليو (7)', 'أغسطس (8)', 'سبتمبر (9)', 'أكتوبر (10)', 'نوفمبر (11)', 'ديسمبر (12)'
];

const WEEKDAYS_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

export function DatePicker({
  value,
  onChange,
  placeholder = 'اختر التاريخ',
  className,
  minDate = '2000-01-01',
  maxDate = '2035-12-31',
  disabled = false
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Parse initial selected date or default to current date
  const initialDate = React.useMemo(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      return new Date(value);
    }
    return new Date();
  }, [value]);

  const [currentYear, setCurrentYear] = React.useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(initialDate.getMonth());

  React.useEffect(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      const d = new Date(value);
      setCurrentYear(d.getFullYear());
      setCurrentMonth(d.getMonth());
    }
  }, [value]);

  // Generate Year options (from 2000 to current year + 6)
  const years = React.useMemo(() => {
    const maxYear = new Date().getFullYear() + 6;
    const minYear = 2000;
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, []);

  // Compute days in month
  const daysInMonth = React.useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayOfWeek = React.useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  // Formatted display string
  const displayString = React.useMemo(() => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 0 && m < 12) {
        return `${d} ${MONTH_NAMES_AR[m].split(' ')[0]} ${y}`;
      }
    }
    return value;
  }, [value]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium transition-all text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer hover:bg-slate-100/70',
            !value && 'text-slate-400',
            className
          )}
          dir="rtl"
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className={cn('truncate font-bold', value ? 'text-slate-800' : 'text-slate-400 font-normal')}>
              {displayString || placeholder}
            </span>
          </div>
          {value && (
            <span
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="مسح التاريخ"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 sm:w-80 p-3 bg-white shadow-2xl rounded-2xl border border-slate-200" align="start">
        <div className="space-y-3" dir="rtl">
          {/* Header Controls: Month & Year Selectors */}
          <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="الشهر التالي"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {/* Month Dropdown */}
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
                className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {MONTH_NAMES_AR.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
                className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="الشهر السابق"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center">
            {WEEKDAYS_AR.map((day, idx) => (
              <span key={idx} className="text-[10px] font-extrabold text-slate-400 py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const formattedMonth = String(currentMonth + 1).padStart(2, '0');
              const formattedDay = String(dayNum).padStart(2, '0');
              const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;
              const isSelected = value === dateKey;
              const isToday = new Date().toISOString().split('T')[0] === dateKey;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={cn(
                    'h-8 w-8 mx-auto text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer font-mono',
                    isSelected
                      ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                      : isToday
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Quick Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono">
              {value || 'لم يتم التحديد'}
            </span>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-rose-600 hover:underline font-bold"
              >
                إلغاء التحديد
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
