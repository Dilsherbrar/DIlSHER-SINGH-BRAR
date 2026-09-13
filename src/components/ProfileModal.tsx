import React from 'react';
import { motion } from 'motion/react';
import { X, User, Trophy, Star, Award, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { GameProgress } from '../types';
import { PLAYER_LEVELS } from '../data/expansionData';

interface ProfileModalProps {
  progress: GameProgress;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ progress, onClose }) => {
  const currentLevelInfo =
    PLAYER_LEVELS.find((l) => l.level === progress.playerLevel) || PLAYER_LEVELS[0];
  const nextLevelInfo = PLAYER_LEVELS.find((l) => l.level === progress.playerLevel + 1);

  const nextLevelXp = nextLevelInfo ? nextLevelInfo.minXp : currentLevelInfo.minXp;
  const xpInCurrentLevel = progress.xp - currentLevelInfo.minXp;
  const xpNeeded = nextLevelInfo ? nextLevelInfo.minXp - currentLevelInfo.minXp : 100;
  const progressPercent = nextLevelInfo
    ? Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeeded) * 100))
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-md bg-gradient-to-b from-[#2e1d5a] to-[#150a2c] rounded-3xl border-4 border-amber-400 p-6 shadow-2xl flex flex-col items-center"
      >
        <button
          onClick={onClose}
          aria-label="Close profile"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white active:scale-90"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Player Avatar */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white flex items-center justify-center text-4xl shadow-lg mt-2 mb-2">
          {currentLevelInfo.badge}
        </div>

        <h3 className="text-2xl font-black text-amber-300 drop-shadow">Little Learner</h3>
        <span className="text-xs font-black text-cyan-300 uppercase tracking-widest bg-cyan-950/60 px-3 py-0.5 rounded-full border border-cyan-500/40 mt-1">
          Level {progress.playerLevel} • {currentLevelInfo.title}
        </span>

        {/* XP Progress Bar */}
        <div className="w-full bg-white/10 p-3 rounded-2xl border border-white/20 my-4 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-black text-white/90">
            <span>XP Progress</span>
            <span className="text-amber-300">
              {progress.xp} / {nextLevelXp} XP
            </span>
          </div>
          <div className="w-full bg-black/40 h-3.5 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-xs font-bold text-white/70">Letters Learned</span>
            <p className="text-xl font-black text-emerald-400">
              {progress.completedLetters.length} / 26
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-xs font-bold text-white/70">Quizzes Won</span>
            <p className="text-xl font-black text-cyan-400">{progress.quizCompletedCount}</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-xs font-bold text-white/70">Total Stars</span>
            <p className="text-xl font-black text-amber-300">⭐ {progress.stars}</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
            <span className="text-xs font-bold text-white/70">Shiny Coins</span>
            <p className="text-xl font-black text-yellow-300">🪙 {progress.coins}</p>
          </div>
        </div>

        {/* Mastery Badges */}
        <div className="w-full">
          <h4 className="text-sm font-black text-amber-200 mb-2">Mastery Badges</h4>
          <div className="flex justify-around bg-black/30 p-3 rounded-2xl border border-white/15">
            <div className="flex flex-col items-center">
              <span className="text-2xl">🔤</span>
              <span className="text-[10px] font-bold text-white/80 mt-1">Alphabet</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">🎨</span>
              <span className="text-[10px] font-bold text-white/80 mt-1">Colours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">🔢</span>
              <span className="text-[10px] font-bold text-white/80 mt-1">Numbers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl">🧠</span>
              <span className="text-[10px] font-bold text-white/80 mt-1">Memory</span>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-5 text-center">
          <p className="text-xs font-bold text-white/70 tracking-wider">
            © VYRONIX CODER LTD • By Dilsher & Team
          </p>
        </div>
      </motion.div>
    </div>
  );
};
