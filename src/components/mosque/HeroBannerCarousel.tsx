import React, { useState } from 'react';
import { PLACEHOLDER_IMAGES } from './mockData';

interface HeroBannerCarouselProps {
  onStartQuran: () => void;
  onExploreHadith: () => void;
  onOpenDonation: () => void;
}

export const HeroBannerCarousel: React.FC<HeroBannerCarouselProps> = ({
  onStartQuran,
  onExploreHadith,
  onOpenDonation
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const banners = [
    {
      id: 'quran',
      subtitle: 'Learn Quran',
      title: 'Enrich your Soul everyday',
      buttonText: 'Get Start Now',
      color: 'bg-gradient-to-r from-[#20a38b] to-[#15806c]',
      buttonColor: 'bg-white text-[#1b8c77]',
      action: onStartQuran,
      hasIllustration: true
    },
    {
      id: 'hadith',
      subtitle: 'Daily Wisdom',
      title: 'Light of Prophetic Sunnah',
      buttonText: 'Read Today',
      color: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706]',
      buttonColor: 'bg-white text-[#d97706]',
      action: onExploreHadith,
      hasIllustration: false
    },
    {
      id: 'sadaqah',
      subtitle: 'Sadaqah Jariyah',
      title: 'Build the Mosque Minaret',
      buttonText: 'Donate ৳500',
      color: 'bg-gradient-to-r from-[#0d9488] to-[#047857]',
      buttonColor: 'bg-white text-[#047857]',
      action: onOpenDonation,
      hasIllustration: false
    }
  ];

  const current = banners[activeIndex];

  return (
    <section className="w-full px-4 py-2">
      {/* Container with side peeking cards effect */}
      <div className="relative overflow-hidden flex items-center justify-center">
        {/* Left Side Peek Card (Warm Amber as in screenshot) */}
        <div 
          onClick={() => setActiveIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
          className="absolute -left-12 sm:-left-8 w-16 h-32 rounded-2xl bg-[#fab84b] opacity-80 cursor-pointer shadow-xs transition-transform hover:scale-95 z-0" 
        />

        {/* Right Side Peek Card (Warm Amber as in screenshot) */}
        <div 
          onClick={() => setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
          className="absolute -right-12 sm:-right-8 w-16 h-32 rounded-2xl bg-[#fab84b] opacity-80 cursor-pointer shadow-xs transition-transform hover:scale-95 z-0" 
        />

        {/* Central Active Banner Card matching screenshot */}
        <div 
          className={`relative z-10 w-full max-w-[340px] sm:max-w-[360px] h-[135px] rounded-2xl p-4 text-white shadow-md flex items-center justify-between overflow-hidden transition-all duration-300 ${current.color}`}
        >
          {/* Left Text & CTA */}
          <div className="flex flex-col justify-between h-full z-10 max-w-[190px]">
            <div>
              <span className="text-[11px] font-semibold text-emerald-100 tracking-wide uppercase">
                {current.subtitle}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold leading-tight text-white mt-0.5">
                {current.title}
              </h2>
            </div>

            <button
              onClick={current.action}
              className={`inline-flex items-center justify-center self-start text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-xs active:scale-95 transition-all ${current.buttonColor}`}
            >
              {current.buttonText}
            </button>
          </div>

          {/* Right Mosque Illustration */}
          <div className="relative w-28 h-28 -mr-1 shrink-0 flex items-center justify-center">
            {current.hasIllustration ? (
              <img
                src={PLACEHOLDER_IMAGES.mosqueHero}
                alt="Mosque Dome"
                className="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none rounded-xl"
                loading="eager"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <span className="text-3xl">🕌</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Carousel Indicator Dots matching screenshot */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-200 ${
              activeIndex === idx
                ? 'w-5 h-1.5 rounded-full bg-[#20a38b]'
                : 'w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
