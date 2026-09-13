import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { PLAYER_LEVELS } from '../data/expansionData';
import { audio } from '../utils/audio';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose, soundEnabled = true }) => {
  const levelInfo = PLAYER_LEVELS.find((l) => l.level === level) || PLAYER_LEVELS[0];

  useEffect(() => {
    audio.playLevelUp(soundEnabled);
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  }, [soundEnabled]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-[#ff9f43] via-[#ee5253] to-[#10ac84] rounded-3xl border-4 border-white p-6 shadow-2xl flex flex-col items-center text-center"
      >
        <span className="text-6xl mb-1 animate-bounce">{levelInfo.badge}</span>
        <h2 className="text-4xl font-black text-amber-200 drop-shadow-[0_4px_0_#993300]">
          LEVEL UP! 🎉
        </h2>
        <h3 className="text-2xl font-black text-white drop-shadow mt-1">
          LEVEL {level} • {levelInfo.title}
        </h3>

        <div className="my-4 p-4 bg-black/30 rounded-2xl border-2 border-white/40 w-full flex items-center justify-around">
          <div>
            <span className="text-xs font-bold text-amber-200">Bonus Coins</span>
            <p className="text-2xl font-black text-yellow-300">🪙 +50</p>
          </div>
          <div className="h-8 w-0.5 bg-white/30" />
          <div>
            <span className="text-xs font-bold text-amber-200">Bonus Stars</span>
            <p className="text-2xl font-black text-amber-300">⭐ +5</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 px-6 rounded-2xl btn-cartoon-green text-white font-black text-xl border-4 border-white tracking-wider cursor-pointer active:scale-95 shadow-xl"
        >
          AWESOME! 🚀
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs font-bold text-white/80 tracking-wider">
            © VYRONIX CODER LTD • By Dilsher & Team
          </p>
        </div>
      </motion.div>
    </div>
  );
};
