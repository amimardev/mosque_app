import React from 'react';
import { Bell } from 'lucide-react';

interface MosqueHeaderProps {
  onOpenNotifications: () => void;
  onOpenMosqueInfo: () => void;
  unreadCount?: number;
}

export const MosqueHeader: React.FC<MosqueHeaderProps> = ({
  onOpenNotifications,
  onOpenMosqueInfo,
  unreadCount = 2,
}) => {
  return (
    <header className="flex items-center justify-between px-5 pt-3 pb-2 w-full">
      {/* Mosque Avatar & Information */}
      <button 
        onClick={onOpenMosqueInfo}
        className="flex items-center gap-3 text-left focus:outline-none group active:scale-[0.98] transition-transform"
      >
        {/* Soft teal circle avatar with white mosque silhouette */}
        <div className="w-12 h-12 rounded-full bg-[#72c2b3] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
          <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 6C11.5 8 8 10.5 8 16H20C20 10.5 16.5 8 14 6Z" fill="white" />
            <path d="M6 14L7 12L8 14V21H6V14Z" fill="white" />
            <path d="M20 14L21 12L22 14V21H20V14Z" fill="white" />
            <rect x="7" y="16" width="14" height="6" rx="1" fill="white" />
            <path d="M12 22V18C12 17 13 16 14 16C15 16 16 17 16 18V22H12Z" fill="#58a798" />
            <circle cx="14" cy="4.5" r="1" fill="white" />
            <path d="M14 5.5V6" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        {/* Title and Subtitle */}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight truncate">
            Ahmedpur Mosque
          </h1>
          <p className="text-xs text-gray-500 font-medium truncate max-w-[210px] sm:max-w-xs">
            Ahmedpur, Borolia, Pirgonj, Bangladesh
          </p>
        </div>
      </button>

      {/* Notification Bell Button */}
      <button
        onClick={onOpenNotifications}
        className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200/80 active:bg-gray-300 text-gray-800 flex items-center justify-center shrink-0 relative transition-all shadow-xs"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-800 stroke-[2.2]" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 end-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>
    </header>
  );
};
