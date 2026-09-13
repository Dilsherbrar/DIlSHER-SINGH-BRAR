import React from 'react';
import { motion } from 'motion/react';

interface TapIndicatorProps {
  visible: boolean;
}

export const TapIndicator: React.FC<TapIndicatorProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', damping: 15 }}
      className="pointer-events-none flex flex-col items-center justify-center mb-3"
    >
      {/* Cartoon instruction banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white font-extrabold text-xl md:text-2xl px-6 py-2 rounded-full border-4 border-white shadow-[0_6px_0_#b33939,0_10px_15px_rgba(0,0,0,0.2)] tracking-wider flex items-center gap-2 animate-bounce">
        <span>🔨</span>
        <span>SMASH THE BOX!</span>
        <span>✨</span>
      </div>

      {/* Animated cartoon tapping hand indicator */}
      <div className="relative mt-2 flex items-center justify-center">
        {/* Ripple ring */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-amber-300 animate-ping opacity-75" />
        
        {/* Hand icon */}
        <div className="text-4xl filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] animate-tap-hand">
          👆
        </div>
      </div>
    </motion.div>
  );
};
