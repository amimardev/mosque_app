import React from 'react';
import { Play, Users, MessageSquare } from 'lucide-react';
import { SCHOLARS } from './mockData';
import { Scholar } from './types';

interface LiveStreamTabProps {
  onSelectScholar: (scholar: Scholar) => void;
}

export const LiveStreamTab: React.FC<LiveStreamTabProps> = ({ onSelectScholar }) => {
  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Islamic Live Broadcasts</h2>
          <p className="text-xs text-gray-500">Live khutbahs, Quran circles, and Islamic lectures</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-[11px] font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          2 Live Now
        </span>
      </div>

      <div className="space-y-3">
        {SCHOLARS.map((scholar) => (
          <div
            key={scholar.id}
            onClick={() => onSelectScholar(scholar)}
            className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center gap-3.5 group"
          >
            <div className="relative shrink-0">
              <img
                src={scholar.avatar}
                alt={scholar.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />
              {scholar.isLive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black tracking-wider">
                  LIVE
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-gray-900 truncate">{scholar.name}</h4>
              </div>
              <p className="text-xs font-semibold text-[#1fa38b] line-clamp-1 mt-0.5">{scholar.topic}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {scholar.viewers || 'Offline'}
                </span>
                <span>•</span>
                <span>{scholar.title}</span>
              </div>
            </div>

            <button className="w-9 h-9 rounded-full bg-[#1fa38b]/10 text-[#1fa38b] group-hover:bg-[#1fa38b] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
