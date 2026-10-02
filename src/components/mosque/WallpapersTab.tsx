import React, { useState } from 'react';
import { Download, Sparkles, Check } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from './mockData';
import type { WallpaperItem } from './types';

export const WallpapersTab: React.FC<{ wallpapers: WallpaperItem[] }> = ({ wallpapers }) => {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (id: string, url: string) => {
    setDownloadedId(id);
    const link = document.createElement('a');
    link.href = url;
    link.download = `islamic_wallpaper_${id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Islamic Wallpapers</h2>
        <p className="text-xs text-gray-500">Curated high-resolution wallpapers for your lock screen</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {wallpapers.map((wall) => (
          <div
            key={wall.id}
            className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-950 aspect-[9/14]"
          >
            <img
              src={wall.imageUrl || PLACEHOLDER_IMAGES.wallpaper}
              alt={wall.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end text-white">
              <span className="text-[10px] text-emerald-300 font-bold">{wall.category}</span>
              <h4 className="text-xs font-bold leading-tight line-clamp-2 mt-0.5">{wall.title}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{wall.downloads.toLocaleString()} downloads</p>
              
              <button
                onClick={() => handleDownload(wall.id, wall.imageUrl || PLACEHOLDER_IMAGES.wallpaper)}
                className="mt-2.5 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#1fa38b] hover:bg-[#188874] text-[11px] font-bold text-white transition-all shadow-xs active:scale-95"
              >
                {downloadedId === wall.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
