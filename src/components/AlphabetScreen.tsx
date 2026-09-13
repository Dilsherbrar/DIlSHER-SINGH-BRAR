import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Lock, Star, Sparkles } from 'lucide-react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { GameProgress } from '../types';

interface AlphabetScreenProps {
  progress: GameProgress;
  onBack: () => void;
  onSelectLetter: (letterIdx: number) => void;
}

export const AlphabetScreen: React.FC<AlphabetScreenProps> = ({
  progress,
  onBack,
  onSelectLetter,
}) => {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #372175 0%, #1e1045 100%)',
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
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-[0_2px_0_#b33939] tracking-wider">
            ALPHABET A–Z 🔤
          </h2>
          <p className="text-xs sm:text-sm font-bold text-white/80">
            {progress.completedLetters.length} of 26 letters discovered
          </p>
        </div>

        {/* Progress pill */}
        <div className="bg-amber-400 text-amber-950 font-black px-3.5 py-1.5 rounded-full border-2 border-white shadow text-sm">
          ⭐ {progress.score}
        </div>
      </div>

      {/* Letters Grid (4 to 5 columns responsive) */}
      <div className="w-full max-w-xl grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 z-10 py-2">
        {ALPHABET_DATA.map((item, idx) => {
          const isCompleted = progress.completedLetters.includes(item.letter);
          const isCurrent = idx === progress.currentLetterIdx;
          const isUnlocked = isCompleted || isCurrent || idx <= progress.completedLetters.length;

          return (
            <motion.button
              key={item.letter}
              whileHover={isUnlocked ? { scale: 1.08 } : {}}
              whileTap={isUnlocked ? { scale: 0.92 } : {}}
              onClick={() => {
                if (isUnlocked) {
                  onSelectLetter(idx);
                }
              }}
              disabled={!isUnlocked}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-3 transition-all ${
                isCompleted
                  ? 'border-amber-300 shadow-[0_6px_0_#b33939] cursor-pointer'
                  : isCurrent
                  ? 'border-white ring-4 ring-amber-400 shadow-[0_6px_0_#2b1055] cursor-pointer animate-pulse'
                  : isUnlocked
                  ? 'border-white/40 bg-white/10 cursor-pointer'
                  : 'border-white/10 bg-black/20 opacity-40 cursor-not-allowed'
              }`}
              style={{
                background: isCompleted
                  ? `linear-gradient(135deg, ${item.borderColor} 0%, ${item.themeColor} 100%)`
                  : isCurrent
                  ? 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
                  : undefined,
              }}
            >
              {/* Completed checkmark badge */}
              {isCompleted && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Locked padlock icon */}
              {!isUnlocked && (
                <div className="absolute top-1.5 right-1.5 text-white/50">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Big Letter */}
              <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {item.letter}
              </span>

              {/* Emoji or Word */}
              <span className="text-xl sm:text-2xl mt-0.5 filter drop-shadow">
                {isCompleted || isCurrent ? item.emoji : '❓'}
              </span>

              <span className="text-[10px] sm:text-xs font-black text-white/90 truncate max-w-full mt-0.5">
                {isCompleted || isCurrent ? item.word : 'Lock'}
              </span>
            </motion.button>
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
