import React from 'react';
import { 
  QuranIcon, 
  HadithIcon, 
  TasbihIcon, 
  DuaIcon, 
  DonationIcon, 
  WallpaperIcon, 
  ZakatIcon, 
  MosqueDomeIcon, 
  QiblaIcon 
} from './MosqueIcons';

export type FeatureType = 
  | 'quran' 
  | 'hadith' 
  | 'tasbih' 
  | 'dua' 
  | 'donation' 
  | 'wallpaper' 
  | 'zakat' 
  | 'mosque' 
  | 'qibla';

interface FeatureGridProps {
  onSelectFeature: (feature: FeatureType) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectFeature }) => {
  const items: { id: FeatureType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'quran',
      label: 'Al-Quran',
      icon: <QuranIcon className="w-10 h-10" />
    },
    {
      id: 'hadith',
      label: 'Hadith',
      icon: <HadithIcon className="w-10 h-10" />
    },
    {
      id: 'tasbih',
      label: 'Tasbih',
      icon: <TasbihIcon className="w-10 h-10" />
    },
    {
      id: 'dua',
      label: 'Dua',
      icon: <DuaIcon className="w-10 h-10" />
    },
    {
      id: 'donation',
      label: 'Donation',
      icon: <DonationIcon className="w-10 h-10" />
    },
    {
      id: 'wallpaper',
      label: 'Wallpaper',
      icon: <WallpaperIcon className="w-10 h-10" />
    },
    {
      id: 'zakat',
      label: 'Zakat',
      icon: <ZakatIcon className="w-10 h-10" />
    },
    {
      id: 'mosque',
      label: 'Mosque',
      icon: <MosqueDomeIcon className="w-10 h-10" />
    },
    {
      id: 'qibla',
      label: 'Qibla',
      icon: <QiblaIcon className="w-10 h-10" />
    }
  ];

  return (
    <section className="w-full px-4 py-2">
      {/* Outer rounded card matching screenshot */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-y-5 gap-x-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectFeature(item.id)}
              className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all focus:outline-none group"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                {item.icon}
              </div>

              {/* Label */}
              <span className="text-xs sm:text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 mt-1 tracking-tight text-center">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
