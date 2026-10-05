export type MusicGenre =
  | 'Fokus va kodlash'
  | 'Lo-Fi va dam olish'
  | 'Elektron va sintez'
  | 'Akustik va klassik'
  | 'Kinematografik'
  | 'Tabiat va meditatsiya';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: MusicGenre;
  durationSeconds: number;
  durationFormatted: string;
  bpm: number;
  isNew: boolean;
  isPopular: boolean;
  isPremium?: boolean;
  licenseInfo: string;
  description: string;
  accentColor: string;
  /**
   * Procedural synthesis parameters for 100% original, legal, in-browser studio audio
   */
  synthConfig: {
    rootFreq: number;
    chordRatios: number[];
    melodyNotes: number[];
    tempoBpm: number;
    waveType: OscillatorType;
  };
}

export const MUSIC_GENRES: { name: MusicGenre; emoji: string; description: string }[] = [
  {
    name: 'Fokus va kodlash',
    emoji: '🎧',
    description: 'Dasturlash va diqqatni jamlash uchun barqaror ritmli instrumental ohanglar.',
  },
  {
    name: 'Lo-Fi va dam olish',
    emoji: '☕',
    description: 'Yumshoq akkordlar va sokin kechki mutolaa uchun yoqimli Lo-Fi kompozitsiyalar.',
  },
  {
    name: 'Elektron va sintez',
    emoji: '🎹',
    description: 'Zamonaviy sintezator to‘lqinlari, kiber-atmosfera va tetiklantiruvchi elektron ritmlar.',
  },
  {
    name: 'Akustik va klassik',
    emoji: '🎻',
    description: 'Fortepiano va torli cholg‘ular uyg‘unligidagi klassik hamda minimalistik kuylar.',
  },
  {
    name: 'Kinematografik',
    emoji: '🎬',
    description: 'Video montaj va ijodiy loyihalar uchun ilhomlantiruvchi keng ko‘lamli saundtreklar.',
  },
  {
    name: 'Tabiat va meditatsiya',
    emoji: '🌿',
    description: 'Asabni tinchlantiruvchi ambient harmoniyalar va chuqur nafas mashqlari uchun fon.',
  },
];

export const MUSIC_CATALOG: MusicTrack[] = [
  {
    id: 'trk-tashkent-nights',
    title: 'Toshkent Oqshomi (Ambient Lo-Fi)',
    artist: 'Smart Download Studio',
    genre: 'Lo-Fi va dam olish',
    durationSeconds: 165,
    durationFormatted: '02:45',
    bpm: 78,
    isNew: false,
    isPopular: true,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Kechki dam olish va yengil mutolaa uchun yumshoq elektr pianino akkordlari.',
    accentColor: '#6366F1',
    synthConfig: {
      rootFreq: 220, // A3
      chordRatios: [1, 1.2, 1.5, 1.8],
      melodyNotes: [220, 261.63, 329.63, 392.0, 329.63, 293.66],
      tempoBpm: 78,
      waveType: 'sine',
    },
  },
  {
    id: 'trk-deep-code-flow',
    title: 'Deep Code Flow v2',
    artist: 'Algoritm Beats',
    genre: 'Fokus va kodlash',
    durationSeconds: 192,
    durationFormatted: '03:12',
    bpm: 92,
    isNew: true,
    isPopular: true,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Dasturlash va murakkab algoritmlar ustida ishlashda chalg‘itmaydigan chuqur fokus ohangi.',
    accentColor: '#2563EB',
    synthConfig: {
      rootFreq: 196.0, // G3
      chordRatios: [1, 1.25, 1.5, 1.875],
      melodyNotes: [196.0, 246.94, 293.66, 392.0, 293.66, 246.94],
      tempoBpm: 92,
      waveType: 'triangle',
    },
  },
  {
    id: 'trk-samarkand-dawn',
    title: 'Registon Tongi',
    artist: 'Navo Instrumental',
    genre: 'Kinematografik',
    durationSeconds: 210,
    durationFormatted: '03:30',
    bpm: 72,
    isNew: true,
    isPopular: true,
    isPremium: true,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Sharqona garmoniya va keng sahnali kinematografik sintezator ohanglari.',
    accentColor: '#0284C7',
    synthConfig: {
      rootFreq: 174.61, // F3
      chordRatios: [1, 1.2, 1.5, 2.0],
      melodyNotes: [174.61, 207.65, 261.63, 349.23, 311.13, 261.63],
      tempoBpm: 72,
      waveType: 'sine',
    },
  },
  {
    id: 'trk-cyber-compile',
    title: 'Neon Kompilyator',
    artist: 'SynthWave UZ',
    genre: 'Elektron va sintez',
    durationSeconds: 180,
    durationFormatted: '03:00',
    bpm: 110,
    isNew: false,
    isPopular: true,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: '80-yillar analog sintezatorlari uslubidagi zamonaviy elektron arpedjio.',
    accentColor: '#7C3AED',
    synthConfig: {
      rootFreq: 164.81, // E3
      chordRatios: [1, 1.2, 1.5, 1.8],
      melodyNotes: [164.81, 196.0, 246.94, 329.63, 293.66, 246.94],
      tempoBpm: 110,
      waveType: 'triangle',
    },
  },
  {
    id: 'trk-piano-minimal',
    title: 'Sokin Kech (Minimal Piano)',
    artist: 'Kamoliddin Classic',
    genre: 'Akustik va klassik',
    durationSeconds: 154,
    durationFormatted: '02:34',
    bpm: 66,
    isNew: true,
    isPopular: false,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Minimalistik akustik fortepiano uslubidagi nafis va tinchlantiruvchi kuy.',
    accentColor: '#0D9488',
    synthConfig: {
      rootFreq: 261.63, // C4
      chordRatios: [1, 1.25, 1.5, 2.0],
      melodyNotes: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63],
      tempoBpm: 66,
      waveType: 'sine',
    },
  },
  {
    id: 'trk-mountain-breeze',
    title: 'Chimyon Shabodasi (432 Hz Ambient)',
    artist: 'EcoSound Studio',
    genre: 'Tabiat va meditatsiya',
    durationSeconds: 240,
    durationFormatted: '04:00',
    bpm: 60,
    isNew: false,
    isPopular: true,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Chuqur dam olish, nafas mashqlari va sokin uyquga tayyorgarlik uchun toza garmoniya.',
    accentColor: '#16A34A',
    synthConfig: {
      rootFreq: 216.0, // 432Hz A3
      chordRatios: [1, 1.25, 1.5, 2.0],
      melodyNotes: [216.0, 270.0, 324.0, 432.0, 324.0, 270.0],
      tempoBpm: 60,
      waveType: 'sine',
    },
  },
  {
    id: 'trk-midnight-debug',
    title: 'Midnight Debugger',
    artist: 'Smart Download Studio',
    genre: 'Fokus va kodlash',
    durationSeconds: 175,
    durationFormatted: '02:55',
    bpm: 86,
    isNew: true,
    isPopular: false,
    isPremium: true,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Tungi dasturlash seanslari uchun barqaror bas chizig‘iga ega ritmik kompozitsiya.',
    accentColor: '#4F46E5',
    synthConfig: {
      rootFreq: 146.83, // D3
      chordRatios: [1, 1.2, 1.5, 1.8],
      melodyNotes: [146.83, 174.61, 220.0, 293.66, 261.63, 220.0],
      tempoBpm: 86,
      waveType: 'triangle',
    },
  },
  {
    id: 'trk-coffee-break',
    title: 'Qahva Tanaffusi',
    artist: 'Lo-Fi Caravan',
    genre: 'Lo-Fi va dam olish',
    durationSeconds: 148,
    durationFormatted: '02:28',
    bpm: 80,
    isNew: false,
    isPopular: false,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Ish orasida 5 daqiqa tanaffus qilish uchun iliq va quvnoq instrumental ohang.',
    accentColor: '#D97706',
    synthConfig: {
      rootFreq: 246.94, // B3
      chordRatios: [1, 1.2, 1.5, 1.8],
      melodyNotes: [246.94, 293.66, 369.99, 440.0, 369.99, 293.66],
      tempoBpm: 80,
      waveType: 'sine',
    },
  },
  {
    id: 'trk-horizon-vista',
    title: 'Yangi Ufqlar (Intro Theme)',
    artist: 'Navo Instrumental',
    genre: 'Kinematografik',
    durationSeconds: 205,
    durationFormatted: '03:25',
    bpm: 88,
    isNew: true,
    isPopular: true,
    isPremium: true,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Taqdimotlar va hujjatli videolar uchun ko‘tarinki ruhdagi orkestr-sintez musiqa.',
    accentColor: '#2563EB',
    synthConfig: {
      rootFreq: 196.0, // G3
      chordRatios: [1, 1.25, 1.5, 2.0],
      melodyNotes: [196.0, 246.94, 293.66, 392.0, 440.0, 392.0],
      tempoBpm: 88,
      waveType: 'triangle',
    },
  },
  {
    id: 'trk-quantum-pulse',
    title: 'Kvant Impulsi',
    artist: 'SynthWave UZ',
    genre: 'Elektron va sintez',
    durationSeconds: 188,
    durationFormatted: '03:08',
    bpm: 118,
    isNew: true,
    isPopular: false,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Yuqori sur’atda ishlash va texnologik videolar uchun dinamik elektron puls.',
    accentColor: '#EC4899',
    synthConfig: {
      rootFreq: 185.0, // F#3
      chordRatios: [1, 1.2, 1.5, 1.8],
      melodyNotes: [185.0, 220.0, 277.18, 369.99, 329.63, 277.18],
      tempoBpm: 118,
      waveType: 'triangle',
    },
  },
  {
    id: 'trk-silk-road-strings',
    title: 'Ipak Yo‘li Sadolari',
    artist: 'Kamoliddin Classic',
    genre: 'Akustik va klassik',
    durationSeconds: 198,
    durationFormatted: '03:18',
    bpm: 74,
    isNew: false,
    isPopular: true,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Klassik arpedjio va sharqona ohanglarning zamonaviy akustik talqini.',
    accentColor: '#EA580C',
    synthConfig: {
      rootFreq: 220.0,
      chordRatios: [1, 1.2, 1.5, 2.0],
      melodyNotes: [220.0, 261.63, 329.63, 440.0, 392.0, 329.63],
      tempoBpm: 74,
      waveType: 'sine',
    },
  },
  {
    id: 'trk-rainy-window',
    title: 'Yomg‘irli Deraza (Calm Ambient)',
    artist: 'EcoSound Studio',
    genre: 'Tabiat va meditatsiya',
    durationSeconds: 225,
    durationFormatted: '03:45',
    bpm: 64,
    isNew: true,
    isPopular: false,
    licenseInfo: 'Original Studio Audio (Royalty-Free / CC0)',
    description: 'Tinchlantiruvchi past chastotali ambient to‘lqinlar va mayin akkordlar.',
    accentColor: '#0284C7',
    synthConfig: {
      rootFreq: 174.61,
      chordRatios: [1, 1.25, 1.5, 1.875],
      melodyNotes: [174.61, 220.0, 261.63, 349.23, 261.63, 220.0],
      tempoBpm: 64,
      waveType: 'sine',
    },
  },
];
