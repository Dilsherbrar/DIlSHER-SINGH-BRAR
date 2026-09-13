import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, Calendar, CheckCircle2, Gift } from 'lucide-react';
import { GameProgress } from '../types';
import { audio } from '../utils/audio';

interface DailyChallengeModalProps {
  progress: GameProgress;
  onUpdateProgress: (newProgress: GameProgress) => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  progress,
  onUpdateProgress,
  onClose,
}) => {
  const challenge = progress.dailyChallenge;
  const isCompleted = challenge.current >= challenge.target;

  const handleClaim = () => {
    if (!isCompleted || challenge.claimed) return;

    audio.playLevelComplete(progress.settings.sound);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    const updated: GameProgress = {
      ...progress,
      stars: progress.stars + (challenge.rewardType === 'stars' ? challenge.rewardAmount : 0),
      coins: progress.coins + (challenge.rewardType === 'coins' ? challenge.rewardAmount : 0),
      xp: progress.xp + (challenge.rewardType === 'xp' ? challenge.rewardAmount : 0),
      dailyChallenge: {
        ...challenge,
        claimed: true,
      },
    };
    onUpdateProgress(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-[#2e1d5a] to-[#160b33] rounded-3xl border-4 border-amber-400 p-6 shadow-2xl flex flex-col items-center text-center"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white active:scale-90"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        <h3 className="text-2xl font-black text-amber-300 drop-shadow flex items-center justify-center gap-2 mb-1">
          <span>🔥</span>
          <span>TODAY'S MISSION</span>
        </h3>
        <p className="text-xs font-bold text-purple-200 mb-4">
          Complete daily missions for fun prizes!
        </p>

        {/* Mission Card */}
        <div className="w-full bg-white/10 p-4 rounded-2xl border-2 border-white/20 flex flex-col items-center mb-4">
          <div className="text-5xl mb-2">{challenge.icon}</div>
          <h4 className="text-xl font-black text-white">{challenge.title}</h4>
          <p className="text-xs font-medium text-white/80 mt-0.5">{challenge.description}</p>

          {/* Progress bar */}
          <div className="w-full bg-black/40 h-4 rounded-full border border-white/20 overflow-hidden my-3">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
              style={{
                width: `${Math.min(100, (challenge.current / challenge.target) * 100)}%`,
              }}
            />
          </div>
          <span className="text-xs font-black text-amber-300">
            {challenge.current} / {challenge.target} Completed
          </span>
        </div>

        {/* Reward pill */}
        <div className="mb-4 bg-amber-400/20 px-4 py-2 rounded-full border border-amber-400 text-amber-300 text-sm font-black flex items-center gap-1.5">
          <Gift className="w-4 h-4" />
          <span>
            Reward: +{challenge.rewardAmount}{' '}
            {challenge.rewardType === 'coins'
              ? 'Coins 🪙'
              : challenge.rewardType === 'stars'
              ? 'Stars ⭐'
              : 'XP 🏆'}
          </span>
        </div>

        {/* Claim button */}
        {challenge.claimed ? (
          <div className="w-full py-3 rounded-2xl bg-emerald-600/60 border-2 border-emerald-400 text-white font-black text-base flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>CLAIMED! COME BACK TOMORROW</span>
          </div>
        ) : (
          <button
            onClick={handleClaim}
            disabled={!isCompleted}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-lg border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
              isCompleted
                ? 'btn-cartoon-green text-white'
                : 'bg-white/20 text-white/50 border-white/20 cursor-not-allowed'
            }`}
          >
            <span>{isCompleted ? 'CLAIM REWARD! 🎁' : 'IN PROGRESS'}</span>
          </button>
        )}
      </motion.div>
    </div>
  );
};
