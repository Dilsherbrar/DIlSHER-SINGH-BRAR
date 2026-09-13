import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Check, Lock } from 'lucide-react';
import { GameProgress, CosmeticItem } from '../types';
import { COSMETICS_CATALOG } from '../data/expansionData';
import { audio } from '../utils/audio';

interface CosmeticsModalProps {
  progress: GameProgress;
  onUpdateProgress: (newProgress: GameProgress) => void;
  onClose: () => void;
}

export const CosmeticsModal: React.FC<CosmeticsModalProps> = ({
  progress,
  onUpdateProgress,
  onClose,
}) => {
  const handleEquipOrBuy = (item: CosmeticItem) => {
    const isUnlocked = progress.unlockedCosmetics.includes(item.id);

    if (isUnlocked) {
      // Equip item
      audio.playButtonClick(progress.settings.sound);
      if (item.category === 'box') {
        onUpdateProgress({ ...progress, activeBoxSkin: item.id });
      } else if (item.category === 'background') {
        onUpdateProgress({ ...progress, activeBackground: item.id });
      }
    } else {
      // Try to purchase with coins
      if (progress.coins >= item.costCoins) {
        audio.playChestOpen(progress.settings.sound);
        const updated: GameProgress = {
          ...progress,
          coins: progress.coins - item.costCoins,
          unlockedCosmetics: [...progress.unlockedCosmetics, item.id],
          ...(item.category === 'box' ? { activeBoxSkin: item.id } : {}),
          ...(item.category === 'background' ? { activeBackground: item.id } : {}),
        };
        onUpdateProgress(updated);
      } else {
        audio.playWrong(progress.settings.sound);
        audio.speak('You need more coins!', progress.settings.voice);
      }
    }
  };

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
          aria-label="Close cosmetics"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white active:scale-90"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        <h3 className="text-2xl font-black text-amber-300 drop-shadow flex items-center justify-center gap-2 mb-1">
          <span>🎨</span>
          <span>DRESS UP YOUR GAME</span>
        </h3>
        <p className="text-xs font-bold text-purple-200 mb-2">
          Unlock cute box styles and themes with coins!
        </p>

        <div className="bg-amber-400 text-amber-950 font-black px-3.5 py-1 rounded-full text-xs mb-4 shadow">
          🪙 {progress.coins} Coins Available
        </div>

        {/* Cosmetics Items */}
        <div className="w-full flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          {COSMETICS_CATALOG.map((item) => {
            const isUnlocked = progress.unlockedCosmetics.includes(item.id);
            const isEquipped =
              (item.category === 'box' && progress.activeBoxSkin === item.id) ||
              (item.category === 'background' && progress.activeBackground === item.id);

            return (
              <div
                key={item.id}
                className="p-3 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm">{item.name}</h4>
                    <span className="text-[10px] text-purple-200 capitalize font-medium">
                      {item.category} skin
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleEquipOrBuy(item)}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs border-2 flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${
                    isEquipped
                      ? 'bg-emerald-500 border-white text-white'
                      : isUnlocked
                      ? 'bg-amber-400 border-white text-amber-950'
                      : progress.coins >= item.costCoins
                      ? 'bg-yellow-400 border-white text-amber-950'
                      : 'bg-white/20 border-white/30 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {isEquipped ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>EQUIPPED</span>
                    </>
                  ) : isUnlocked ? (
                    <span>EQUIP</span>
                  ) : (
                    <>
                      <span>🪙 {item.costCoins}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Branding */}
        <div className="mt-4 text-center">
          <p className="text-xs font-bold text-white/70 tracking-wider">
            © VYRONIX CODER LTD • By Dilsher & Team
          </p>
        </div>
      </motion.div>
    </div>
  );
};
