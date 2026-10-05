import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Search,
  Music,
  Sparkles,
  SkipBack,
  SkipForward,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  MUSIC_CATALOG,
  MUSIC_GENRES,
  MusicGenre,
  MusicTrack,
} from '../data/musicData';
import { PremiumBadge } from './PremiumBadge';

interface MusicSectionProps {
  isProUser: boolean;
  favoriteTrackIds: string[];
  onToggleFavoriteTrack: (trackId: string) => void;
  onRequireUpgrade: () => void;
}

type MusicFilterTab = 'all' | 'popular' | 'new' | 'favorites';

export const MusicSection: React.FC<MusicSectionProps> = ({
  isProUser,
  favoriteTrackIds,
  onToggleFavoriteTrack,
  onRequireUpgrade,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | 'Barchasi'>('Barchasi');
  const [activeTab, setActiveTab] = useState<MusicFilterTab>('all');

  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(MUSIC_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);

  // Web Audio API refs for reliable, legal studio synthesis playback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const noteIntervalRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const stepIndexRef = useRef<number>(0);

  const filteredTracks = useMemo(() => {
    return MUSIC_CATALOG.filter((track) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.genre.toLowerCase().includes(q) ||
        track.description.toLowerCase().includes(q);

      const matchesGenre =
        selectedGenre === 'Barchasi' || track.genre === selectedGenre;

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'popular' && track.isPopular) ||
        (activeTab === 'new' && track.isNew) ||
        (activeTab === 'favorites' && favoriteTrackIds.includes(track.id));

      return matchesSearch && matchesGenre && matchesTab;
    });
  }, [searchQuery, selectedGenre, activeTab, favoriteTrackIds]);

  const stopAudioEngine = () => {
    if (noteIntervalRef.current) {
      window.clearInterval(noteIntervalRef.current);
      noteIntervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const triggerSynthNote = (track: MusicTrack) => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const { rootFreq, chordRatios, melodyNotes, waveType } = track.synthConfig;
    const step = stepIndexRef.current;

    // Warm pad chord on beat 0
    if (step % 4 === 0) {
      chordRatios.forEach((ratio) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(rootFreq * ratio * 0.5, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.04, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.2);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 2.3);
      });
    }

    // Gentle melodic arpeggio note
    const noteFreq = melodyNotes[step % melodyNotes.length];
    const melOsc = ctx.createOscillator();
    const melGain = ctx.createGain();
    melOsc.type = waveType;
    melOsc.frequency.setValueAtTime(noteFreq, now);

    melGain.gain.setValueAtTime(0.001, now);
    melGain.gain.exponentialRampToValueAtTime(0.06, now + 0.06);
    melGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.85);

    melOsc.connect(melGain);
    melGain.connect(masterGain);
    melOsc.start(now);
    melOsc.stop(now + 0.9);

    stepIndexRef.current += 1;
  };

  const startAudioEngine = (track: MusicTrack) => {
    stopAudioEngine();

    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      master.gain.value = isMuted ? 0 : volume;
      master.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }

    const beatMs = Math.max(350, Math.round((60 / track.synthConfig.tempoBpm) * 1000));
    triggerSynthNote(track);

    noteIntervalRef.current = window.setInterval(() => {
      triggerSynthNote(track);
    }, beatMs);

    progressIntervalRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + 1 >= track.durationSeconds) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume,
        audioCtxRef.current.currentTime
      );
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      startAudioEngine(currentTrack);
    } else {
      stopAudioEngine();
    }
    return () => stopAudioEngine();
  }, [isPlaying, currentTrack]);

  const handlePlayTrack = (track: MusicTrack) => {
    if (track.isPremium && !isProUser) {
      onRequireUpgrade();
      return;
    }

    if (currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      stepIndexRef.current = 0;
      setCurrentTime(0);
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleSkip = (direction: 'prev' | 'next') => {
    const playable = filteredTracks.filter((t) => !t.isPremium || isProUser);
    if (playable.length === 0) return;
    const idx = playable.findIndex((t) => t.id === currentTrack.id);
    const nextIdx =
      direction === 'next'
        ? (idx + 1) % playable.length
        : (idx - 1 + playable.length) % playable.length;
    setCurrentTime(0);
    setCurrentTrack(playable[nextIdx]);
    setIsPlaying(true);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <section id="music-section" className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bo‘lim sarlavhasi va qidiruv */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Music className="w-4 h-4" />
              <span>🎵 SMART DOWNLOAD MUSIQA VA AUDIO STUDIYASI</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Kodlash, ijod va dam olish uchun litsenziyalangan musiqalar
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Barcha audio treklar Smart Download Studio tomonidan qonuniy (Royalty-Free / CC0)
              sintez qilingan. Hech qanday shubhali MP3 yuklamalarsiz to‘g‘ridan-to‘g‘ri brauzerda
              tinglang.
            </p>
          </div>

          {/* Musiqa qidiruvi */}
          <div className="w-full lg:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qo‘shiq yoki janrni qidiring..."
                aria-label="Musiqa qidiruvi"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* INTERAKTIV AUDIO PLAYER PANELI */}
        <div className="mt-8 rounded-2xl border border-blue-500/30 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Joriy qo‘shiq ma’lumoti */}
            <div className="lg:col-span-4 flex items-center gap-4 min-w-0">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: currentTrack.accentColor }}
              >
                <Music className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {isPlaying ? 'Hoziroq yangramoqda' : 'Pleyer tayyor'}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {currentTrack.bpm} BPM
                  </span>
                </div>
                <h3 className="mt-0.5 text-base font-bold text-slate-900 dark:text-white truncate">
                  {currentTrack.title}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentTrack.artist} · {currentTrack.genre}
                </div>
              </div>
            </div>

            {/* Play/Pause va Progress Bar */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSkip('prev')}
                  aria-label="Oldingi qo‘shiq"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'To‘xtatish' : 'Ijro etish'}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-sm transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSkip('next')}
                  aria-label="Keyingi qo‘shiq"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                <span className="w-10 text-right">{formatSeconds(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={currentTrack.durationSeconds}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  aria-label="Qo‘shiq vaqti"
                  className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="w-10">{currentTrack.durationFormatted}</span>
              </div>
            </div>

            {/* Volume & Sevimlilarga qo‘shish */}
            <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setIsMuted(false);
                    setVolume(Number(e.target.value));
                  }}
                  aria-label="Ovoz balandligi"
                  className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <button
                type="button"
                onClick={() => onToggleFavoriteTrack(currentTrack.id)}
                aria-label="Sevimlilarga qo‘shish"
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  favoriteTrackIds.includes(currentTrack.id)
                    ? 'border-rose-500/40 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Heart
                  className="w-3.5 h-3.5"
                  fill={favoriteTrackIds.includes(currentTrack.id) ? 'currentColor' : 'none'}
                />
                <span>Sevimli</span>
              </button>
            </div>
          </div>
        </div>

        {/* JANRLAR VA FILTR TUGMALARI */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Janrlar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedGenre('Barchasi')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedGenre === 'Barchasi'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500/50'
              }`}
            >
              Barcha janrlar ({MUSIC_CATALOG.length})
            </button>
            {MUSIC_GENRES.map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() =>
                  setSelectedGenre(selectedGenre === g.name ? 'Barchasi' : g.name)
                }
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGenre === g.name
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500/50'
                }`}
              >
                <span className="mr-1.5">{g.emoji}</span>
                <span>{g.name}</span>
              </button>
            ))}
          </div>

          {/* Mashhur / Yangi / Sevimlilar */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start">
            {(
              [
                { id: 'all', label: 'Barchasi' },
                { id: 'popular', label: 'Mashhur qo‘shiqlar' },
                { id: 'new', label: 'Yangi qo‘shiqlar' },
                {
                  id: 'favorites',
                  label: `Sevimlilar (${favoriteTrackIds.length})`,
                },
              ] as { id: MusicFilterTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* MUSIQA KARTOCHKALARI GRIDI */}
        {filteredTracks.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTracks.map((track) => {
              const isCurrent = currentTrack.id === track.id;
              const isTrackPlaying = isCurrent && isPlaying;
              const isFav = favoriteTrackIds.includes(track.id);

              return (
                <article
                  key={track.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/30 dark:bg-slate-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handlePlayTrack(track)}
                          aria-label={isTrackPlaying ? 'To‘xtatish' : 'Tinglash'}
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform active:scale-95 cursor-pointer"
                          style={{ backgroundColor: track.accentColor }}
                        >
                          {isTrackPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {track.title}
                            </h3>
                            <PremiumBadge isPremium={Boolean(track.isPremium)} />
                          </div>
                          <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                            {track.artist} · {track.genre}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleFavoriteTrack(track.id)}
                        aria-label="Sevimlilarga qo‘shish"
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          isFav
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                      {track.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{track.licenseInfo}</span>
                    </div>
                    <div className="font-mono text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
                      {track.durationFormatted}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center max-w-md mx-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Qo‘shiqlar topilmadi
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Qidiruv so‘rovi yoki tanlangan janr bo‘yicha trek topilmadi.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('Barchasi');
                setActiveTab('all');
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Barcha musiqalarni ko‘rsatish</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
