export interface Scholar {
  id: string;
  name: string;
  title: string;
  avatar: string;
  isLive: boolean;
  topic?: string;
  viewers?: string;
  bio?: string;
}

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  iqamah: string;
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

export interface QuranSurah {
  number: number;
  nameEnglish: string;
  nameArabic: string;
  meaning: string;
  totalVerses: number;
  revelationType: 'Meccan' | 'Medinan';
  verses: {
    number: number;
    arabic: string;
    transliteration: string;
    translationEn: string;
    translationBn: string;
  }[];
}

export interface HadithItem {
  id: string;
  book: string;
  number: string;
  chapter: string;
  narrator: string;
  arabic: string;
  translation: string;
  grade: string;
}

export interface DuaItem {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  benefit: string;
}

export interface WallpaperItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  downloads: number;
}

export interface DonationProject {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
}
