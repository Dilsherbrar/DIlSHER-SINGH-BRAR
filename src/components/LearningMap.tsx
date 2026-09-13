import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Lock, CheckCircle, Sparkles, Trophy } from 'lucide-react';
import { WORLDS_DATA } from '../data/expansionData';
import { GameProgress, WorldId } from '../types';

interface LearningMapProps {
  progress: GameProgress;
  onBack: () => void;
  onSelectWorld: (worldId: WorldId) => void;
}

export const LearningMap: React.FC<LearningMapProps> = ({
  progress,
  onBack,
  onSelectWorld,
}) => {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #10ac84 0%, #1dd1a1 35%, #00d2d3 70%, #0abde3 100%)',
      }}
    >
      {/* Header */}
      <div className="w-full max-w-xl flex items-center justify-between z-10 pt-2 mb-4">
        <button
          onClick={onBack}
          aria-label="Back to menu"
          className="w-12 h-12 rounded-2xl bg-white/30 hover:bg-white/40 border-2 border-white/60 flex items-center justify-center text-white active:scale-95 transition-all shadow"
        >
          <ArrowLeft className="w-7 h-7 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-[0_2px_0_#b33939] tracking-wider flex items-center justify-center gap-1.5">
            <span>🗺️</span>
            <span>LEARNING MAP</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-white/90">
            Journey from Alphabet to Learning Champion!
          </p>
        </div>

        <div className="bg-white/90 text-amber-900 font-black px-3.5 py-1.5 rounded-full border-2 border-amber-400 shadow text-sm">
          ⭐ {progress.stars}
        </div>
      </div>

      {/* Winding Adventure Road */}
      <div className="w-full max-w-md flex flex-col items-center gap-5 z-10 py-3 flex-1 relative">
        {/* Visual Winding Path dashed line */}
        <div className="absolute top-8 bottom-8 w-3 bg-white/40 rounded-full border-2 border-dashed border-white/70 -z-0" />

        {WORLDS_DATA.map((world, index) => {
          const isUnlocked = progress.unlockedWorlds.includes(world.id);
          const isEven = index % 2 === 0;

          // Calculate earned stars in this world
          const starsEarned = Object.entries(progress.levelStars)
            .filter(([key]) => key.startsWith(world.id))
            .reduce((sum, [, stars]) => sum + (Number(stars) || 0), 0);

          return (
            <motion.div
              key={world.id}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-full flex items-center z-10 ${
                isEven ? 'justify-start pl-2' : 'justify-end pr-2'
              }`}
            >
              <motion.button
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => {
                  if (isUnlocked) onSelectWorld(world.id);
                }}
                disabled={!isUnlocked}
                className={`w-[85%] sm:w-[80%] p-3.5 rounded-3xl border-4 text-left transition-all relative flex items-center gap-3 cursor-pointer ${
                  isUnlocked
                    ? 'border-white shadow-[0_8px_0_rgba(0,0,0,0.25)] hover:brightness-105'
                    : 'border-white/20 bg-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
                style={{
                  background: isUnlocked
                    ? `linear-gradient(135deg, ${world.color} 0%, ${world.borderColor} 100%)`
                    : undefined,
                }}
              >
                {/* World Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-white/25 border-2 border-white/50 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  {world.icon}
                </div>

                {/* World Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 bg-black/25 px-2 py-0.5 rounded-full inline-block mb-0.5">
                    World {world.number}
                  </span>
                  <h3 className="font-black text-white text-base sm:text-lg leading-tight truncate drop-shadow">
                    {world.title}
                  </h3>
                  <p className="text-[11px] text-white/90 font-medium truncate">
                    {world.subtitle}
                  </p>

                  {/* Stars / Status */}
                  <div className="flex items-center gap-1 mt-1 text-xs font-black text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-300 stroke-none" />
                    <span>{starsEarned} Stars</span>
                    <span className="text-white/60 ml-1">({world.totalLevels} Levels)</span>
                  </div>
                </div>

                {/* Lock or Play indicator */}
                <div className="shrink-0">
                  {!isUnlocked ? (
                    <div className="w-9 h-9 rounded-full bg-black/40 border border-white/30 flex items-center justify-center text-white/60">
                      <Lock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white text-emerald-600 flex items-center justify-center font-black shadow text-sm">
                      ▶
                    </div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          );
        })}

        {/* Grand Destination Node: Ultimate Learning Champion */}
        <div className="w-full flex justify-center mt-3 z-10">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-4 border-white shadow-[0_8px_0_#b33939] text-center max-w-xs">
            <span className="text-4xl block mb-1">👑</span>
            <h4 className="font-black text-amber-950 text-base">
              ULTIMATE LEARNING CHAMPION
            </h4>
            <p className="text-xs font-extrabold text-amber-900/80">
              Complete all worlds & quizzes to master the realm!
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="z-10 text-center pt-4 pb-2">
        <p className="text-xs font-bold text-white/80 tracking-wider">
          © VYRONIX CODER LTD • By Dilsher & Team
        </p>
      </div>
    </div>
  );
};
