import React from 'react';
import { Home, Compass, PlayCircle, Grid } from 'lucide-react';

export type MosqueNavTab = 'home' | 'wallpapers' | 'live' | 'menu';

interface BottomNavProps {
  activeTab: MosqueNavTab;
  onChangeTab: (tab: MosqueNavTab) => void;
  liveCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  liveCount = 2,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] max-w-[430px] mx-auto">
      <div className="flex items-center justify-around px-3 py-2 pb-safe">
        {/* Tab 1: Home */}
        <button
          onClick={() => onChangeTab('home')}
          className="flex flex-col items-center justify-center min-w-[64px] py-1 focus:outline-none transition-all"
        >
          {activeTab === 'home' ? (
            <div className="w-12 h-10 rounded-xl bg-gradient-to-b from-[#34b69f] to-[#1da189] text-white flex flex-col items-center justify-center shadow-sm">
              <Home className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[9px] font-bold mt-0.5 tracking-tight">Home</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600">
              <Home className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] font-medium mt-1">Home</span>
            </div>
          )}
        </button>

        {/* Tab 2: Wallpapers (Compass icon in image) */}
        <button
          onClick={() => onChangeTab('wallpapers')}
          className="flex flex-col items-center justify-center min-w-[64px] py-1 focus:outline-none transition-all group"
        >
          {activeTab === 'wallpapers' ? (
            <div className="w-12 h-10 rounded-xl bg-gradient-to-b from-[#34b69f] to-[#1da189] text-white flex flex-col items-center justify-center shadow-sm">
              <Compass className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[9px] font-bold mt-0.5 tracking-tight">Wallpapers</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-600">
              <Compass className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] font-medium mt-1">Wallpapers</span>
            </div>
          )}
        </button>

        {/* Tab 3: Live */}
        <button
          onClick={() => onChangeTab('live')}
          className="flex flex-col items-center justify-center min-w-[64px] py-1 focus:outline-none transition-all group relative"
        >
          {activeTab === 'live' ? (
            <div className="w-12 h-10 rounded-xl bg-gradient-to-b from-[#34b69f] to-[#1da189] text-white flex flex-col items-center justify-center shadow-sm">
              <PlayCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[9px] font-bold mt-0.5 tracking-tight">Live</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-600 relative">
              <PlayCircle className="w-5 h-5 stroke-[1.8]" />
              {liveCount > 0 && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
              <span className="text-[10px] font-medium mt-1">Live</span>
            </div>
          )}
        </button>

        {/* Tab 4: Menu */}
        <button
          onClick={() => onChangeTab('menu')}
          className="flex flex-col items-center justify-center min-w-[64px] py-1 focus:outline-none transition-all group"
        >
          {activeTab === 'menu' ? (
            <div className="w-12 h-10 rounded-xl bg-gradient-to-b from-[#34b69f] to-[#1da189] text-white flex flex-col items-center justify-center shadow-sm">
              <Grid className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[9px] font-bold mt-0.5 tracking-tight">Menu</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-600">
              <Grid className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] font-medium mt-1">Menu</span>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
};
