import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WoodenBoxProps {
  hits: number; // 0, 1, 2, 3
  isBroken: boolean;
  onTap: (e: React.MouseEvent | React.TouchEvent) => void;
  celebrationText?: string | null;
  boxSkin?: string;
}

// 8 shards of broken crate
interface WoodShard {
  id: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  rotate: number;
  width: number;
  height: number;
  bgColor: string;
}

const SHARD_CONFIGS: WoodShard[] = [
  { id: 1, startX: -45, startY: -45, dx: -140, dy: -180, rotate: -120, width: 90, height: 60, bgColor: '#b86b2b' },
  { id: 2, startX: 45, startY: -45, dx: 150, dy: -170, rotate: 140, width: 85, height: 55, bgColor: '#a05820' },
  { id: 3, startX: -50, startY: 30, dx: -160, dy: 60, rotate: -70, width: 80, height: 65, bgColor: '#8c4815' },
  { id: 4, startX: 50, startY: 30, dx: 170, dy: 70, rotate: 85, width: 95, height: 60, bgColor: '#b86b2b' },
  { id: 5, startX: 0, startY: -60, dx: 0, dy: -220, rotate: 30, width: 70, height: 50, bgColor: '#d4883e' },
  { id: 6, startX: -20, startY: 0, dx: -90, dy: 130, rotate: -150, width: 65, height: 45, bgColor: '#a05820' },
  { id: 7, startX: 20, startY: 0, dx: 100, dy: 140, rotate: 160, width: 75, height: 50, bgColor: '#8c4815' },
  { id: 8, startX: 0, startY: 50, dx: 15, dy: 200, rotate: 45, width: 110, height: 40, bgColor: '#6d350d' },
];

export const WoodenBox: React.FC<WoodenBoxProps> = ({
  hits,
  isBroken,
  onTap,
  celebrationText,
  boxSkin = 'box_classic',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getSkinGradient = () => {
    switch (boxSkin) {
      case 'box_gold':
        return 'linear-gradient(145deg, #ffd700 0%, #f39c12 50%, #b86b2b 100%)';
      case 'box_toy':
        return 'linear-gradient(145deg, #48dbfb 0%, #ff9ff3 50%, #54a0ff 100%)';
      case 'box_star':
        return 'linear-gradient(145deg, #5f27cd 0%, #341f97 50%, #1e1045 100%)';
      default:
        return 'linear-gradient(145deg, #d9883b 0%, #a4581a 50%, #7d3f0f 100%)';
    }
  };

  // Shake variant based on hits
  const getShakeAnimation = () => {
    if (isBroken) return {};
    if (hits === 1) {
      return {
        x: [0, -8, 8, -6, 6, -3, 0],
        y: [0, 4, -4, 2, -2, 0],
        scale: [1, 0.95, 1.04, 0.98, 1],
        transition: { duration: 0.35, ease: 'easeOut' },
      };
    }
    if (hits === 2) {
      return {
        x: [0, -16, 16, -12, 12, -8, 8, -4, 0],
        y: [0, 6, -6, 4, -4, 0],
        scale: [1, 0.92, 1.08, 0.96, 1],
        transition: { duration: 0.45, ease: 'easeOut' },
      };
    }
    return {};
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Floating Celebration/Praise Banner */}
      <AnimatePresence>
        {celebrationText && (
          <motion.div
            key={celebrationText}
            initial={{ opacity: 0, scale: 0.3, y: 30 }}
            animate={{ opacity: 1, scale: [0.3, 1.25, 1], y: -30 }}
            exit={{ opacity: 0, scale: 0.5, y: -60 }}
            transition={{ duration: 0.45, ease: 'backOut' }}
            className="absolute -top-16 z-30 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 text-purple-950 font-black text-2xl md:text-3xl px-6 py-2 rounded-full border-4 border-white shadow-[0_8px_0_#b33939,0_12px_20px_rgba(0,0,0,0.3)] tracking-wider flex items-center gap-2">
              <span>⭐</span>
              <span>{celebrationText}</span>
              <span>⭐</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ground Soft Ambient Shadow */}
      <motion.div
        animate={{
          scale: isBroken ? 0.4 : isHovered ? 1.05 : [1, 0.94, 1],
          opacity: isBroken ? 0.2 : [0.4, 0.55, 0.4],
        }}
        transition={{
          repeat: isBroken ? 0 : Infinity,
          duration: 2.5,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-8 w-56 md:w-64 h-12 bg-black/35 rounded-[50%] blur-md pointer-events-none"
      />

      {/* The Box or Exploded Shards */}
      {!isBroken ? (
        <motion.div
          animate={getShakeAnimation()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={onTap}
          className="relative cursor-pointer group touch-manipulation z-20"
        >
          {/* Box Idle Gentle Breathing Animation Wrapper */}
          <div className="animate-idle-box">
            {/* Box Container (Detailed 3D Cartoon Toy Wooden Crate) */}
            <div
              className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl border-4 border-[#4a2408] overflow-hidden shadow-[0_16px_0_#3a1a04,0_24px_30px_rgba(0,0,0,0.4)] transition-all"
              style={{
                background: getSkinGradient(),
              }}
            >
              {/* Inner Wooden Planks */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {/* Plank 1 */}
                <div className="h-1/3 border-b-4 border-[#4a2408]/60 bg-gradient-to-b from-amber-300/25 to-transparent relative">
                  {/* Wood grain curves */}
                  <div className="absolute top-3 left-4 w-32 h-2 rounded-full bg-[#5c2d0c]/20" />
                  <div className="absolute top-8 left-12 w-20 h-1.5 rounded-full bg-[#5c2d0c]/15" />
                </div>
                {/* Plank 2 (Middle) */}
                <div className="h-1/3 border-b-4 border-[#4a2408]/60 bg-gradient-to-b from-amber-200/15 to-transparent relative">
                  <div className="absolute top-5 right-6 w-28 h-2 rounded-full bg-[#5c2d0c]/20" />
                  <div className="absolute top-10 left-8 w-36 h-2 rounded-full bg-[#5c2d0c]/15" />
                </div>
                {/* Plank 3 */}
                <div className="h-1/3 relative bg-gradient-to-t from-black/25 to-transparent">
                  <div className="absolute top-4 left-10 w-24 h-2 rounded-full bg-[#5c2d0c]/20" />
                </div>
              </div>

              {/* Diagonal Cross Wooden Brace */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 35px, #fff 35px, #fff 42px)',
                }}
              />

              {/* Gold/Metal Corner Braces with Rivets */}
              {/* Top Left */}
              <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-r-2 border-b-2 border-[#3d1d05] rounded-tl-2xl flex items-center justify-center shadow-inner">
                <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-stone-800 to-stone-400 border border-black/40 shadow-sm" />
              </div>
              {/* Top Right */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-amber-300 via-amber-500 to-amber-700 border-l-2 border-b-2 border-[#3d1d05] rounded-tr-2xl flex items-center justify-center shadow-inner">
                <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-stone-800 to-stone-400 border border-black/40 shadow-sm" />
              </div>
              {/* Bottom Left */}
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-amber-400 via-amber-600 to-amber-800 border-r-2 border-t-2 border-[#3d1d05] rounded-bl-2xl flex items-center justify-center shadow-inner">
                <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-stone-800 to-stone-400 border border-black/40 shadow-sm" />
              </div>
              {/* Bottom Right */}
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-amber-400 via-amber-600 to-amber-800 border-l-2 border-t-2 border-[#3d1d05] rounded-br-2xl flex items-center justify-center shadow-inner">
                <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-stone-800 to-stone-400 border border-black/40 shadow-sm" />
              </div>

              {/* Center Mystery Question Mark / Crest */}
              {hits === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-2xl bg-amber-900/40 border-2 border-amber-300/40 flex items-center justify-center shadow-inner">
                    <span className="text-4xl text-amber-200/90 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      ❓
                    </span>
                  </div>
                </div>
              )}

              {/* --- CRACKS SVG OVERLAYS --- */}
              {/* Crack Level 1: Visible after 1st hit */}
              {hits >= 1 && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 200 200"
                >
                  <filter id="crackGlow1">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.8" />
                  </filter>
                  <path
                    d="M 100 90 L 85 65 L 60 75 L 45 45 M 85 65 L 110 50 L 130 30"
                    stroke="#1a0902"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#crackGlow1)"
                  />
                  <path
                    d="M 100 90 L 115 110 L 95 130 L 110 160"
                    stroke="#1a0902"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              )}

              {/* Crack Level 2: Much heavier branching cracks after 2nd hit */}
              {hits >= 2 && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10 animate-pulse"
                  viewBox="0 0 200 200"
                >
                  <path
                    d="M 20 100 L 60 95 L 100 90 L 140 105 L 180 85 M 60 95 L 40 140 L 70 175 M 140 105 L 160 145 L 135 180 M 100 90 L 125 70 L 150 55 M 100 90 L 75 125 L 45 155"
                    stroke="#0d0401"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Glowing crack energy */}
                  <path
                    d="M 60 95 L 100 90 L 140 105"
                    stroke="#ffd32a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                  />
                </svg>
              )}

              {/* Hit Counter Badge */}
              <div className="absolute top-3 right-14 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-amber-400 text-amber-300 font-bold text-xs flex items-center gap-1 shadow">
                <span>🔨</span>
                <span>{hits}/3</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Exploding Wooden Pieces & Shards on Break */
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center pointer-events-none z-10">
          {SHARD_CONFIGS.map((shard) => (
            <motion.div
              key={shard.id}
              initial={{
                x: shard.startX,
                y: shard.startY,
                scale: 1,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: shard.dx,
                y: shard.dy + 160, // Falls with gravity
                rotate: shard.rotate,
                scale: 0.6,
                opacity: 0,
              }}
              transition={{
                duration: 1.1,
                ease: [0.2, 0.8, 0.4, 1],
              }}
              className="absolute border-2 border-[#3d1d05] rounded-lg shadow-lg"
              style={{
                width: `${shard.width}px`,
                height: `${shard.height}px`,
                backgroundColor: shard.bgColor,
              }}
            >
              {/* Plank line inside shard */}
              <div className="w-full h-1 bg-black/20 mt-2" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
