import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Music, Mic, RotateCcw, AlertTriangle, Check } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggleSound = () => {
    onUpdateSettings({ ...settings, sound: !settings.sound });
  };

  const toggleMusic = () => {
    onUpdateSettings({ ...settings, music: !settings.music });
  };

  const toggleVoice = () => {
    onUpdateSettings({ ...settings, voice: !settings.voice });
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setShowConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-gradient-to-b from-[#3a2072] to-[#1e1045] rounded-3xl border-4 border-amber-400 p-6 shadow-[0_16px_0_#140830,0_25px_30px_rgba(0,0,0,0.5)] flex flex-col items-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close settings"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/50 flex items-center justify-center text-white active:scale-90 transition-all shadow"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-amber-300 drop-shadow-[0_2px_0_#b33939] tracking-wider flex items-center justify-center gap-2">
            <span>⚙️</span>
            <span>SETTINGS</span>
          </h2>
          <p className="text-xs font-bold text-purple-200 mt-1">
            Game options & sound controls
          </p>
        </div>

        {/* Toggle Controls */}
        <div className="w-full flex flex-col gap-3 mb-6">
          {/* Sound Effects Toggle */}
          <button
            onClick={toggleSound}
            className={`w-full p-4 rounded-2xl border-3 flex items-center justify-between transition-all cursor-pointer ${
              settings.sound
                ? 'bg-amber-500/20 border-amber-400 text-white'
                : 'bg-white/5 border-white/20 text-white/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  settings.sound ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                {settings.sound ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </div>
              <div className="text-left">
                <p className="font-black text-lg">Sound Effects</p>
                <p className="text-xs font-medium opacity-80">Hit, break, and star sounds</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full font-black text-xs ${
                settings.sound ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white/60'
              }`}
            >
              {settings.sound ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Background Music Toggle */}
          <button
            onClick={toggleMusic}
            className={`w-full p-4 rounded-2xl border-3 flex items-center justify-between transition-all cursor-pointer ${
              settings.music
                ? 'bg-purple-500/20 border-purple-400 text-white'
                : 'bg-white/5 border-white/20 text-white/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  settings.music ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                <Music className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-black text-lg">Background Music</p>
                <p className="text-xs font-medium opacity-80">Gentle cheerful marimba</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full font-black text-xs ${
                settings.music ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white/60'
              }`}
            >
              {settings.music ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Voice Phonics Toggle */}
          <button
            onClick={toggleVoice}
            className={`w-full p-4 rounded-2xl border-3 flex items-center justify-between transition-all cursor-pointer ${
              settings.voice
                ? 'bg-cyan-500/20 border-cyan-400 text-white'
                : 'bg-white/5 border-white/20 text-white/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  settings.voice ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                <Mic className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-black text-lg">Voice Pronunciation</p>
                <p className="text-xs font-medium opacity-80">"A for Apple!" speech</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full font-black text-xs ${
                settings.voice ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white/60'
              }`}
            >
              {settings.voice ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Reset Progress Section (With Safe Confirmation) */}
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-3 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border-2 border-rose-400 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Game Progress</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-rose-950/80 p-4 rounded-2xl border-2 border-rose-500 text-center flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-1.5 text-rose-300 font-black text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Are you sure?</span>
            </div>
            <p className="text-xs text-rose-200">
              This will reset your score and completed letters to Letter A.
            </p>
            <div className="flex items-center gap-3 w-full mt-1">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/20 text-white font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow"
              >
                Yes, Reset
              </button>
            </div>
          </motion.div>
        )}

        {/* Company Branding at Bottom */}
        <div className="mt-6 text-center">
          <p className="text-xs font-bold text-white/70 tracking-wider">
            © VYRONIX CODER LTD
          </p>
          <p className="text-[11px] font-semibold text-white/50">
            By Dilsher & Team
          </p>
        </div>
      </motion.div>
    </div>
  );
};
