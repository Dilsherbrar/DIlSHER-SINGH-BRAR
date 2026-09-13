import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Star, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../data/alphabetData';
import { GameProgress } from '../types';

interface RewardsScreenProps {
  progress: GameProgress;
  onBack: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ progress, onBack }) => {
  // Helper to check if an achievement is unlocked
  const isAchievementUnlocked = (achId: string) => {
    const ach = ACHIEVEMENTS_DATA.find((a) => a.id === achId);
    if (!ach) return false;

    if (ach.reqType === 'smashes') {
      return progress.totalSmashes >= ach.reqValue;
    }
    if (ach.reqType === 'score') {
      return progress.score >= ach.reqValue;
    }
    if (ach.reqType === 'letters_completed') {
      return progress.completedLetters.length >= ach.reqValue;
    }
    if (ach.reqType === 'all_completed') {
      return progress.completedLetters.length >= 26;
    }
    return false;
  };

  const unlockedCount = ACHIEVEMENTS_DATA.filter((a) => isAchievementUnlocked(a.id)).length;

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #1b1b3a 0%, #2f1b54 50%, #150a2c 100%)',
      }}
    >
      {/* Header */}
      <div className="w-full max-w-xl flex items-center justify-between z-10 pt-2 mb-4">
        <button
          onClick={onBack}
          aria-label="Back to menu"
          className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white active:scale-95 transition-all shadow"
        >
          <ArrowLeft className="w-7 h-7 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-[0_2px_0_#b33939] tracking-wider flex items-center justify-center gap-2">
            <span>🏆</span>
            <span>REWARDS</span>
            <span>🏆</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-white/80">
            {unlockedCount} of {ACHIEVEMENTS_DATA.length} Trophies Won
          </p>
        </div>

        <div className="w-12" />
      </div>

      {/* Overview Stats Bento */}
      <div className="w-full max-w-xl grid grid-cols-3 gap-3 z-10 mb-4">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-2xl border-2 border-white shadow-[0_4px_0_#b33939] flex flex-col items-center">
          <span className="text-2xl">⭐</span>
          <span className="text-xl sm:text-2xl font-black text-white drop-shadow">
            {progress.score}
          </span>
          <span className="text-[11px] font-bold text-amber-100">Score</span>
        </div>

        <div className="bg-gradient-to-br from-yellow-300 to-amber-500 p-3 rounded-2xl border-2 border-white shadow-[0_4px_0_#d98020] flex flex-col items-center">
          <span className="text-2xl">🪙</span>
          <span className="text-xl sm:text-2xl font-black text-amber-950">
            {progress.coins}
          </span>
          <span className="text-[11px] font-bold text-amber-900">Coins</span>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-2xl border-2 border-white shadow-[0_4px_0_#341f97] flex flex-col items-center">
          <span className="text-2xl">🔤</span>
          <span className="text-xl sm:text-2xl font-black text-white">
            {progress.completedLetters.length}/26
          </span>
          <span className="text-[11px] font-bold text-purple-200">Letters</span>
        </div>
      </div>

      {/* Achievements List */}
      <div className="w-full max-w-xl flex flex-col gap-2.5 z-10 flex-1">
        {ACHIEVEMENTS_DATA.map((ach) => {
          const unlocked = isAchievementUnlocked(ach.id);

          return (
            <motion.div
              key={ach.id}
              whileHover={unlocked ? { scale: 1.02 } : {}}
              className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                unlocked
                  ? 'bg-gradient-to-r from-amber-500/30 to-purple-600/30 border-amber-400 shadow-[0_4px_0_#d98020]'
                  : 'bg-white/5 border-white/10 opacity-50'
              }`}
            >
              {/* Icon badge */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 ${
                  unlocked
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-white shadow-md'
                    : 'bg-white/10 border-white/20 text-white/40'
                }`}
              >
                {ach.icon}
              </div>

              {/* Title & Desc */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4
                    className={`font-black text-base sm:text-lg truncate ${
                      unlocked ? 'text-amber-300' : 'text-white/60'
                    }`}
                  >
                    {ach.title}
                  </h4>
                  {unlocked && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs sm:text-sm text-white/70 font-medium">
                  {ach.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {unlocked ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow">
                    UNLOCKED ⭐
                  </span>
                ) : (
                  <div className="flex items-center gap-1 text-white/40 text-xs font-bold bg-white/10 px-2.5 py-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOCKED</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Company Branding at Bottom */}
      <div className="z-10 text-center pt-4 pb-2">
        <p className="text-xs font-bold text-white/60 tracking-wider">
          © VYRONIX CODER LTD
        </p>
        <p className="text-[11px] font-semibold text-white/50">
          By Dilsher & Team
        </p>
      </div>
    </div>
  );
};
