/**
 * SMASH LEARN & PLAY
 * © VYRONIX CODER LTD
 * By Dilsher & Team
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameScreen, GameProgress, FloatingParticle, FloatingScoreText, GameSettings, WorldId } from './types';
import { loadProgress, saveProgress, resetProgress as clearStorage } from './utils/storage';
import { audio } from './utils/audio';
import { SplashScreen } from './components/SplashScreen';
import { MainMenu } from './components/MainMenu';
import { PlayScreen } from './components/PlayScreen';
import { AlphabetScreen } from './components/AlphabetScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { SettingsModal } from './components/SettingsModal';
import { FinalCelebrationModal } from './components/FinalCelebrationModal';
import { ParticleLayer } from './components/ParticleLayer';
import { LearningMap } from './components/LearningMap';
import { QuizHub } from './components/QuizHub';
import { MiniGamesHub } from './components/MiniGamesHub';
import { ReviewScreen } from './components/ReviewScreen';
import { WorldGamePlay } from './components/WorldGamePlay';
import { ProfileModal } from './components/ProfileModal';
import { CosmeticsModal } from './components/CosmeticsModal';
import { RewardChestModal } from './components/RewardChestModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { LevelUpModal } from './components/LevelUpModal';
import { MascotGuide } from './components/MascotGuide';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('SPLASH');
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  // Active world selected for WorldGamePlay
  const [selectedWorldId, setSelectedWorldId] = useState<WorldId>('w2_letter_match');

  // Modals state
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showCosmetics, setShowCosmetics] = useState<boolean>(false);
  const [showRewardChest, setShowRewardChest] = useState<boolean>(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState<boolean>(false);
  const [showFinalCelebration, setShowFinalCelebration] = useState<boolean>(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  // Global particle & floating text states
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [scoreTexts, setScoreTexts] = useState<FloatingScoreText[]>([]);

  // Keep storage in sync whenever progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Background music management
  useEffect(() => {
    if (progress.settings.music && screen !== 'SPLASH') {
      audio.startMusic(true);
    } else {
      audio.stopMusic();
    }
  }, [progress.settings.music, screen]);

  // User gesture unlock for Web Audio context
  const handleUserInteraction = () => {
    if (progress.settings.music && screen !== 'SPLASH') {
      audio.startMusic(true);
    }
  };

  const handleUpdateProgress = (newProg: GameProgress) => {
    // Check if player leveled up
    if (newProg.playerLevel > progress.playerLevel) {
      setLevelUpLevel(newProg.playerLevel);
    }
    setProgress(newProg);
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    const updated: GameProgress = {
      ...progress,
      settings: newSettings,
    };
    setProgress(updated);
    audio.toggleMusic(newSettings.music);
  };

  const handleResetProgress = () => {
    const fresh = clearStorage();
    setProgress(fresh);
    audio.playLevelComplete(fresh.settings.sound);
  };

  const handleSelectWorld = (worldId: WorldId) => {
    audio.playButtonClick(progress.settings.sound);
    if (worldId === 'w1_alphabet') {
      setScreen('PLAY');
    } else {
      setSelectedWorldId(worldId);
      setScreen('WORLD_PLAY');
    }
  };

  const handleSelectLetterFromGrid = (letterIdx: number) => {
    audio.playButtonClick(progress.settings.sound);
    setProgress((prev) => ({
      ...prev,
      currentLetterIdx: letterIdx,
    }));
    setScreen('PLAY');
  };

  const handlePlayAgainFromFinale = () => {
    audio.playButtonClick(progress.settings.sound);
    setShowFinalCelebration(false);
    setProgress((prev) => ({
      ...prev,
      currentLetterIdx: 0,
    }));
    setScreen('PLAY');
  };

  const handleExploreWorldsFromFinale = () => {
    audio.playButtonClick(progress.settings.sound);
    setShowFinalCelebration(false);
    setScreen('MAP');
  };

  return (
    <div
      onClick={handleUserInteraction}
      className="min-h-screen w-full bg-[#1b1035] flex items-center justify-center font-['Fredoka',sans-serif] select-none text-white relative overflow-hidden"
    >
      {/* Mobile-Game Container Shell */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[850px] sm:max-h-[920px] sm:rounded-3xl sm:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_8px_#341f97] sm:border-4 sm:border-white/20 relative flex flex-col overflow-hidden bg-slate-900">
        
        {/* Global Particles & Floating Text Overlay */}
        <ParticleLayer particles={particles} scoreTexts={scoreTexts} />

        {/* Mascot Barnaby Bear floating guide (visible on main game screens) */}
        {screen !== 'SPLASH' && (
          <MascotGuide voiceEnabled={progress.settings.voice} />
        )}

        {/* Screen Transitions */}
        <AnimatePresence mode="wait">
          {screen === 'SPLASH' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-30"
            >
              <SplashScreen onFinish={() => setScreen('MENU')} />
            </motion.div>
          )}

          {screen === 'MENU' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="h-full w-full flex flex-col"
            >
              <MainMenu
                onPlay={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('PLAY');
                }}
                onMap={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MAP');
                }}
                onQuiz={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('QUIZ');
                }}
                onMiniGames={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MINI_GAMES');
                }}
                onAlphabet={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('ALPHABET');
                }}
                onReview={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('REVIEW');
                }}
                onRewards={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('REWARDS');
                }}
                onCosmetics={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setShowCosmetics(true);
                }}
                onDailyChallenge={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setShowDailyChallenge(true);
                }}
                onChest={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setShowRewardChest(true);
                }}
                onProfile={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setShowProfile(true);
                }}
                onSettings={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setShowSettings(true);
                }}
                progress={progress}
                onToggleSound={() =>
                  handleUpdateSettings({
                    ...progress.settings,
                    sound: !progress.settings.sound,
                  })
                }
                onToggleMusic={() =>
                  handleUpdateSettings({
                    ...progress.settings,
                    music: !progress.settings.music,
                  })
                }
              />
            </motion.div>
          )}

          {screen === 'PLAY' && (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="h-full w-full flex flex-col"
            >
              <PlayScreen
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onHome={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MENU');
                }}
                onCompleteAll={() => {
                  audio.playGrandFanfare(progress.settings.sound);
                  setShowFinalCelebration(true);
                }}
                particles={particles}
                setParticles={setParticles}
                scoreTexts={scoreTexts}
                setScoreTexts={setScoreTexts}
              />
            </motion.div>
          )}

          {screen === 'MAP' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col"
            >
              <LearningMap
                progress={progress}
                onBack={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MENU');
                }}
                onSelectWorld={handleSelectWorld}
              />
            </motion.div>
          )}

          {screen === 'WORLD_PLAY' && (
            <motion.div
              key="world_play"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="h-full w-full flex flex-col"
            >
              <WorldGamePlay
                worldId={selectedWorldId}
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onBack={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MAP');
                }}
              />
            </motion.div>
          )}

          {screen === 'QUIZ' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col"
            >
              <QuizHub
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onBack={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MENU');
                }}
              />
            </motion.div>
          )}

          {screen === 'MINI_GAMES' && (
            <motion.div
              key="mini_games"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col"
            >
              <MiniGamesHub
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
                onBack={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MENU');
                }}
              />
            </motion.div>
          )}

          {screen === 'REVIEW' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col"
            >
              <ReviewScreen
                progress={progress}
                onBack={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MENU');
                }}
              />
            </motion.div>
          )}

          {screen === 'ALPHABET' && (
            <motion.div
              key="alphabet"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col"
            >
              <AlphabetScreen
                progress={progress}
                onBack={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MENU');
                }}
                onSelectLetter={handleSelectLetterFromGrid}
              />
            </motion.div>
          )}

          {screen === 'REWARDS' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col"
            >
              <RewardsScreen
                progress={progress}
                onBack={() => {
                  audio.playButtonClick(progress.settings.sound);
                  setScreen('MENU');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* SETTINGS MODAL */}
        <AnimatePresence>
          {showSettings && (
            <SettingsModal
              settings={progress.settings}
              onUpdateSettings={handleUpdateSettings}
              onResetProgress={handleResetProgress}
              onClose={() => {
                audio.playButtonClick(progress.settings.sound);
                setShowSettings(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* PROFILE MODAL */}
        <AnimatePresence>
          {showProfile && (
            <ProfileModal
              progress={progress}
              onClose={() => {
                audio.playButtonClick(progress.settings.sound);
                setShowProfile(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* COSMETICS / DRESS UP MODAL */}
        <AnimatePresence>
          {showCosmetics && (
            <CosmeticsModal
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onClose={() => {
                audio.playButtonClick(progress.settings.sound);
                setShowCosmetics(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* REWARD CHEST MODAL */}
        <AnimatePresence>
          {showRewardChest && (
            <RewardChestModal
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onClose={() => {
                audio.playButtonClick(progress.settings.sound);
                setShowRewardChest(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* DAILY MISSION MODAL */}
        <AnimatePresence>
          {showDailyChallenge && (
            <DailyChallengeModal
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onClose={() => {
                audio.playButtonClick(progress.settings.sound);
                setShowDailyChallenge(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* LEVEL UP MODAL */}
        <AnimatePresence>
          {levelUpLevel !== null && (
            <LevelUpModal
              level={levelUpLevel}
              onClose={() => setLevelUpLevel(null)}
              soundEnabled={progress.settings.sound}
            />
          )}
        </AnimatePresence>

        {/* FINAL CELEBRATION MODAL */}
        <AnimatePresence>
          {showFinalCelebration && (
            <FinalCelebrationModal
              progress={progress}
              onPlayAgain={handlePlayAgainFromFinale}
              onExploreWorlds={handleExploreWorldsFromFinale}
              onMainMenu={() => {
                audio.playButtonClick(progress.settings.sound);
                setShowFinalCelebration(false);
                setScreen('MENU');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
