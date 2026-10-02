import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  BookOpen, 
  Heart, 
  Compass, 
  Bell, 
  Globe, 
  Phone, 
  ChevronRight,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface MosqueMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFeature: (feature: any) => void;
  onOpenNotifications: () => void;
}

export const MosqueMenuSheet: React.FC<MosqueMenuSheetProps> = ({
  isOpen,
  onClose,
  onOpenFeature,
  onOpenNotifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#72c2b3] flex items-center justify-center text-white font-bold text-sm">
              🕌
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">Ahmedpur Mosque</h3>
              <p className="text-xs text-gray-500">Pirgonj, Rangpur, Bangladesh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-1 overflow-y-auto no-scrollbar flex-1">
          <button
            onClick={() => {
              onClose();
              onOpenFeature('mosque');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1fa38b] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-gray-900 block">About Mosque & Facilities</strong>
                <span className="text-[11px] text-gray-500">History, capacity, and committee</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenFeature('quran');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1fa38b] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-gray-900 block">Al-Quran & Tajweed</strong>
                <span className="text-[11px] text-gray-500">Read verses and listen to recitation</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenFeature('donation');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1fa38b] flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-gray-900 block">Sadaqah & Mosque Funds</strong>
                <span className="text-[11px] text-gray-500">Minaret project, Iftar, madrasa</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenFeature('qibla');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1fa38b] flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-gray-900 block">Qibla Direction Compass</strong>
                <span className="text-[11px] text-gray-500">282° WNW towards Makkah</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenNotifications();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1fa38b] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-gray-900 block">Prayer Alerts & Adhan</strong>
                <span className="text-[11px] text-gray-500">Configure notifications</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Mosque Administration Link */}
          <Link
            to="/dashboard"
            onClick={onClose}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-gray-900 block">Mosque Management Portal</strong>
                <span className="text-[11px] text-gray-500">Admin dashboard & records</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/60 text-center text-[11px] text-gray-500">
          <p>Ahmedpur Mosque App v2.4 • Pirgonj, Bangladesh</p>
        </div>
      </div>
    </div>
  );
};
