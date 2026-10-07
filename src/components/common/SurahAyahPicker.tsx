import React, { useMemo, useState, useEffect } from 'react';
import { QURAN_SURAHS, SurahInfo } from '../../lib/quranData';

interface SurahAyahPickerProps {
  surahNumber?: number;
  currentSurahNumber?: number;
  surahName?: string;
  currentSurahName?: string;
  ayah?: number;
  currentAyah?: number;
  onSurahChange: (surahNumber: number, surahName: string) => void;
  onAyahChange: (ayah: number) => void;
  label?: string;
}

export const SurahAyahPicker: React.FC<SurahAyahPickerProps> = ({
  surahNumber: propSurahNumber,
  currentSurahNumber,
  ayah: propAyah,
  currentAyah,
  onSurahChange,
  onAyahChange,
  label = 'مستوى الحفظ الحالي (السورة والآية)'
}) => {
  const activeSurahNumber = propSurahNumber ?? currentSurahNumber ?? 1;
  const activeAyah = propAyah ?? currentAyah ?? 1;

  const currentSurah = useMemo(() => {
    return QURAN_SURAHS.find(s => s.number === activeSurahNumber) || QURAN_SURAHS[0];
  }, [activeSurahNumber]);

  const maxAyahs = currentSurah?.totalAyahs || 286;

  // Local state for smooth typing and backspacing
  const [ayahStr, setAyahStr] = useState<string>(String(activeAyah));

  useEffect(() => {
    setAyahStr(String(activeAyah));
  }, [activeAyah]);

  const handleSurahSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value, 10);
    const matched = QURAN_SURAHS.find(s => s.number === num);
    if (matched) {
      onSurahChange(matched.number, matched.nameEnglish);
      if (activeAyah > matched.totalAyahs) {
        onAyahChange(matched.totalAyahs);
        setAyahStr(String(matched.totalAyahs));
      }
    }
  };

  const handleAyahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAyahStr(val);

    if (val === '') {
      return; // allow user to clear the field while typing
    }

    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1) {
      if (num > maxAyahs) {
        onAyahChange(maxAyahs);
      } else {
        onAyahChange(num);
      }
    }
  };

  const handleAyahBlur = () => {
    const num = parseInt(ayahStr, 10);
    if (isNaN(num) || num < 1) {
      onAyahChange(1);
      setAyahStr('1');
    } else if (num > maxAyahs) {
      onAyahChange(maxAyahs);
      setAyahStr(String(maxAyahs));
    } else {
      onAyahChange(num);
      setAyahStr(String(num));
    }
  };

  return (
    <div className="space-y-2 text-right" dir="rtl">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 flex-row-reverse justify-end">
        <img src="/icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
        <span>{label}</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Surah Dropdown */}
        <div className="sm:col-span-2">
          <div className="relative">
            <select
              value={activeSurahNumber}
              onChange={handleSurahSelect}
              className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-right"
            >
              {QURAN_SURAHS.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. سورة {s.nameArabic} ({s.nameEnglish}) - {s.totalAyahs} آية
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ayah Input */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0 font-medium">رقم الآية:</span>
            <input
              type="number"
              min={1}
              max={maxAyahs}
              value={ayahStr}
              onChange={handleAyahChange}
              onBlur={handleAyahBlur}
              className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800 text-center"
            />
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 text-right">
            الحد الأقصى: {maxAyahs} آية
          </span>
        </div>
      </div>

      {currentSurah && (
        <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-emerald-50/80 border border-emerald-100 rounded-lg text-emerald-800">
          <span className="font-arabic text-sm font-semibold">سورة {currentSurah.nameArabic}</span>
          <span className="font-medium">
            سورة رقم {currentSurah.number} • {currentSurah.type === 'Meccan' ? 'مكية' : 'مدنية'}
          </span>
          <span className="bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-md font-semibold text-[11px]">
            الآية {activeAyah} من {maxAyahs}
          </span>
        </div>
      )}
    </div>
  );
};
