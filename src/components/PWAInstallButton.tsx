import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  playSound: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ playSound }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={() => {
          playSound();
          install();
        }}
        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-600 px-5 py-3 border-b-4 border-blue-800 text-white font-black text-lg active:scale-95 transition shadow-lg w-full max-w-xs mx-auto animate-pulse"
      >
        <Download className="w-6 h-6" />
        INSTALL APP
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            playSound();
            setShowIOSGuide(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-600 px-5 py-3 border-b-4 border-blue-800 text-white font-black text-lg active:scale-95 transition shadow-lg w-full max-w-xs mx-auto animate-pulse"
        >
          <Download className="w-6 h-6" />
          INSTALL APP
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-slate-800 border-4 border-slate-600 p-6 shadow-2xl text-center">
              <h3 className="text-2xl font-black text-white mb-4">Install on iPhone</h3>
              <p className="text-lg text-slate-300 font-medium leading-relaxed mb-6">
                1. Tap the <span className="bg-slate-700 p-1 rounded font-bold">Share</span> button in Safari's menu bar at the bottom.<br /><br />
                2. Scroll down and tap <span className="bg-slate-700 p-1 rounded font-bold">Add to Home Screen</span>.
              </p>
              <button
                onClick={() => {
                  playSound();
                  setShowIOSGuide(false);
                }}
                className="w-full rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-6 py-3 border-b-4 border-emerald-800 text-white font-black text-xl active:scale-95 transition shadow-lg"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
