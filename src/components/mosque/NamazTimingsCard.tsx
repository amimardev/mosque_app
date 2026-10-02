import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Clock, ChevronDown, ChevronUp, Calendar, MapPin, Sparkles } from 'lucide-react';
import { 
  getAlgeriaPrayerTimes, PrayerTimesData, 
  getNextPrayerInfo, formatTime12hArabic, addTimeToTimeStr 
} from '../../lib/prayerTimes';

interface NamazTimingsCardProps {
  onOpenMonthlySchedule?: () => void;
}

export const NamazTimingsCard: React.FC<NamazTimingsCardProps> = ({ onOpenMonthlySchedule }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [activeAdhanAudio, setActiveAdhanAudio] = useState<HTMLAudioElement | null>(null);
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTimes() {
      try {
        const data = await getAlgeriaPrayerTimes();
        if (isMounted) {
          setPrayerData(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load prayer times:', err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadTimes();

    // Refresh every minute to update active countdown
    const interval = setInterval(() => {
      loadTimes();
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const timings = prayerData?.timings || {
    Fajr: '05:17',
    Sunrise: '06:43',
    Dhuhr: '12:37',
    Asr: '15:59',
    Sunset: '18:31',
    Maghrib: '18:31',
    Isha: '19:52'
  };

  const nextPrayer = getNextPrayerInfo(timings);

  // Accurate prayers list with real Adhan times from Algeria AlAdhan API
  const prayers = [
    { 
      name: 'Fajr', 
      arabic: 'الفجر', 
      adhan: timings.Fajr?.split(' ')[0] || '05:17',
      iqamah: addTimeToTimeStr(timings.Fajr?.split(' ')[0] || '05:17', 0, 20)
    },
    { 
      name: 'Sunrise', 
      arabic: 'الشروق', 
      adhan: timings.Sunrise?.split(' ')[0] || '06:43',
      iqamah: '—', 
      isSunrise: true 
    },
    { 
      name: 'Dhuhr', 
      arabic: 'الظهر', 
      adhan: timings.Dhuhr?.split(' ')[0] || '12:37',
      iqamah: addTimeToTimeStr(timings.Dhuhr?.split(' ')[0] || '12:37', 0, 15)
    },
    { 
      name: 'Asr', 
      arabic: 'العصر', 
      adhan: timings.Asr?.split(' ')[0] || '15:59',
      iqamah: addTimeToTimeStr(timings.Asr?.split(' ')[0] || '15:59', 0, 15)
    },
    { 
      name: 'Maghrib', 
      arabic: 'المغرب', 
      adhan: timings.Maghrib?.split(' ')[0] || '18:31',
      iqamah: addTimeToTimeStr(timings.Maghrib?.split(' ')[0] || '18:31', 0, 10)
    },
    { 
      name: 'Isha', 
      arabic: 'العشاء', 
      adhan: timings.Isha?.split(' ')[0] || '19:52',
      iqamah: addTimeToTimeStr(timings.Isha?.split(' ')[0] || '19:52', 0, 15)
    },
  ];

  const toggleAdhan = () => {
    if (isPlayingAdhan) {
      if (activeAdhanAudio) {
        activeAdhanAudio.pause();
        activeAdhanAudio.currentTime = 0;
      }
      setIsPlayingAdhan(false);
    } else {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 3);
        setIsPlayingAdhan(true);
        setTimeout(() => setIsPlayingAdhan(false), 3000);
      } catch {
        setIsPlayingAdhan(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (activeAdhanAudio) {
        activeAdhanAudio.pause();
      }
    };
  }, [activeAdhanAudio]);

  const hijriText = prayerData?.date?.hijri 
    ? `${prayerData.date.hijri.day} ${prayerData.date.hijri.month.ar} ${prayerData.date.hijri.year} هـ`
    : '20 ربيع الثاني 1448 هـ';

  return (
    <section className="w-full px-4 pt-2 pb-6">
      {/* Outer arched emerald card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#116b58] to-[#0a483a] text-white p-5 shadow-lg overflow-hidden border border-emerald-700/40">
        {/* Islamic Arabesque Geometric Background Watermark */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(#ffffff 2px, transparent 2px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Dome Arch Visual Element */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Mosque Arch Top Silhouette */}
          <div className="w-36 h-12 border-t-2 border-x-2 border-emerald-400/40 rounded-t-full mb-1 flex items-center justify-center">
            <span className="text-emerald-200 text-xs font-arabic tracking-widest font-bold">
              حي على الصلاة
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-200/90 font-bold mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>مواقيت الصلاة حسب توقيت الجزائر (Algiers)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            مواقيت الصلاة والأذان
          </h3>

          <p className="text-xs text-emerald-100/90 font-medium mt-1">
            {hijriText} • {new Date().toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {/* Quick Next Prayer Pill */}
          <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/70 border border-emerald-500/30 text-xs shadow-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-emerald-200">
              الأذان القادم: <strong className="text-white font-bold">{nextPrayer.arabicName}</strong> في الساعة <strong className="text-white font-mono">{nextPrayer.time24}</strong>
            </span>
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 font-bold">متبقي {nextPrayer.remainingText}</span>
          </div>
        </div>

        {/* Action controls row */}
        <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-emerald-600/30">
          <button
            onClick={toggleAdhan}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            {isPlayingAdhan ? (
              <>
                <VolumeX className="w-4 h-4 text-emerald-300" />
                <span>إيقاف صوت الأذان</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-300" />
                <span>استماع للأذان</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-800/80 hover:bg-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-600/40 transition-all active:scale-95 cursor-pointer"
          >
            <span>{isExpanded ? 'إخفاء الجدول' : 'جدول الصلوات الخمس'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Full Timetable */}
        {isExpanded && (
          <div className="relative z-10 mt-4 space-y-2 pt-3 border-t border-emerald-600/30 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-4 text-[10px] font-bold text-emerald-300 uppercase px-2 pb-1 text-right">
              <span>الصلاة</span>
              <span>الاسم</span>
              <span className="text-center">الأذان (الجزائر)</span>
              <span className="text-left">الإقامة التقريبية</span>
            </div>

            {prayers.map((prayer) => {
              const isNext = prayer.name === nextPrayer.name;
              return (
                <div
                  key={prayer.name}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                    isNext
                      ? 'bg-emerald-500/25 border border-emerald-400/40 shadow-xs'
                      : 'bg-emerald-900/40 hover:bg-emerald-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{prayer.name}</span>
                    {isNext && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-400 text-emerald-950">
                        القادمة
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-arabic text-emerald-200 font-bold">
                    {prayer.arabic}
                  </span>

                  <span className="text-xs font-mono font-bold text-emerald-100">
                    {prayer.adhan}
                  </span>

                  <span className="text-xs font-mono font-bold text-white text-left">
                    {prayer.iqamah}
                  </span>
                </div>
              );
            })}

            {onOpenMonthlySchedule && (
              <button
                onClick={onOpenMonthlySchedule}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/60 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>عرض تقويم الصلوات الكامل لشهر كامل</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
