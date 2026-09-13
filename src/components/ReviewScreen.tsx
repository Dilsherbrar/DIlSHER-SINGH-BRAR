import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { GameProgress } from '../types';
import { audio } from '../utils/audio';

interface ReviewScreenProps {
  progress: GameProgress;
  onBack: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ progress, onBack }) => {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #1b1035 0%, #2f1b54 50%, #150a2c 100%)',
      }}
    >
      {/* Top Header */}
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
            <span>📖</span>
            <span>WHAT I LEARNED</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-white/80">
            Tap any card to hear its sound & pronunciation!
          </p>
        </div>

        <div className="bg-amber-400 text-amber-950 font-black px-3.5 py-1.5 rounded-full border-2 border-white shadow text-sm">
          {progress.completedLetters.length}/26 ✓
        </div>
      </div>

      {/* Review List / Grid */}
      <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 z-10 flex-1 py-2">
        {ALPHABET_DATA.map((item) => {
          const isCompleted = progress.completedLetters.includes(item.letter);
          const isMastered = isCompleted; // completed at least once

          return (
            <motion.button
              key={item.letter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                audio.playObjectTap(progress.settings.sound);
                audio.speakLetterAndWord(item.letter, item.word, progress.settings.voice);
              }}
              className="p-3.5 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center gap-3.5 text-left cursor-pointer hover:border-amber-400 transition-colors shadow-md"
            >
              {/* Emoji Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 border-white/30 shrink-0 shadow-inner"
                style={{ backgroundColor: `${item.themeColor}44` }}
              >
                {item.emoji}
              </div>

              {/* Text Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl text-amber-300">{item.letter}</span>
                  <span className="text-lg font-black text-white truncate">{item.word}</span>
                </div>
                <p className="text-xs text-white/70 italic truncate">{item.funFact}</p>
                {isMastered && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>MASTERED! ⭐⭐⭐</span>
                  </span>
                )}
              </div>

              {/* Speaker icon */}
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white/80 shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer Branding */}
      <div className="z-10 text-center pt-4 pb-2">
        <p className="text-xs font-bold text-white/60 tracking-wider">
          © VYRONIX CODER LTD • By Dilsher & Team
        </p>
      </div>
    </div>
  );
};
