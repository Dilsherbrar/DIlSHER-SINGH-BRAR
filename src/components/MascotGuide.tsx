import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { MASCOT_QUOTES } from '../data/expansionData';
import { audio } from '../utils/audio';

interface MascotGuideProps {
  customMessage?: string | null;
  voiceEnabled?: boolean;
}

export const MascotGuide: React.FC<MascotGuideProps> = ({
  customMessage,
  voiceEnabled = true,
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const displayMessage = customMessage || MASCOT_QUOTES[currentQuoteIndex];

  const handleMascotTap = () => {
    const nextIdx = (currentQuoteIndex + 1) % MASCOT_QUOTES.length;
    setCurrentQuoteIndex(nextIdx);
    audio.playButtonClick(true);
    audio.speak(displayMessage, voiceEnabled);
  };

  return (
    <div className="fixed bottom-3 right-3 z-40 flex items-end gap-2 pointer-events-auto select-none">
      {/* Mascot Speech Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.7, opacity: 0, x: 20 }}
            onClick={handleMascotTap}
            className="cursor-pointer max-w-[200px] bg-white/95 text-slate-800 p-2.5 rounded-2xl rounded-br-none border-2 border-amber-400 shadow-[0_4px_0_#d98020] text-xs font-black relative"
          >
            <p className="leading-snug">{displayMessage}</p>
            <span className="text-[9px] text-amber-600 block mt-0.5">Tap me to talk! 🐾</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cute Animated Bear Mascot */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleMascotTap}
        aria-label="Barnaby Bear guide"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 border-3 border-white shadow-[0_4px_0_#8c4815] flex items-center justify-center text-3xl cursor-pointer relative"
      >
        <span className="animate-bounce">🐻</span>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
      </motion.button>
    </div>
  );
};
