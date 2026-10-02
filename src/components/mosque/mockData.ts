import { Scholar, QuranSurah, HadithItem, DuaItem, WallpaperItem, DonationProject } from './types';

// Generated authentic assets
import heroMosqueImg from '@/assets/images/hero_mosque_illustration_1790525295748.jpg';
import scholar1Img from '@/assets/images/scholar_imam_avatar_1_1790525305502.jpg';
import scholar2Img from '@/assets/images/scholar_imam_avatar_2_1790525315732.jpg';
import scholar3Img from '@/assets/images/scholar_imam_avatar_3_1790525326637.jpg';
import wallpaperMosqueImg from '@/assets/images/islamic_wallpaper_mosque_1790525336507.jpg';

export { heroMosqueImg, wallpaperMosqueImg };

export const SCHOLARS: Scholar[] = [
  {
    id: 'scholar-1',
    name: 'Mawlana Abdur Rahman',
    title: 'Head Imam & Khatib',
    avatar: scholar1Img,
    isLive: false,
    topic: 'Tafsir of Surah Al-Kahf & Weekly Guidance',
    bio: 'Graduate of Darul Uloom Deoband, 25+ years serving the Ahmedpur community.'
  },
  {
    id: 'scholar-2',
    name: 'Shaykh Ahmadullah',
    title: 'Islamic Scholar & Speaker',
    avatar: scholar2Img,
    isLive: true,
    topic: 'Tazkiyah: Cleansing the Heart in the Modern Age',
    viewers: '2.4k',
    bio: 'Renowned Da’i and founder of As-Sunnah Foundation, broadcasting live to over 100 countries.'
  },
  {
    id: 'scholar-3',
    name: 'Mufti Mizanur Rahman',
    title: 'Senior Fiqh Specialist',
    avatar: scholar3Img,
    isLive: false,
    topic: 'Contemporary Financial Ethics & Zakat Rules',
    bio: 'Author of several Islamic jurisprudence treatises and advisor to national educational boards.'
  },
  {
    id: 'scholar-4',
    name: 'Qari Salman Al-Hafiz',
    title: 'Qari & Quran Instructor',
    avatar: scholar2Img,
    isLive: true,
    topic: 'Live Tarawih & Tahajjud Recitation with Tajweed',
    viewers: '1.8k',
    bio: 'Certified in the Ten Qira’at, instructor of Quranic memorization at Ahmedpur Madrasa.'
  },
  {
    id: 'scholar-5',
    name: 'Mawlana Tariq Jameel',
    title: 'Global Islamic Scholar',
    avatar: scholar1Img,
    isLive: false,
    topic: 'The Mercy of the Prophet Muhammad (ﷺ)',
    bio: 'World-renowned scholar known for spiritual reformation and peaceful coexistence.'
  }
];

export const SURAHS: QuranSurah[] = [
  {
    number: 1,
    nameEnglish: 'Al-Fatihah',
    nameArabic: 'الفاتحة',
    meaning: 'The Opening',
    totalVerses: 7,
    revelationType: 'Meccan',
    verses: [
      {
        number: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Bismillahir-Rahmanir-Rahim',
        translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        translationBn: 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি।'
      },
      {
        number: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Al-hamdu lillahi Rabbil-alamin',
        translationEn: '[All] praise is [due] to Allah, Lord of the worlds.',
        translationBn: 'সকল প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টির প্রতিপালক।'
      },
      {
        number: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Ar-Rahmanir-Rahim',
        translationEn: 'The Entirely Merciful, the Especially Merciful.',
        translationBn: 'যিনি অতি দয়ালু ও পরম করুণাময়।'
      },
      {
        number: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Maliki yawmid-din',
        translationEn: 'Sovereign of the Day of Recompense.',
        translationBn: 'বিচার দিবসের অধিপতি।'
      },
      {
        number: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Iyyaka na\'budu wa iyyaka nasta\'in',
        translationEn: 'It is You we worship and You we ask for help.',
        translationBn: 'আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই সাহায্য প্রার্থনা করি।'
      },
      {
        number: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdinas-siratal-mustaqim',
        translationEn: 'Guide us to the straight path.',
        translationBn: 'আমাদের সরল সঠিক পথ প্রদর্শন করুন।'
      },
      {
        number: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Siratalladhina an\'amta \'alayhim ghayril-maghdubi \'alayhim walad-dallin',
        translationEn: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        translationBn: 'তাদের পথ যাদের আপনি অনুগ্রহ দান করেছেন; তাদের পথ নয় যাদের ওপর আপনার ক্রোধ পতিত হয়েছে এবং যারা পথভ্রষ্ট হয়েছে।'
      }
    ]
  },
  {
    number: 112,
    nameEnglish: 'Al-Ikhlas',
    nameArabic: 'الإخلاص',
    meaning: 'The Sincerity',
    totalVerses: 4,
    revelationType: 'Meccan',
    verses: [
      {
        number: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'Qul huwa Allahu ahad',
        translationEn: 'Say, "He is Allah, [who is] One,',
        translationBn: 'বলুন, তিনিই আল্লাহ, এক-অদ্বিতীয়।'
      },
      {
        number: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteration: 'Allahu samad',
        translationEn: 'Allah, the Eternal Refuge.',
        translationBn: 'আল্লাহ কারো মুখাপেক্ষী নন, সকলেই তাঁর মুখাপেক্ষী।'
      },
      {
        number: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: 'Lam yalid wa lam yulad',
        translationEn: 'He neither begets nor is born,',
        translationBn: 'তিনি কাউকে জন্ম দেননি এবং তিনিও কারো থেকে জন্মগ্রহণ করেননি।'
      },
      {
        number: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Wa lam yakun lahu kufuwan ahad',
        translationEn: 'Nor is there to Him any equivalent."',
        translationBn: 'এবং তাঁর সমকক্ষ কেউ নেই।'
      }
    ]
  },
  {
    number: 113,
    nameEnglish: 'Al-Falaq',
    nameArabic: 'الفلق',
    meaning: 'The Daybreak',
    totalVerses: 5,
    revelationType: 'Meccan',
    verses: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: 'Qul a\'udhu bi rabbil-falaq',
        translationEn: 'Say, "I seek refuge in the Lord of daybreak',
        translationBn: 'বলুন, আমি আশ্রয় প্রার্থনা করছি প্রভাতের পালনকর্তার কাছে।'
      },
      {
        number: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: 'Min sharri ma khalaq',
        translationEn: 'From the evil of that which He created',
        translationBn: 'তিনি যা সৃষ্টি করেছেন তার অনিষ্ট থেকে।'
      },
      {
        number: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteration: 'Wa min sharri ghasiqin idha waqab',
        translationEn: 'And from the evil of darkness when it settles',
        translationBn: 'এবং রাতের অন্ধকারের অনিষ্ট থেকে যখন তা গাঢ় হয়।'
      },
      {
        number: 4,
        arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        transliteration: 'Wa min sharrin-naffathati fil-\'uqad',
        translationEn: 'And from the evil of the blowers in knots',
        translationBn: 'এবং গ্রন্থিতে ফুঁ দানকারী যাদুকরিদের অনিষ্ট থেকে।'
      },
      {
        number: 5,
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Wa min sharri hasidin idha hasad',
        translationEn: 'And from the evil of an envier when he envies."',
        translationBn: 'এবং হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।'
      }
    ]
  },
  {
    number: 114,
    nameEnglish: 'An-Nas',
    nameArabic: 'الناس',
    meaning: 'Mankind',
    totalVerses: 6,
    revelationType: 'Meccan',
    verses: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: 'Qul a\'udhu bi rabbin-nas',
        translationEn: 'Say, "I seek refuge in the Lord of mankind,',
        translationBn: 'বলুন, আমি মানুষের প্রতিপালকের আশ্রয় গ্রহণ করছি।'
      },
      {
        number: 2,
        arabic: 'مَلِكِ النَّاسِ',
        transliteration: 'Malikin-nas',
        translationEn: 'The Sovereign of mankind,',
        translationBn: 'মানুষের অধিপতির।'
      },
      {
        number: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        transliteration: 'Ilahin-nas',
        translationEn: 'The God of mankind,',
        translationBn: 'মানুষের মাবুদের।'
      },
      {
        number: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        transliteration: 'Min sharril-waswasil-khannas',
        translationEn: 'From the evil of the retreating whisperer -',
        translationBn: 'পলায়মান কুমন্ত্রণাদাতার অনিষ্ট থেকে।'
      },
      {
        number: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        transliteration: 'Alladhi yuwaswisu fee sudoorin-nas',
        translationEn: 'Who whispers [evil] into the breasts of mankind -',
        translationBn: 'যে মানুষের অন্তরে কুমন্ত্রণা দেয়।'
      },
      {
        number: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Minal-jinnati wan-nas',
        translationEn: 'From among the jinn and mankind."',
        translationBn: 'জিন ও মানুষের মধ্য থেকে।'
      }
    ]
  }
];

export const HADITHS: HadithItem[] = [
  {
    id: 'hadith-1',
    book: 'Sahih al-Bukhari',
    number: 'Hadith 1',
    chapter: 'Revelation',
    narrator: 'Umar ibn al-Khattab (RA)',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    translation: 'Actions are judged by intentions, and every person will be rewarded according to what he intended.',
    grade: 'Sahih (Authentic)'
  },
  {
    id: 'hadith-2',
    book: 'Sahih Muslim',
    number: 'Hadith 223',
    chapter: 'Purification',
    narrator: 'Abu Malik al-Ash’ari (RA)',
    arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ',
    translation: 'Purity is half of faith, and "Al-hamdulillah" fills the scales of good deeds.',
    grade: 'Sahih (Authentic)'
  },
  {
    id: 'hadith-3',
    book: 'Sunan at-Tirmidhi',
    number: 'Hadith 2317',
    chapter: 'Virtue of Knowledge',
    narrator: 'Abu Hurairah (RA)',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: 'Whoever treads a path in search of knowledge, Allah will make easy for him the path to Paradise.',
    grade: 'Sahih (Authentic)'
  },
  {
    id: 'hadith-4',
    book: 'Sahih al-Bukhari',
    number: 'Hadith 6011',
    chapter: 'Good Manners',
    narrator: 'Abu Hurairah (RA)',
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    translation: 'A true Muslim is the one from whose tongue and hands other Muslims are safe.',
    grade: 'Sahih (Authentic)'
  }
];

export const DUAS: DuaItem[] = [
  {
    id: 'dua-1',
    category: 'Morning & Evening',
    title: 'Sayyidul Istighfar (Chief of Forgiveness)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    transliteration: 'Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana \'abduka, wa ana \'ala \'ahdika wa wa\'dika mastata\'t...',
    translation: 'O Allah, You are my Lord, there is no deity worthy of worship except You. You created me and I am Your servant, and I abide by Your covenant and promise as best as I can.',
    reference: 'Sahih al-Bukhari 6306',
    benefit: 'Whoever recites this with firm faith in the morning and dies before evening will be among the people of Paradise.'
  },
  {
    id: 'dua-2',
    category: 'Protection',
    title: 'Protection Against All Harm',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa Huwas-Sami\'ul-\'Alim',
    translation: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    reference: 'Sunan Abi Dawud 5088',
    benefit: 'Recited 3 times morning and evening, nothing shall harm the believer.'
  },
  {
    id: 'dua-3',
    category: 'Daily Life',
    title: 'Upon Leaving Home',
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi, tawakkaltu \'alallahi, wa la hawla wa la quwwata illa billah',
    translation: 'In the Name of Allah, I place my trust in Allah; there is no might nor power except with Allah.',
    reference: 'Sunan Abi Dawud 5095',
    benefit: 'Angels proclaim: "You are guided, defended, and protected," and devils distance themselves.'
  },
  {
    id: 'dua-4',
    category: 'Knowledge',
    title: 'Supplication for Increasing Knowledge',
    arabic: 'رَّبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni \'ilma',
    translation: 'My Lord, increase me in beneficial knowledge.',
    reference: 'Surah Ta-Ha, 20:114',
    benefit: 'The Quranic supplication commanded directly by Allah to Prophet Muhammad (ﷺ).'
  }
];

export const WALLPAPERS: WallpaperItem[] = [
  {
    id: 'wall-1',
    title: 'Majestic Mosque Minarets at Twilight',
    category: 'Mosques',
    imageUrl: wallpaperMosqueImg,
    downloads: 14820
  },
  {
    id: 'wall-2',
    title: 'Masjid an-Nabawi Umbrella Courtyard',
    category: 'Holy Sites',
    imageUrl: wallpaperMosqueImg,
    downloads: 28410
  },
  {
    id: 'wall-3',
    title: 'Golden Thuluth Arabic Calligraphy',
    category: 'Calligraphy',
    imageUrl: wallpaperMosqueImg,
    downloads: 9430
  },
  {
    id: 'wall-4',
    title: 'Arabesque Geometrical Star Mosaic',
    category: 'Patterns',
    imageUrl: wallpaperMosqueImg,
    downloads: 12150
  }
];

export const DONATION_PROJECTS: DonationProject[] = [
  {
    id: 'proj-1',
    title: 'Ahmedpur Mosque Minaret & Solar Project',
    description: 'Constructing the iconic 65-foot minaret and installing eco-friendly 15kW solar panels to power the prayer halls during summer heatwaves.',
    goal: 500000,
    raised: 392000,
    category: 'Infrastructure'
  },
  {
    id: 'proj-2',
    title: 'Orphan & Madrasa Student Sponsorship',
    description: 'Providing meals, books, and living stipends for 45 full-time Quran memorization students from under-resourced families.',
    goal: 240000,
    raised: 185000,
    category: 'Education'
  },
  {
    id: 'proj-3',
    title: 'Daily Ramadan Community Iftar',
    description: 'Feeding over 350 fasting worshippers every evening of Ramadan with nutritious hot meals in the mosque courtyard.',
    goal: 150000,
    raised: 112000,
    category: 'Sadaqah'
  }
];
