import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  Check, 
  Share2, 
  Compass as CompassIcon, 
  MapPin, 
  Phone, 
  Clock, 
  Sparkles,
  Calculator,
  Download,
  Users,
  MessageCircle,
  Volume2,
  BookOpen
} from 'lucide-react';
import { FeatureType } from './FeatureGrid';
import { SURAHS, HADITHS, DUAS, WALLPAPERS, DONATION_PROJECTS, SCHOLARS } from './mockData';
import { Scholar } from './types';

interface FeatureModalsProps {
  activeFeature: FeatureType | null;
  onClose: () => void;
  selectedScholar: Scholar | null;
  onCloseScholar: () => void;
  isNotificationsOpen: boolean;
  onCloseNotifications: () => void;
}

export const FeatureModals: React.FC<FeatureModalsProps> = ({
  activeFeature,
  onClose,
  selectedScholar,
  onCloseScholar,
  isNotificationsOpen,
  onCloseNotifications,
}) => {
  // Tasbih State
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33);
  const [tasbihDhikr, setTasbihDhikr] = useState('SubhanAllah');
  const dhikrOptions = [
    { name: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', meaning: 'Glory be to Allah' },
    { name: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', meaning: 'Praise be to Allah' },
    { name: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', meaning: 'Allah is the Greatest' },
    { name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', meaning: 'I seek Allah\'s forgiveness' },
    { name: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', meaning: 'There is no god but Allah' },
  ];

  // Quran Player State
  const [selectedSurah, setSelectedSurah] = useState(SURAHS[0]);
  const [isPlayingSurah, setIsPlayingSurah] = useState(false);

  // Donation State
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [donorName, setDonorName] = useState('Brother / Sister');
  const [selectedProject, setSelectedProject] = useState(DONATION_PROJECTS[0].id);
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Zakat Calculator State
  const [cashSavings, setCashSavings] = useState<string>('50000');
  const [goldGrams, setGoldGrams] = useState<string>('15');
  const [silverGrams, setSilverGrams] = useState<string>('0');
  const [debts, setDebts] = useState<string>('5000');
  const [zakatCalculated, setZakatCalculated] = useState<number>(0);

  // Calculate Zakat
  useEffect(() => {
    const cash = parseFloat(cashSavings) || 0;
    const gold = (parseFloat(goldGrams) || 0) * 11500; // approx gold price per gram in BDT
    const silver = (parseFloat(silverGrams) || 0) * 160; // silver per gram
    const liabilities = parseFloat(debts) || 0;
    const netWealth = Math.max(0, cash + gold + silver - liabilities);
    const nisabThreshold = 87.48 * 160; // silver nisab threshold in BDT
    if (netWealth >= nisabThreshold) {
      setZakatCalculated(Math.round(netWealth * 0.025));
    } else {
      setZakatCalculated(0);
    }
  }, [cashSavings, goldGrams, silverGrams, debts]);

  // Tasbih increment
  const handleTasbihTap = () => {
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
    setTasbihCount((prev) => prev + 1);
  };

  // Close with Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        onCloseScholar();
        onCloseNotifications();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onCloseScholar, onCloseNotifications]);

  if (!activeFeature && !selectedScholar && !isNotificationsOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              {activeFeature === 'quran' && <BookOpen className="w-4 h-4" />}
              {activeFeature === 'tasbih' && <Sparkles className="w-4 h-4" />}
              {activeFeature === 'donation' && <Heart className="w-4 h-4" />}
              {activeFeature === 'zakat' && <Calculator className="w-4 h-4" />}
              {activeFeature === 'qibla' && <CompassIcon className="w-4 h-4" />}
              {activeFeature === 'mosque' && <MapPin className="w-4 h-4" />}
              {selectedScholar && <Users className="w-4 h-4" />}
              {isNotificationsOpen && <Volume2 className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                {selectedScholar ? selectedScholar.name : (
                  isNotificationsOpen ? 'Mosque Notifications' : (
                    activeFeature === 'quran' ? 'The Holy Quran' :
                    activeFeature === 'hadith' ? 'Prophetic Hadith' :
                    activeFeature === 'tasbih' ? 'Digital Tasbih' :
                    activeFeature === 'dua' ? 'Masnoon Duas' :
                    activeFeature === 'donation' ? 'Mosque Donation' :
                    activeFeature === 'wallpaper' ? 'Islamic Wallpapers' :
                    activeFeature === 'zakat' ? 'Zakat Calculator' :
                    activeFeature === 'mosque' ? 'About Ahmedpur Mosque' :
                    activeFeature === 'qibla' ? 'Qibla Direction' : ''
                  )
                )}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">Ahmedpur Mosque Community</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onCloseScholar();
              onCloseNotifications();
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 overflow-y-auto no-scrollbar flex-1 space-y-4">
          {/* 1. AL-QURAN */}
          {activeFeature === 'quran' && (
            <div className="space-y-4">
              {/* Surah Selector Pills */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {SURAHS.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => {
                      setSelectedSurah(surah);
                      setIsPlayingSurah(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedSurah.number === surah.number
                        ? 'bg-[#1fa38b] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {surah.number}. {surah.nameEnglish}
                  </button>
                ))}
              </div>

              {/* Surah Header Card */}
              <div className="bg-gradient-to-r from-[#1fa38b] to-[#157866] text-white rounded-2xl p-4 text-center">
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                  Surah {selectedSurah.nameEnglish} • {selectedSurah.revelationType}
                </span>
                <h3 className="text-2xl font-bold font-arabic my-1">{selectedSurah.nameArabic}</h3>
                <p className="text-xs text-emerald-100">{selectedSurah.meaning} ({selectedSurah.totalVerses} Ayahs)</p>

                {/* Recitation play button */}
                <button
                  onClick={() => setIsPlayingSurah(!isPlayingSurah)}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#1fa38b] text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  {isPlayingSurah ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingSurah ? 'Pause Recitation' : 'Play Sheikh Mishary Recitation'}</span>
                </button>
              </div>

              {/* Verses List */}
              <div className="space-y-3">
                {selectedSurah.verses.map((verse) => (
                  <div key={verse.number} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-[#1fa38b] text-xs font-bold flex items-center justify-center">
                        {verse.number}
                      </span>
                      <p className="text-xl sm:text-2xl font-arabic text-gray-900 leading-loose text-right dir-rtl">
                        {verse.arabic}
                      </p>
                    </div>
                    <p className="text-xs italic text-gray-500 font-serif">{verse.transliteration}</p>
                    <p className="text-xs text-gray-800 font-medium">{verse.translationEn}</p>
                    <p className="text-xs text-emerald-800 font-medium">{verse.translationBn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. HADITH */}
          {activeFeature === 'hadith' && (
            <div className="space-y-3">
              {HADITHS.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {item.book}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600">{item.grade}</span>
                  </div>
                  <p className="text-lg font-arabic text-gray-900 leading-relaxed text-right dir-rtl">{item.arabic}</p>
                  <p className="text-xs text-gray-700 font-medium">"{item.translation}"</p>
                  <p className="text-[11px] text-gray-400 font-medium">Narrated by: {item.narrator}</p>
                </div>
              ))}
            </div>
          )}

          {/* 3. DIGITAL TASBIH */}
          {activeFeature === 'tasbih' && (
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              {/* Dhikr Selector */}
              <div className="w-full">
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">Select Dhikr</label>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {dhikrOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => {
                        setTasbihDhikr(opt.name);
                        setTasbihCount(0);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        tasbihDhikr === opt.name
                          ? 'bg-[#1fa38b] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arabic Dhikr Display */}
              <div className="py-2">
                <span className="text-3xl font-bold font-arabic text-[#1fa38b]">
                  {dhikrOptions.find((d) => d.name === tasbihDhikr)?.arabic}
                </span>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {dhikrOptions.find((d) => d.name === tasbihDhikr)?.meaning}
                </p>
              </div>

              {/* Big Tap Button */}
              <button
                onClick={handleTasbihTap}
                className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#1fa38b] to-[#40bfa9] text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-white ring-4 ring-[#72c2b3]/30 select-none cursor-pointer"
              >
                <span className="text-5xl font-black tracking-tight font-mono">{tasbihCount}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 mt-1">
                  Tap to Count
                </span>
                <span className="text-[10px] text-emerald-200/80 mt-0.5">
                  Target: {tasbihTarget}
                </span>
              </button>

              {/* Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setTasbihCount(0)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Count</span>
                </button>

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
                  <span className="px-2 text-gray-400">Target:</span>
                  {[33, 99, 100].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTasbihTarget(t)}
                      className={`px-2.5 py-1 rounded-lg ${
                        tasbihTarget === t ? 'bg-white shadow-xs text-gray-900' : 'hover:text-gray-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. DUA */}
          {activeFeature === 'dua' && (
            <div className="space-y-3">
              {DUAS.map((dua) => (
                <div key={dua.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <span className="text-xs font-bold text-[#1fa38b] bg-emerald-50 px-2 py-0.5 rounded-md">
                    {dua.category}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">{dua.title}</h4>
                  <p className="text-xl font-arabic text-gray-900 text-right dir-rtl leading-relaxed">{dua.arabic}</p>
                  <p className="text-xs italic text-gray-500 font-serif">{dua.transliteration}</p>
                  <p className="text-xs text-gray-800 font-medium">{dua.translation}</p>
                  <div className="pt-1 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Reference: {dua.reference}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. DONATION */}
          {activeFeature === 'donation' && (
            <div className="space-y-4">
              {donationSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-emerald-900">JazakAllahu Khairan!</h3>
                  <p className="text-xs text-emerald-700">
                    May Allah accept your donation of <strong>৳{donationAmount}</strong> for Ahmedpur Mosque and bless your family with barakah.
                  </p>
                  <button
                    onClick={() => setDonationSuccess(false)}
                    className="mt-2 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all"
                  >
                    Make Another Donation
                  </button>
                </div>
              ) : (
                <>
                  {/* Select Project */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Select Cause</label>
                    <div className="space-y-2">
                      {DONATION_PROJECTS.map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => setSelectedProject(proj.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            selectedProject === proj.id
                              ? 'border-[#1fa38b] bg-emerald-50/50 ring-1 ring-[#1fa38b]'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-gray-900">{proj.title}</h4>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {proj.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{proj.description}</p>
                          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-gray-600">
                            <span>Raised: ৳{proj.raised.toLocaleString()}</span>
                            <span>Goal: ৳{proj.goal.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-[#1fa38b] rounded-full"
                              style={{ width: `${Math.min(100, (proj.raised / proj.goal) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preset Amounts */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">Donation Amount (BDT)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[200, 500, 1000, 5000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setDonationAmount(amt)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            donationAmount === amt
                              ? 'bg-[#1fa38b] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ৳{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Donor Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Your Name (or Anonymous)</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Brother Ahmad"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1fa38b]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={() => setDonationSuccess(true)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1fa38b] to-[#157866] text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Complete Sadaqah of ৳{donationAmount}</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* 6. WALLPAPERS */}
          {activeFeature === 'wallpaper' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-medium">Download peaceful 4K Islamic wallpapers for your mobile device.</p>
              <div className="grid grid-cols-2 gap-3">
                {WALLPAPERS.map((wall) => (
                  <div key={wall.id} className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-900 aspect-[9/14]">
                    <img
                      src={wall.imageUrl}
                      alt={wall.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end text-white">
                      <span className="text-[10px] text-emerald-300 font-semibold">{wall.category}</span>
                      <h5 className="text-xs font-bold leading-tight line-clamp-2">{wall.title}</h5>
                      <a
                        href={wall.imageUrl}
                        download={`mosque_wallpaper_${wall.id}.jpg`}
                        className="mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-[10px] font-bold text-white transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download 4K</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. ZAKAT CALCULATOR */}
          {activeFeature === 'zakat' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold">Nisab Benchmark:</span> 52.5 Tolas / 612.36g of Silver (approx. ৳98,000). Wealth held for 1 lunar year above this threshold is subject to 2.5% Zakat.
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Cash in Hand & Bank (৳)</label>
                  <input
                    type="number"
                    value={cashSavings}
                    onChange={(e) => setCashSavings(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold mt-1 focus:ring-2 focus:ring-[#1fa38b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Gold (in Grams)</label>
                    <input
                      type="number"
                      value={goldGrams}
                      onChange={(e) => setGoldGrams(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold mt-1 focus:ring-2 focus:ring-[#1fa38b]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Silver (in Grams)</label>
                    <input
                      type="number"
                      value={silverGrams}
                      onChange={(e) => setSilverGrams(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold mt-1 focus:ring-2 focus:ring-[#1fa38b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Immediate Debts & Dues (৳)</label>
                  <input
                    type="number"
                    value={debts}
                    onChange={(e) => setDebts(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold mt-1 focus:ring-2 focus:ring-[#1fa38b]"
                  />
                </div>
              </div>

              {/* Total Calculated Zakat */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1fa38b] to-[#157866] text-white text-center space-y-1">
                <span className="text-xs text-emerald-100 uppercase tracking-wider font-semibold">
                  Zakat Payable (2.5%)
                </span>
                <p className="text-3xl font-black font-mono">৳{zakatCalculated.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-200">
                  {zakatCalculated > 0 ? 'Purify your wealth by distributing to eligible recipients.' : 'Below the Nisab threshold. No Zakat due.'}
                </p>
              </div>
            </div>
          )}

          {/* 8. MOSQUE DIRECTORY */}
          {activeFeature === 'mosque' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                <h3 className="text-base font-bold text-gray-900">Ahmedpur Jame Masjid</h3>
                <p className="text-xs text-gray-600">
                  Serving the Muslim community of Borolia, Pirgonj, Rangpur with authentic Islamic teachings, 5 daily prayers in congregation, weekly Jumu’ah, and community outreach.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Facilities</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-gray-700">
                  <div className="p-2.5 rounded-xl bg-gray-50 flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#1fa38b]" />
                    <span>Capacity: 1,800</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#1fa38b]" />
                    <span>Women's Prayer Hall</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#1fa38b]" />
                    <span>Modern Wudu Khana</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#1fa38b]" />
                    <span>Islamic Library</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-[#1fa38b] shrink-0" />
                  <span>Ahmedpur, Borolia, Pirgonj, Rangpur, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-[#1fa38b] shrink-0" />
                  <span>+880 1712-345678 (Mosque Office)</span>
                </div>
              </div>
            </div>
          )}

          {/* 9. QIBLA DIRECTION */}
          {activeFeature === 'qibla' && (
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <p className="text-xs text-gray-600">
                Facing Makkah al-Mukarramah from Ahmedpur, Pirgonj, Bangladesh
              </p>

              {/* Compass UI with rotating pointer */}
              <div className="relative w-56 h-56 rounded-full border-4 border-[#1fa38b] bg-radial from-emerald-50 to-white flex items-center justify-center shadow-lg">
                {/* Degree markings */}
                <span className="absolute top-2 text-xs font-bold text-red-600">N (0°)</span>
                <span className="absolute right-3 text-xs font-bold text-gray-400">E (90°)</span>
                <span className="absolute bottom-2 text-xs font-bold text-gray-400">S (180°)</span>
                <span className="absolute left-2 text-xs font-bold text-gray-400">W (270°)</span>

                {/* Kaaba Direction Needle (approx 282° WNW) */}
                <div 
                  className="w-full h-full absolute inset-0 flex items-center justify-center transition-transform duration-700"
                  style={{ transform: 'rotate(282deg)' }}
                >
                  <div className="w-1.5 h-24 bg-gradient-to-t from-transparent via-[#1fa38b] to-emerald-600 rounded-full flex flex-col items-center">
                    <div className="w-7 h-7 -mt-3.5 rounded-md bg-black border-2 border-amber-400 flex items-center justify-center shadow-md">
                      <span className="text-[9px] font-bold text-amber-300">كعبة</span>
                    </div>
                  </div>
                </div>

                {/* Center Dial */}
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-200 flex flex-col items-center justify-center z-10">
                  <span className="text-xs font-bold font-mono text-[#1fa38b]">282°</span>
                  <span className="text-[8px] text-gray-400 font-semibold">WNW</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-1">
                <p className="font-bold">Distance to Holy Kaaba:</p>
                <p className="font-mono text-sm font-black">5,280 km</p>
                <p className="text-[11px] text-emerald-700">Align your phone flat on the surface until the indicator points straight to Kaaba.</p>
              </div>
            </div>
          )}

          {/* 10. SCHOLAR LIVE STREAM PLAYER */}
          {selectedScholar && (
            <div className="space-y-4">
              {/* Video Mockup Frame */}
              <div className="relative rounded-2xl bg-black aspect-video overflow-hidden shadow-lg flex items-center justify-center">
                <img
                  src={selectedScholar.avatar}
                  alt={selectedScholar.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>LIVE</span>
                    </span>
                    <span className="text-[11px] font-bold text-white/90 bg-black/50 px-2 py-0.5 rounded-full">
                      👁 {selectedScholar.viewers || '1.2k'} watching
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{selectedScholar.topic}</h4>
                    <p className="text-xs text-gray-300">{selectedScholar.name}</p>
                  </div>
                </div>
              </div>

              {/* Scholar Bio */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <h5 className="text-xs font-bold text-gray-900">{selectedScholar.title}</h5>
                <p className="text-xs text-gray-600">{selectedScholar.bio}</p>
              </div>

              {/* Simulated Live Comments */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Live Audience Feed</span>
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar text-xs">
                  <div className="p-2 rounded-xl bg-gray-50">
                    <strong className="text-gray-900">Rafiqul Islam:</strong> <span className="text-gray-600">MashaAllah, very insightful explanation.</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50">
                    <strong className="text-gray-900">Kamrul Hasan:</strong> <span className="text-gray-600">Ameen! May Allah bless our community.</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50">
                    <strong className="text-gray-900">Mahmudul Haque:</strong> <span className="text-gray-600">Assalamu Alaikum from Rangpur!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 11. NOTIFICATIONS */}
          {isNotificationsOpen && (
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-gray-900 font-bold block">Adhan Reminder: Asr Prayer</strong>
                  <span className="text-gray-600">Asr Adhan will be called in 35 minutes at Ahmedpur Mosque.</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Today at 3:45 PM</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1fa38b] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-gray-900 font-bold block">Friday Jumu'ah Khutbah Announcement</strong>
                  <span className="text-gray-600">Shaykh Ahmadullah will deliver the special Jumu'ah lecture this Friday.</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
