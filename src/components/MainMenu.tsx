import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Map,
  Brain,
  Gamepad2,
  BookOpen,
  Library,
  Trophy,
  Palette,
  Settings,
  User,
  Gift,
  Flame,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react';
import { GameProgress } from '../types';
import { PLAYER_LEVELS } from '../data/expansionData';
import { PWAInstallButton } from './PWAInstallButton';
import { audio } from '../utils/audio';

interface MainMenuProps {
  onPlay: () => void;
  onMap: () => void;
  onQuiz: () => void;
  onMiniGames: () => void;
  onAlphabet: () => void;
  onReview: () => void;
  onRewards: () => void;
  onCosmetics: () => void;
  onDailyChallenge: () => void;
  onChest: () => void;
  onProfile: () => void;
  onSettings: () => void;
  progress: GameProgress;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onMap,
  onQuiz,
  onMiniGames,
  onAlphabet,
  onReview,
  onRewards,
  onCosmetics,
  onDailyChallenge,
  onChest,
  onProfile,
  onSettings,
  progress,
  onToggleSound,
  onToggleMusic,
}) => {
  const currentLevelInfo =
    PLAYER_LEVELS.find((l) => l.level === progress.playerLevel) || PLAYER_LEVELS[0];

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-3.5 sm:p-5 overflow-y-auto select-none"
      style={{
        background:
          progress.activeBackground === 'bg_space'
            ? 'linear-gradient(180deg, #1e1045 0%, #341f97 60%, #0c0824 100%)'
            : progress.activeBackground === 'bg_candy'
            ? 'linear-gradient(180deg, #ff9ff3 0%, #feca57 60%, #ff6b81 100%)'
            : 'linear-gradient(180deg, #70a1ff 0%, #7bed9f 55%, #2ed573 100%)',
      }}
    >
      {/* Decorative Clouds & Arc */}
      <div className="absolute top-6 -left-12 w-48 h-20 bg-white/70 rounded-full blur-[1px] pointer-events-none animate-float-slow" />
      <div className="absolute top-24 -right-8 w-60 h-24 bg-white/75 rounded-full blur-[1px] pointer-events-none animate-float-slow [animation-delay:1.5s]" />

      {/* TOP HEADER BAR: Profile Avatar, Currency, Daily, Chest, Audio */}
      <div className="w-full max-w-md flex items-center justify-between z-20 pt-1 pb-2">
        {/* Profile / Level Button */}
        <button
          onClick={onProfile}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-amber-400 shadow-[0_3px_0_#d98020] active:scale-95 transition-transform"
        >
          <span className="text-xl">{currentLevelInfo.badge}</span>
          <div className="text-left leading-none">
            <span className="text-[10px] font-black text-slate-500 uppercase">LVL {progress.playerLevel}</span>
            <p className="text-xs font-black text-slate-800 truncate max-w-[80px]">
              {currentLevelInfo.title}
            </p>
          </div>
        </button>

        {/* Currency Badges */}
        <div className="flex items-center gap-1.5">
          <div className="bg-white/95 px-2.5 py-1 rounded-full border-2 border-amber-400 shadow-[0_3px_0_#d98020] flex items-center gap-1 font-black text-slate-800 text-xs sm:text-sm">
            <span>⭐</span>
            <span>{progress.stars}</span>
          </div>
          <div className="bg-white/95 px-2.5 py-1 rounded-full border-2 border-amber-400 shadow-[0_3px_0_#d98020] flex items-center gap-1 font-black text-slate-800 text-xs sm:text-sm">
            <span>🪙</span>
            <span>{progress.coins}</span>
          </div>
        </div>

        {/* Top Quick Actions (Daily, Chest, Settings) */}
        <div className="flex items-center gap-1.5">
          {/* Daily Challenge */}
          <button
            onClick={onDailyChallenge}
            aria-label="Daily Mission"
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 border-2 border-white shadow flex items-center justify-center text-white active:scale-90"
          >
            <Flame className="w-5 h-5 fill-white stroke-none" />
          </button>

          {/* Reward Chest */}
          <button
            onClick={onChest}
            aria-label="Reward Chest"
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 border-2 border-white shadow flex items-center justify-center text-white active:scale-90"
          >
            <Gift className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle sound"
            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow active:scale-90 ${
              progress.settings.sound ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white/70'
            }`}
          >
            {progress.settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* CENTER: Game Title */}
      <div className="w-full max-w-sm flex flex-col items-center z-20 my-auto py-2">
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-center mb-3.5"
        >
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-2xl animate-bounce">✨</span>
            <span className="text-2xl animate-bounce [animation-delay:0.2s]">🔨</span>
            <span className="text-2xl animate-bounce [animation-delay:0.4s]">✨</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-amber-300 drop-shadow-[0_5px_0_#b33939] leading-none select-none">
            SMASH
          </h1>
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_4px_0_#1e3799] tracking-wider mt-0.5">
            LEARN & PLAY
          </h2>
        </motion.div>

        {/* PWA Install Button (Only visible if applicable) */}
        <div className="w-full mb-3.5">
          <PWAInstallButton playSound={() => audio.playButtonClick(progress.settings.sound)} />
        </div>

        {/* PRIMARY PLAY BUTTON (Large, prominent) */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={onPlay}
          className="w-full py-4 px-6 rounded-3xl btn-cartoon-orange text-white font-black text-2xl sm:text-3xl border-4 border-white tracking-wider flex items-center justify-center gap-3 cursor-pointer mb-3.5 shadow-xl"
        >
          <Play className="w-8 h-8 fill-white stroke-none" />
          <span>PLAY ADVENTURE</span>
          <span className="text-2xl">🎮</span>
        </motion.button>

        {/* 2-COLUMN FEATURE GRID */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          {/* LEARNING MAP */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMap}
            className="p-3 rounded-2xl btn-cartoon-green text-white font-black text-base sm:text-lg border-3 border-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Map className="w-5 h-5" />
            <span>MAP</span>
            <span className="text-base">🗺️</span>
          </motion.button>

          {/* QUIZ ZONE */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onQuiz}
            className="p-3 rounded-2xl btn-cartoon-purple text-white font-black text-base sm:text-lg border-3 border-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Brain className="w-5 h-5" />
            <span>QUIZ</span>
            <span className="text-base">🧠</span>
          </motion.button>

          {/* MINI GAMES */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMiniGames}
            className="p-3 rounded-2xl btn-cartoon-blue text-white font-black text-base sm:text-lg border-3 border-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>GAMES</span>
            <span className="text-base">🕹️</span>
          </motion.button>

          {/* WHAT I LEARNED (REVIEW) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReview}
            className="p-3 rounded-2xl btn-cartoon-yellow text-amber-950 font-black text-base sm:text-lg border-3 border-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Library className="w-5 h-5 text-amber-950" />
            <span>REVIEW</span>
            <span className="text-base">📖</span>
          </motion.button>

          {/* ALPHABET A-Z */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAlphabet}
            className="p-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-base sm:text-lg border-3 border-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <BookOpen className="w-5 h-5" />
            <span>A–Z</span>
            <span className="text-base">🔤</span>
          </motion.button>

          {/* REWARDS & TROPHIES */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRewards}
            className="p-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base sm:text-lg border-3 border-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Trophy className="w-5 h-5" />
            <span>TROPHIES</span>
            <span className="text-base">🏆</span>
          </motion.button>
        </div>

        {/* BOTTOM ROW: Dress Up (Cosmetics) & Settings */}
        <div className="w-full flex gap-2.5 mt-2.5">
          <button
            onClick={onCosmetics}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-white/90 text-slate-800 font-black text-xs sm:text-sm border-2 border-amber-400 shadow flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Palette className="w-4 h-4 text-purple-600" />
            <span>DRESS UP 🎨</span>
          </button>

          <button
            onClick={onSettings}
            className="py-2.5 px-4 rounded-2xl bg-white/90 text-slate-800 font-black text-xs sm:text-sm border-2 border-amber-400 shadow flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Settings className="w-4 h-4 text-slate-700" />
            <span>OPTIONS ⚙️</span>
          </button>
        </div>
      </div>

      {/* Company Branding at Bottom */}
      <div className="z-20 text-center pt-2 pb-1">
        <p className="text-xs font-bold text-white/90 tracking-wider">
          © VYRONIX CODER LTD
        </p>
        <p className="text-[11px] font-semibold text-white/75">
          By Dilsher & Team
        </p>
      </div>
    </div>
  );
};
