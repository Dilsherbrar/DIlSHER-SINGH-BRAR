import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Home, Volume2, VolumeX, RotateCcw, Award } from 'lucide-react';
import { WoodenBox } from './WoodenBox';
import { TapIndicator } from './TapIndicator';
import { ObjectDiscovery } from './ObjectDiscovery';
import { ALPHABET_DATA, CELEBRATION_MESSAGES } from '../data/alphabetData';
import { GameProgress, FloatingParticle, FloatingScoreText } from '../types';
import { audio } from '../utils/audio';

interface PlayScreenProps {
  progress: GameProgress;
  onUpdateProgress: (newProgress: GameProgress) => void;
  onHome: () => void;
  onCompleteAll: () => void;
  particles: FloatingParticle[];
  setParticles: React.Dispatch<React.SetStateAction<FloatingParticle[]>>;
  scoreTexts: FloatingScoreText[];
  setScoreTexts: React.Dispatch<React.SetStateAction<FloatingScoreText[]>>;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  progress,
  onUpdateProgress,
  onHome,
  onCompleteAll,
  particles,
  setParticles,
  scoreTexts,
  setScoreTexts,
}) => {
  const currentItem = ALPHABET_DATA[progress.currentLetterIdx] || ALPHABET_DATA[0];

  // Stage state for current letter
  const [hits, setHits] = useState<number>(0); // 0, 1, 2, 3
  const [isBroken, setIsBroken] = useState<boolean>(false);
  const [hasTappedObject, setHasTappedObject] = useState<boolean>(false);
  const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [scoreBouncing, setScoreBouncing] = useState<boolean>(false);

  // Helper to spawn floating score text
  const addScoreText = useCallback((text: string, x: number, y: number, color = '#f1c40f') => {
    const newText: FloatingScoreText = {
      id: Date.now() + Math.random(),
      text,
      x,
      y,
      color,
      createdAt: Date.now(),
    };
    setScoreTexts((prev) => [...prev, newText]);
    setTimeout(() => {
      setScoreTexts((prev) => prev.filter((item) => item.id !== newText.id));
    }, 1200);
  }, [setScoreTexts]);

  // Helper to spawn canvas particles
  const spawnParticles = useCallback((
    x: number,
    y: number,
    count: number,
    type: FloatingParticle['type'],
    colors: string[]
  ) => {
    const newParticles: FloatingParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'wood' ? 4 : 2),
        size: Math.random() * (type === 'star' ? 14 : 10) + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 15,
        type,
        shape: type === 'wood' ? 'chip' : type === 'star' ? 'star' : 'circle',
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, [setParticles]);

  // Particle update loop
  useEffect(() => {
    let animId: number;
    const update = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.25, // gravity
            rotation: p.rotation + p.vRot,
            alpha: p.alpha - 0.02,
          }))
          .filter((p) => p.alpha > 0)
      );
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [setParticles]);

  // Trigger score bounce animation
  const triggerScoreBounce = () => {
    setScoreBouncing(true);
    setTimeout(() => setScoreBouncing(false), 400);
  };

  // Check achievements after state changes
  const checkAchievements = (newProg: GameProgress) => {
    const newlyUnlocked: string[] = [];
    if (newProg.totalSmashes >= 1 && !newProg.unlockedAchievements.includes('first_smash')) {
      newlyUnlocked.push('first_smash');
    }
    if (newProg.completedLetters.includes('A') && !newProg.unlockedAchievements.includes('a_for_apple')) {
      newlyUnlocked.push('a_for_apple');
    }
    if (newProg.score >= 100 && !newProg.unlockedAchievements.includes('score_100')) {
      newlyUnlocked.push('score_100');
    }
    if (newProg.score >= 500 && !newProg.unlockedAchievements.includes('score_500')) {
      newlyUnlocked.push('score_500');
    }
    if (newProg.completedLetters.length >= 5 && !newProg.unlockedAchievements.includes('letters_5')) {
      newlyUnlocked.push('letters_5');
    }
    if (newProg.completedLetters.length >= 10 && !newProg.unlockedAchievements.includes('letters_10')) {
      newlyUnlocked.push('letters_10');
    }
    if (newProg.completedLetters.length >= 20 && !newProg.unlockedAchievements.includes('letters_20')) {
      newlyUnlocked.push('letters_20');
    }
    if (newProg.completedLetters.length >= 15 && !newProg.unlockedAchievements.includes('alphabet_learner')) {
      newlyUnlocked.push('alphabet_learner');
    }
    if (newProg.completedLetters.length >= 25 && !newProg.unlockedAchievements.includes('alphabet_master')) {
      newlyUnlocked.push('alphabet_master');
    }
    if (newProg.completedLetters.length >= 26 && !newProg.unlockedAchievements.includes('az_completed')) {
      newlyUnlocked.push('az_completed');
    }

    if (newlyUnlocked.length > 0) {
      newProg.unlockedAchievements = [...newProg.unlockedAchievements, ...newlyUnlocked];
      audio.playLevelComplete(newProg.settings.sound);
      addScoreText('🏆 ACHIEVEMENT UNLOCKED!', window.innerWidth / 2, 160, '#f1c40f');
    }
  };

  // HANDLE BOX TAP
  const handleBoxTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (isBroken) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const tapX = rect.left + rect.width / 2;
    const tapY = rect.top + rect.height / 2;

    const nextHits = hits + 1;
    setHits(nextHits);

    if (nextHits === 1) {
      // FIRST HIT
      audio.playWoodHit1(progress.settings.sound);
      spawnParticles(tapX, tapY, 14, 'wood', ['#8c4815', '#b86b2b', '#d9883b']);
      spawnParticles(tapX, tapY, 6, 'star', ['#f1c40f', '#f39c12', '#ffffff']);
      addScoreText('+5', tapX, tapY - 40, '#ffd32a');
      setCelebrationBanner('GOOD HIT!');
      setTimeout(() => setCelebrationBanner(null), 1200);

      const updated = {
        ...progress,
        score: progress.score + 5,
        totalSmashes: progress.totalSmashes + 1,
      };
      triggerScoreBounce();
      checkAchievements(updated);
      onUpdateProgress(updated);
    } else if (nextHits === 2) {
      // SECOND HIT
      audio.playWoodHit2(progress.settings.sound);
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 250);

      spawnParticles(tapX, tapY, 22, 'wood', ['#6d350d', '#a05820', '#d9883b']);
      spawnParticles(tapX, tapY, 10, 'star', ['#f1c40f', '#f7b731', '#ffffff']);
      addScoreText('+5', tapX, tapY - 40, '#ffd32a');
      setCelebrationBanner('KEEP GOING!');
      setTimeout(() => setCelebrationBanner(null), 1200);

      const updated = {
        ...progress,
        score: progress.score + 5,
        totalSmashes: progress.totalSmashes + 1,
      };
      triggerScoreBounce();
      checkAchievements(updated);
      onUpdateProgress(updated);
    } else if (nextHits >= 3) {
      // THIRD HIT: BIG BREAK!
      setIsBroken(true);
      audio.playWoodBreak(progress.settings.sound);

      // Screen rumble
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 450);

      // Huge wood fragments, dust, and stars
      spawnParticles(tapX, tapY, 35, 'wood', ['#5a2d0c', '#8c4815', '#b86b2b', '#d9883b']);
      spawnParticles(tapX, tapY, 25, 'star', ['#f1c40f', '#ffffff', '#2ed573', '#ff4757']);
      
      // Confetti explosion
      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { x: tapX / window.innerWidth, y: tapY / window.innerHeight },
          zIndex: 1000,
        });
      } catch (err) {}

      addScoreText('+20 ⭐', tapX, tapY - 60, '#ffd32a');
      const randomMsg = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
      setCelebrationBanner(randomMsg);
      setTimeout(() => setCelebrationBanner(null), 1800);

      const updated = {
        ...progress,
        score: progress.score + 20,
        coins: progress.coins + 5,
        totalSmashes: progress.totalSmashes + 1,
      };
      triggerScoreBounce();
      checkAchievements(updated);
      onUpdateProgress(updated);

      // Trigger pop sound and automatic speech for discovering object
      setTimeout(() => {
        audio.playObjectPop(progress.settings.sound);
        audio.speakLetterAndWord(currentItem.letter, currentItem.word, progress.settings.voice);
      }, 700);
    }
  };

  // HANDLE OBJECT INTERACTION (Tap Apple, Ball, etc.)
  const handleObjectTap = () => {
    audio.playObjectTap(progress.settings.sound);
    audio.speakLetterAndWord(currentItem.letter, currentItem.word, progress.settings.voice);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    spawnParticles(centerX, centerY, 20, 'star', ['#f1c40f', '#ff4757', '#2ed573', '#ffffff']);
    addScoreText('+25 ⭐', centerX, centerY - 60, '#2ed573');
    setCelebrationBanner('AMAZING! ⭐');
    setTimeout(() => setCelebrationBanner(null), 1400);

    if (!hasTappedObject) {
      setHasTappedObject(true);

      // Letter completion reward (+50 points, 3 stars, +10 coins)
      audio.playLevelComplete(progress.settings.sound);

      const alreadyCompleted = progress.completedLetters.includes(currentItem.letter);
      const newCompleted = alreadyCompleted
        ? progress.completedLetters
        : [...progress.completedLetters, currentItem.letter];

      // Update daily challenge if tracking stars or levels
      const daily = { ...progress.dailyChallenge };
      if (daily.reqType === 'stars_earned') {
        daily.current = Math.min(daily.target, daily.current + 3);
      } else if (daily.reqType === 'levels_completed') {
        daily.current = Math.min(daily.target, daily.current + 1);
      }

      const updated: GameProgress = {
        ...progress,
        score: progress.score + 25 + 50,
        stars: progress.stars + 3,
        coins: progress.coins + 10,
        xp: progress.xp + 35,
        completedLetters: newCompleted,
        dailyChallenge: daily,
      };

      triggerScoreBounce();
      checkAchievements(updated);
      onUpdateProgress(updated);
    }
  };

  // REPLAY CURRENT LETTER
  const handleReplayLetter = () => {
    setHits(0);
    setIsBroken(false);
    setHasTappedObject(false);
    setCelebrationBanner(null);
  };

  // NEXT LETTER
  const handleNextLetter = () => {
    if (progress.currentLetterIdx >= ALPHABET_DATA.length - 1) {
      // Reached Z! Trigger grand finale celebration!
      onCompleteAll();
    } else {
      const nextIdx = progress.currentLetterIdx + 1;
      const updated = {
        ...progress,
        currentLetterIdx: nextIdx,
      };
      onUpdateProgress(updated);
      handleReplayLetter();
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none transition-transform duration-75 ${
        screenShake ? 'translate-x-1.5 translate-y-1.5 rotate-0.5' : ''
      }`}
      style={{
        background: 'linear-gradient(180deg, #60a5fa 0%, #93c5fd 45%, #86efac 75%, #4ade80 100%)',
      }}
    >
      {/* Decorative cartoon background clouds & sunshine */}
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-yellow-300/40 blur-xl pointer-events-none" />
      <div className="absolute top-10 left-4 w-40 h-16 bg-white/70 rounded-full blur-[1px] pointer-events-none animate-float-slow" />
      <div className="absolute top-20 right-6 w-52 h-20 bg-white/80 rounded-full blur-[1px] pointer-events-none animate-float-slow [animation-delay:1.8s]" />

      {/* Rolling green grass hills at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-emerald-600 via-emerald-500 to-transparent pointer-events-none" />

      {/* TOP HEADER: Navigation, Letter Progress, and Score Badges */}
      <div className="w-full max-w-xl flex items-center justify-between z-20 pt-2">
        {/* Home / Back Button */}
        <button
          onClick={onHome}
          aria-label="Return to menu"
          className="w-12 h-12 rounded-2xl bg-white/30 hover:bg-white/50 border-2 border-white/60 shadow-[0_4px_0_rgba(0,0,0,0.15)] flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
        >
          <Home className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Current Letter Badge: e.g. "Letter A (1/26)" */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border-3 border-amber-400 shadow-[0_4px_0_#d98020] flex items-center gap-2">
          <span className="text-xl font-black text-indigo-700">
            Letter {currentItem.letter}
          </span>
          <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {progress.currentLetterIdx + 1}/26
          </span>
        </div>

        {/* Animated Score Pill (Bounces when score increases) */}
        <motion.div
          animate={scoreBouncing ? { scale: [1, 1.28, 1], rotate: [-3, 3, 0] } : {}}
          transition={{ duration: 0.35 }}
          className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border-3 border-amber-400 shadow-[0_4px_0_#d98020] flex items-center gap-1.5 font-black text-slate-800 text-sm md:text-base"
        >
          <span className="text-lg">⭐</span>
          <span>{progress.score}</span>
        </motion.div>
      </div>

      {/* INSTRUCTION & TAP INDICATOR (Visible only before first hit) */}
      <div className="z-20 my-auto w-full flex flex-col items-center">
        <TapIndicator visible={hits === 0 && !isBroken} />

        {/* CENTERPIECE: Either the Wooden Box OR Object Discovery */}
        <AnimatePresence mode="wait">
          {!isBroken ? (
            <motion.div
              key="wooden-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <WoodenBox
                hits={hits}
                isBroken={isBroken}
                onTap={handleBoxTap}
                celebrationText={celebrationBanner}
                boxSkin={progress.activeBoxSkin}
              />
            </motion.div>
          ) : (
            <motion.div
              key="discovered-object"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="w-full flex justify-center"
            >
              <ObjectDiscovery
                item={currentItem}
                hasTappedObject={hasTappedObject}
                onObjectTap={handleObjectTap}
                onNextLetter={handleNextLetter}
                onReplayLetter={handleReplayLetter}
                isLastLetter={progress.currentLetterIdx === ALPHABET_DATA.length - 1}
                voiceEnabled={progress.settings.voice}
                onSpeak={() =>
                  audio.speakLetterAndWord(currentItem.letter, currentItem.word, true)
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM BRANDING (Clean & Subtle) */}
      <div className="z-20 text-center pb-2 pt-4">
        <p className="text-[11px] font-bold text-white/80 tracking-wider drop-shadow-sm">
          © VYRONIX CODER LTD • By Dilsher & Team
        </p>
      </div>
    </div>
  );
};
