import React from 'react';

// 1. Al-Quran: Open book on a wooden rehal stand
export const QuranIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Wooden Rehal Stand */}
    <path d="M10 38L24 28L38 38M14 41L24 33L34 41" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 37L36 37" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
    {/* Left Open Page */}
    <path d="M24 26C18 24 10 25 7 28V14C10 11 18 11 24 13V26Z" fill="#10B981" />
    <path d="M24 26C18 24 10 25 7 28V14C10 11 18 11 24 13V26Z" stroke="#059669" strokeWidth="1.5" />
    {/* Right Open Page */}
    <path d="M24 26C30 24 38 25 41 28V14C38 11 30 11 24 13V26Z" fill="#34D399" />
    <path d="M24 26C30 24 38 25 41 28V14C38 11 30 11 24 13V26Z" stroke="#059669" strokeWidth="1.5" />
    {/* Gold Calligraphy / Accents */}
    <path d="M11 17H19M11 20H17" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M29 17H37M31 20H37" stroke="#ECFDF5" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="24" cy="18" r="2" fill="#F59E0B" />
  </svg>
);

// 2. Hadith: Golden hardcover Hadith book with ribbon
export const HadithIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Book spine & cover shadow */}
    <rect x="12" y="8" width="24" height="32" rx="3" fill="#D97706" />
    {/* Main Golden Book Cover */}
    <rect x="14" y="8" width="23" height="31" rx="2.5" fill="#F59E0B" />
    {/* Book Pages Edge */}
    <rect x="16" y="10" width="19" height="27" rx="1.5" fill="#FDE68A" />
    <rect x="15" y="10" width="2" height="27" fill="#F59E0B" />
    {/* Islamic Ornament on cover */}
    <circle cx="25" cy="22" r="5" stroke="#B45309" strokeWidth="1.5" fill="#FEF3C7" />
    <path d="M25 19V25M22 22H28" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
    {/* Bookmark Ribbon hanging down */}
    <path d="M24 37V42L26.5 40L29 42V37H24Z" fill="#DC2626" />
  </svg>
);

// 3. Tasbih: Green prayer beads with electronic counter / tassel
export const TasbihIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Beads string loop */}
    <path d="M14 22C14 15 18 10 24 10C30 10 34 15 34 22C34 27 30 30 26 31" stroke="#059669" strokeWidth="2" strokeDasharray="3 3" />
    {/* Prominent Beads */}
    <circle cx="16" cy="14" r="3" fill="#10B981" />
    <circle cx="22" cy="11" r="3" fill="#34D399" />
    <circle cx="28" cy="11" r="3" fill="#10B981" />
    <circle cx="33" cy="15" r="3" fill="#34D399" />
    <circle cx="34" cy="21" r="3" fill="#10B981" />
    <circle cx="31" cy="27" r="3" fill="#34D399" />
    <circle cx="25" cy="30" r="3.5" fill="#047857" />
    {/* Hanging Tassel */}
    <path d="M25 34V42M23 42H27" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="25" cy="35" r="1.5" fill="#F59E0B" />
  </svg>
);

// 4. Dua: Person praying with hands raised under star
export const DuaIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Star / Sparkle of divine light */}
    <path d="M33 11L34.5 14.5L38 16L34.5 17.5L33 21L31.5 17.5L28 16L31.5 14.5L33 11Z" fill="#F59E0B" />
    <circle cx="15" cy="14" r="1" fill="#FBBF24" />
    {/* Praying silhouette head */}
    <circle cx="21" cy="17" r="4.5" fill="#0F766E" />
    {/* Raised arms and kneeling body in supplication */}
    <path d="M15 38C15 34 17 30 21 28C24 28 27 28 29 25C30 24 31 23 32 23C32.5 23 33 24 32.5 25C31.5 27 29.5 29 27 30L26 38H15Z" fill="#14B8A6" />
    <path d="M21 28L25 24C26 23 27 23 28 24" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
    {/* Prayer mat baseline */}
    <rect x="12" y="38" width="24" height="2" rx="1" fill="#CBD5E1" />
  </svg>
);

// 5. Donation: Soft box with gold trim & red heart (Sadaqah)
export const DonationIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Donation Box body */}
    <rect x="11" y="19" width="26" height="20" rx="3.5" fill="#A7D7C5" />
    <rect x="11" y="17" width="26" height="5" rx="2" fill="#74B49B" />
    {/* Coin Slot on top */}
    <rect x="20" y="15" width="8" height="2" rx="1" fill="#5C8D89" />
    {/* Red Heart Icon in center */}
    <path d="M24 26.5C24 26.5 21 23.5 18.5 25C16.5 26.5 17 29.5 24 34C31 29.5 31.5 26.5 29.5 25C27 23.5 24 26.5 24 26.5Z" fill="#EF4444" />
  </svg>
);

// 6. Wallpaper: Blue scenic landscape image card
export const WallpaperIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Outer Rounded Blue Canvas */}
    <rect x="10" y="10" width="28" height="28" rx="5" fill="#38BDF8" />
    {/* Sun / Moon in sky */}
    <circle cx="18" cy="18" r="3.5" fill="#FEF08A" />
    {/* Mountain silhouettes */}
    <path d="M12 36L22 24L30 33L36 28L38 36H12Z" fill="#0284C7" />
    <path d="M22 24L26 29L30 33L22 24Z" fill="#E0F2FE" opacity="0.8" />
  </svg>
);

// 7. Zakat: Green money pouch tied with gold ribbon and coins
export const ZakatIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Hand holding or pouch base */}
    <path d="M14 26C14 20 18 17 24 17C30 17 34 20 34 26C35 32 32 38 24 38C16 38 13 32 14 26Z" fill="#34D399" />
    <path d="M14 26C14 20 18 17 24 17C30 17 34 20 34 26C35 32 32 38 24 38C16 38 13 32 14 26Z" stroke="#059669" strokeWidth="1.5" />
    {/* Pouch ruffled top */}
    <path d="M19 14L24 17L29 14C27 12 21 12 19 14Z" fill="#10B981" />
    {/* Golden tie band */}
    <path d="M18 18H30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    {/* Gold coin badge */}
    <circle cx="24" cy="27" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    <path d="M24 24.5V29.5M22.5 26H25.5" stroke="#92400E" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// 8. Mosque: Emerald green mosque dome with crescent
export const MosqueDomeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Base wall */}
    <rect x="12" y="27" width="24" height="11" rx="1.5" fill="#0D9488" />
    {/* Arched central door */}
    <path d="M21 38V31C21 29.5 22.5 28 24 28C25.5 28 27 29.5 27 31V38H21Z" fill="#134E4A" />
    {/* Central Dome */}
    <path d="M14 27C14 18 20 14 24 11C28 14 34 18 34 27H14Z" fill="#14B8A6" />
    {/* Left & Right Minarets */}
    <rect x="9" y="19" width="3" height="19" rx="1" fill="#0D9488" />
    <path d="M9 19L10.5 16L12 19H9Z" fill="#14B8A6" />
    <rect x="36" y="19" width="3" height="19" rx="1" fill="#0D9488" />
    <path d="M36 19L37.5 16L39 19H36Z" fill="#14B8A6" />
    {/* Golden Crescent Finial on dome */}
    <circle cx="24" cy="8.5" r="1.5" fill="#F59E0B" />
    <path d="M24 10V11" stroke="#F59E0B" strokeWidth="1.5" />
  </svg>
);

// 9. Qibla: Kaaba with compass ring and arrow pointer
export const QiblaIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Circular Compass Dial */}
    <circle cx="24" cy="24" r="17" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2.5" />
    {/* North / Direction Tick */}
    <path d="M24 9V12" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
    {/* 3D Kaaba in center */}
    <path d="M18 21L24 17L30 21V30L24 33L18 30V21Z" fill="#1F2937" />
    {/* Kiswah Golden Band */}
    <path d="M18 23L24 19L30 23" stroke="#F59E0B" strokeWidth="1.5" />
    {/* Door of Kaaba */}
    <rect x="25.5" y="24" width="2" height="4" fill="#F59E0B" rx="0.5" />
  </svg>
);
