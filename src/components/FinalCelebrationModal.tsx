import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Star, Sparkles } from 'lucide-react';
import { GameProgress } from '../types';

interface FinalCelebrationModalProps {
  progress: GameProgress;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  onExploreWorlds: () => void;
}

export const FinalCelebrationModal: React.FC<FinalCelebrationModalProps> = ({
  progress,
  onPlayAgain,
  onMainMenu,
  onExploreWorlds,
}) => {
  useEffect(() => {
    // Multi-stage fireworks and confetti blast!
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    const interval = setInterval(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        zIndex: 9999,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        zIndex: 9999,
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative w-full max-w-lg bg-gradient-to-b from-[#4a2080] via-[#2a1050] to-[#120525] rounded-3xl border-4 border-amber-400 p-6 sm:p-8 shadow-[0_20px_0_#1a0833,0_30px_40px_rgba(0,0,0,0.6)] flex flex-col items-center text-center"
      >
        {/* Floating Balloons & Stars Header */}
        <div className="flex items-center justify-center gap-3 text-3xl sm:text-4xl mb-2">
          <span className="animate-bounce">🎈</span>
          <span className="animate-bounce [animation-delay:0.2s]">⭐</span>
          <span className="animate-bounce [animation-delay:0.4s]">👑</span>
          <span className="animate-bounce [animation-delay:0.6s]">⭐</span>
          <span className="animate-bounce [animation-delay:0.8s]">🎈</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-amber-300 drop-shadow-[0_4px_0_#b33939] tracking-wider leading-tight">
          🎉 ALPHABET MASTER! 🎉
        </h1>
        <h2 className="text-xl sm:text-3xl font-black text-white drop-shadow-[0_2px_0_#4c1d95] tracking-widest mt-1">
          YOU LEARNED A–Z!
        </h2>

        {/* Huge Animated Golden Trophy */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative my-4 flex items-center justify-center"
        >
          {/* Radial glow */}
          <div className="absolute w-44 h-44 rounded-full bg-amber-400/30 blur-2xl animate-pulse" />
          <div className="text-8xl sm:text-9xl filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)]">
            🏆
          </div>
        </motion.div>

        {/* Score & Coins Summary Banner */}
        <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-2xl border-2 border-white/20 flex items-center justify-around mb-6">
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-amber-200">Total Score</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300">⭐ {progress.score}</span>
          </div>
          <div className="h-10 w-0.5 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-yellow-200">Coins Earned</span>
            <span className="text-2xl sm:text-3xl font-black text-yellow-400">🪙 {progress.coins}</span>
          </div>
          <div className="h-10 w-0.5 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-emerald-200">Letters</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">26/26 ✓</span>
          </div>
        </div>

        {/* Action Buttons: Continue Adventure, Play Again & Main Menu */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onExploreWorlds}
            className="w-full py-4 px-6 rounded-2xl btn-cartoon-orange text-white font-black text-xl sm:text-2xl border-4 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform shadow-xl animate-pulse"
          >
            <span>CONTINUE ADVENTURE 🗺️</span>
          </button>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 py-3.5 px-4 rounded-2xl btn-cartoon-green text-white font-black text-lg border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <RotateCcw className="w-5 h-5 stroke-[3]" />
              <span>PLAY AGAIN</span>
            </button>

            <button
              onClick={onMainMenu}
              className="flex-1 py-3.5 px-4 rounded-2xl btn-cartoon-blue text-white font-black text-lg border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <Home className="w-5 h-5 stroke-[3]" />
              <span>MAIN MENU</span>
            </button>
          </div>
        </div>

        {/* Company Branding */}
        <div className="mt-6 pt-4 border-t border-white/10 w-full">
          <p className="text-sm font-black text-amber-300 tracking-wider">
            © VYRONIX CODER LTD
          </p>
          <p className="text-xs font-extrabold text-cyan-300">
            By Dilsher & Team
          </p>
        </div>
      </motion.div>
    </div>
  );
};
