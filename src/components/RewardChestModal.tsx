import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Star, Trophy, Gift } from 'lucide-react';
import { GameProgress } from '../types';
import { audio } from '../utils/audio';

interface RewardChestModalProps {
  progress: GameProgress;
  onUpdateProgress: (newProgress: GameProgress) => void;
  onClose: () => void;
}

export const RewardChestModal: React.FC<RewardChestModalProps> = ({
  progress,
  onUpdateProgress,
  onClose,
}) => {
  const [chestState, setChestState] = useState<'idle' | 'opening' | 'opened'>('idle');
  const [reward, setReward] = useState<{ type: string; label: string; icon: string; amount: number } | null>(null);

  const canOpen = progress.stars >= 5;

  const handleOpenChest = () => {
    if (!canOpen || chestState !== 'idle') return;

    setChestState('opening');
    audio.playWoodHit2(progress.settings.sound);

    setTimeout(() => {
      setChestState('opened');
      audio.playChestOpen(progress.settings.sound);

      const rewardsPool = [
        { type: 'coins', label: '50 Shiny Coins!', icon: '🪙', amount: 50 },
        { type: 'stars', label: '10 Bonus Stars!', icon: '⭐', amount: 10 },
        { type: 'xp', label: '100 XP Points!', icon: '🏆', amount: 100 },
        { type: 'coins', label: '75 Mega Coins!', icon: '🪙', amount: 75 },
      ];
      const randomReward = rewardsPool[Math.floor(Math.random() * rewardsPool.length)];
      setReward(randomReward);

      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}

      // Deduct 5 stars cost, add reward
      const updated: GameProgress = {
        ...progress,
        stars: progress.stars - 5 + (randomReward.type === 'stars' ? randomReward.amount : 0),
        coins: progress.coins + (randomReward.type === 'coins' ? randomReward.amount : 0),
        xp: progress.xp + (randomReward.type === 'xp' ? randomReward.amount : 0),
      };
      onUpdateProgress(updated);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-[#4a2080] to-[#1e1045] rounded-3xl border-4 border-amber-400 p-6 shadow-2xl flex flex-col items-center text-center"
      >
        <button
          onClick={onClose}
          aria-label="Close chest modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white active:scale-90"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        <h3 className="text-2xl font-black text-amber-300 drop-shadow flex items-center justify-center gap-1.5 mb-1">
          <span>🎁</span>
          <span>REWARD CHEST</span>
        </h3>
        <p className="text-xs font-bold text-purple-200 mb-4">
          Open with 5 stars for magical surprises!
        </p>

        {/* Chest Visual */}
        <motion.div
          animate={
            chestState === 'opening'
              ? { rotate: [-8, 8, -8, 8, 0], scale: [1, 1.15, 1] }
              : chestState === 'idle'
              ? { y: [0, -6, 0] }
              : { scale: [1, 1.1, 1] }
          }
          transition={{
            repeat: chestState === 'opening' ? 4 : Infinity,
            duration: chestState === 'opening' ? 0.3 : 3,
          }}
          className="text-8xl my-4 filter drop-shadow-xl relative flex items-center justify-center"
        >
          {chestState === 'opened' ? '✨🎁✨' : '📦'}
        </motion.div>

        {/* Reward Result Banner */}
        <AnimatePresence>
          {reward && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-amber-400/20 border-2 border-amber-400 rounded-2xl w-full my-3"
            >
              <span className="text-4xl">{reward.icon}</span>
              <p className="font-black text-lg text-amber-300 mt-1">{reward.label}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {chestState !== 'opened' ? (
          <button
            onClick={handleOpenChest}
            disabled={!canOpen || chestState === 'opening'}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-xl border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
              canOpen
                ? 'btn-cartoon-orange text-white'
                : 'bg-slate-600 text-white/50 border-white/20 cursor-not-allowed'
            }`}
          >
            <span>{chestState === 'opening' ? 'OPENING...' : 'OPEN CHEST (⭐ 5)'}</span>
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl btn-cartoon-green text-white font-black text-lg border-3 border-white tracking-wider cursor-pointer active:scale-95 shadow-lg"
          >
            COLLECT & ENJOY! 🎉
          </button>
        )}

        <p className="text-[10px] font-semibold text-white/60 mt-3">
          Free educational progression • No real money
        </p>
      </motion.div>
    </div>
  );
};
