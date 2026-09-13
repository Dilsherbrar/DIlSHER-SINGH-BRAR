import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlphabetItem } from '../types';
import { Volume2, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface ObjectDiscoveryProps {
  item: AlphabetItem;
  hasTappedObject: boolean;
  onObjectTap: () => void;
  onNextLetter: () => void;
  onReplayLetter: () => void;
  isLastLetter: boolean;
  voiceEnabled: boolean;
  onSpeak: () => void;
}

export const ObjectDiscovery: React.FC<ObjectDiscoveryProps> = ({
  item,
  hasTappedObject,
  onObjectTap,
  onNextLetter,
  onReplayLetter,
  isLastLetter,
  voiceEnabled,
  onSpeak,
}) => {
  const [jumpCount, setJumpCount] = useState(0);

  const handleTap = () => {
    setJumpCount((prev) => prev + 1);
    onObjectTap();
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-md mx-auto px-4 z-20">
      {/* Huge Display Letter with Sunburst Glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: -40 }}
        animate={{ scale: [0, 1.25, 1], opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="relative flex items-center justify-center mb-4"
      >
        {/* Pulsing Sunburst Background */}
        <div
          className="absolute w-44 h-44 rounded-full blur-xl opacity-60 animate-pulse-glow pointer-events-none"
          style={{ backgroundColor: item.themeColor }}
        />

        {/* Big Letter Card */}
        <div
          className="relative px-8 py-3 rounded-3xl border-4 border-white shadow-[0_10px_0_rgba(0,0,0,0.2),0_15px_25px_rgba(0,0,0,0.25)] flex items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${item.borderColor} 0%, ${item.themeColor} 100%)`,
          }}
        >
          <span className="text-6xl md:text-7xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
            {item.letter}
          </span>
          <button
            onClick={onSpeak}
            aria-label="Pronounce letter"
            className="w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 active:scale-90 transition-all flex items-center justify-center text-white border-2 border-white/60 shadow"
          >
            <Volume2 className="w-7 h-7" />
          </button>
        </div>
      </motion.div>

      {/* Main Interactive Learning Object (e.g. 🍎 Apple) */}
      <motion.div
        key={`object-${jumpCount}`}
        initial={{ scale: 0.5, y: 50, rotate: -20, opacity: 0 }}
        animate={{
          scale: jumpCount > 0 ? [1, 1.35, 1] : [0.5, 1.15, 1],
          y: jumpCount > 0 ? [0, -35, 0] : [50, -15, 0],
          rotate: jumpCount > 0 ? [0, -15, 15, 0] : [-20, 10, 0],
          opacity: 1,
        }}
        transition={{
          duration: 0.65,
          ease: 'backOut',
        }}
        onClick={handleTap}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="relative cursor-pointer group my-2 touch-manipulation flex items-center justify-center"
      >
        {/* Sparkle halos */}
        <div className="absolute -inset-6 rounded-full border-4 border-dashed border-amber-300/60 animate-star-spin pointer-events-none" />

        {/* The Giant Emoji / Illustration */}
        <div className="text-8xl md:text-9xl filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] transition-transform select-none">
          {item.emoji}
        </div>

        {/* Tap object tooltip if not tapped yet */}
        {!hasTappedObject && (
          <motion.div
            animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -bottom-7 bg-amber-400 text-amber-950 font-black text-sm md:text-base px-4 py-1 rounded-full border-2 border-white shadow-lg whitespace-nowrap pointer-events-none flex items-center gap-1.5"
          >
            <span>👆 Tap the {item.word}!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Animated Phonics Word Banner: "A for Apple" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <div className="inline-block bg-white/95 backdrop-blur-md px-6 py-2 rounded-2xl border-4 border-amber-400 shadow-[0_8px_0_#d98020,0_12px_20px_rgba(0,0,0,0.2)]">
          <p className="text-2xl md:text-3xl font-black tracking-wide text-slate-800">
            <span style={{ color: item.themeColor }}>{item.letter}</span> for{' '}
            <span className="text-indigo-600">{item.word}</span>
          </p>
        </div>

        {/* Fun fact pill */}
        <p className="mt-2 text-sm md:text-base font-bold text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {item.funFact}
        </p>
      </motion.div>

      {/* REWARD CARD & NEXT LETTER BUTTON (Appears when child has interacted) */}
      <AnimatePresence>
        {hasTappedObject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 15 }}
            className="mt-5 w-full bg-gradient-to-b from-indigo-900/90 to-purple-900/95 p-4 rounded-3xl border-4 border-amber-400 shadow-[0_12px_0_#4c1d95,0_20px_30px_rgba(0,0,0,0.4)] flex flex-col items-center gap-3"
          >
            {/* Title */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-300 tracking-wider">
                LETTER COMPLETE!
              </h3>
              <span className="text-2xl">🎉</span>
            </div>

            {/* Stars & Points earned */}
            <div className="flex items-center justify-center gap-4 bg-white/10 px-6 py-2 rounded-2xl border border-white/20 w-full">
              <div className="flex items-center gap-1 text-yellow-300 font-extrabold text-lg">
                <span className="text-2xl animate-bounce">⭐</span>
                <span>⭐⭐⭐</span>
              </div>
              <div className="h-6 w-0.5 bg-white/20" />
              <div className="flex items-center gap-1 text-emerald-300 font-extrabold text-lg">
                <span>+50 PTS</span>
              </div>
              <div className="h-6 w-0.5 bg-white/20" />
              <div className="flex items-center gap-1 text-amber-300 font-extrabold text-lg">
                <span>🪙 +10</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full mt-1">
              <button
                onClick={onReplayLetter}
                className="w-14 h-14 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white active:scale-95 transition-transform"
                title="Replay Letter"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={onNextLetter}
                className="flex-1 py-3.5 px-6 rounded-2xl btn-cartoon-green text-white font-black text-xl md:text-2xl flex items-center justify-center gap-3 border-4 border-white tracking-wider cursor-pointer active:scale-95 transition-transform"
              >
                <span>{isLastLetter ? 'FINISH A–Z! 👑' : 'NEXT LETTER'}</span>
                <ArrowRight className="w-7 h-7 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
