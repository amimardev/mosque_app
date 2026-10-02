import React from 'react';
import { Scholar } from './types';
import { SCHOLARS } from './mockData';

interface ScholarsStoriesProps {
  onSelectScholar: (scholar: Scholar) => void;
}

export const ScholarsStories: React.FC<ScholarsStoriesProps> = ({ onSelectScholar }) => {
  return (
    <section className="w-full py-2.5 px-4">
      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1">
        {SCHOLARS.map((scholar) => (
          <button
            key={scholar.id}
            onClick={() => onSelectScholar(scholar)}
            className="flex flex-col items-center shrink-0 focus:outline-none group"
          >
            {/* Circular Avatar Container with dynamic LIVE ring */}
            <div className="relative">
              <div 
                className={`w-[60px] h-[60px] rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 group-active:scale-95 ${
                  scholar.isLive
                    ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-white'
                    : 'ring-1 ring-gray-200 ring-offset-1 ring-offset-white'
                }`}
              >
                <img
                  src={scholar.avatar}
                  alt={scholar.name}
                  className="w-full h-full rounded-full object-cover bg-gray-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Red LIVE badge matching the screenshot */}
              {scholar.isLive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black px-1.5 py-[1px] rounded-full flex items-center gap-1 shadow-xs tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>LIVE</span>
                </div>
              )}
            </div>

            {/* Optional subtle name truncated */}
            <span className="text-[10px] text-gray-700 font-semibold mt-2 max-w-[62px] truncate text-center">
              {scholar.name.split(' ')[1] || scholar.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
