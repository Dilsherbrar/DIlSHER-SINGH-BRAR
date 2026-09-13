import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const floatingLetters = ['A', 'B', 'C', '🍎', '⭐', '🎈', 'X', 'Y', 'Z'];

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 40%, #5f27cd 0%, #341f97 50%, #1a0b36 100%)',
      }}
    >
      {/* Background Floating Decorative Letters & Toys */}
      {floatingLetters.map((char, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: (i - 4) * 80,
            y: (i % 2 === 0 ? 100 : -100),
            scale: 0.5,
          }}
          animate={{
            opacity: [0, 0.7, 0.4],
            y: [ (i % 2 === 0 ? 100 : -100), (i % 2 === 0 ? -120 : 120) ],
            scale: [0.5, 1.2, 0.8],
            rotate: [0, i % 2 === 0 ? 360 : -360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
          className="absolute text-4xl md:text-5xl font-black text-amber-300/40 pointer-events-none select-none"
          style={{
            left: `${15 + (i * 9)}%`,
            top: `${20 + ((i * 17) % 60)}%`,
          }}
        >
          {char}
        </motion.div>
      ))}

      {/* Centerpiece Logo Content */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: 30 }}
        animate={{ scale: [0.4, 1.1, 1], opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
        className="text-center px-6 z-10 flex flex-col items-center"
      >
        {/* Animated sparkling star above title */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.25, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-amber-300 mb-2 filter drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
        >
          <Star className="w-16 h-16 fill-amber-300 stroke-white stroke-[2.5]" />
        </motion.div>

        {/* Game Title with 3D cartoon style */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-orange-500 drop-shadow-[0_6px_0_#993300] leading-tight filter">
          SMASH
        </h1>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-[0_4px_0_#4c1d95] mt-1">
          LEARN & PLAY
        </h2>

        {/* Company Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/20 shadow-xl flex flex-col items-center"
        >
          <span className="text-sm md:text-base font-black tracking-widest text-amber-300">
            A VYRONIX CODER LTD GAME
          </span>
          <span className="text-xs md:text-sm font-extrabold text-cyan-300 tracking-wider mt-0.5">
            By Dilsher & Team
          </span>
        </motion.div>

        {/* Tap to skip hint */}
        <p className="mt-8 text-xs text-white/50 animate-pulse font-medium">
          Tap anywhere to continue...
        </p>
      </motion.div>
    </div>
  );
};
