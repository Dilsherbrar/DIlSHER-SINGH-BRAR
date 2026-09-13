import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Star, RotateCcw, Volume2, Trophy } from 'lucide-react';
import { GameProgress, MiniGameId } from '../types';
import { ALPHABET_DATA } from '../data/alphabetData';
import { audio } from '../utils/audio';

interface MiniGamesHubProps {
  progress: GameProgress;
  onUpdateProgress: (newProgress: GameProgress) => void;
  onBack: () => void;
}

const MINI_GAMES_LIST: { id: MiniGameId; title: string; subtitle: string; icon: string; color: string }[] = [
  { id: 'balloon_pop', title: 'Balloon Letters', subtitle: 'Pop the requested letter balloon!', icon: '🎈', color: 'from-pink-500 to-rose-600' },
  { id: 'fruit_catch', title: 'Fruit Catch', subtitle: 'Tap the falling fruits before they hit ground!', icon: '🍎', color: 'from-amber-500 to-orange-600' },
  { id: 'letter_pop', title: 'Letter Pop', subtitle: 'Tap the target bouncy bubbles!', icon: '🫧', color: 'from-cyan-500 to-blue-600' },
  { id: 'target_letter', title: 'Target Star', subtitle: 'Hit the target star letter!', icon: '🎯', color: 'from-purple-500 to-indigo-600' },
];

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({
  progress,
  onUpdateProgress,
  onBack,
}) => {
  const [activeGame, setActiveGame] = useState<MiniGameId | null>(null);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Target letter for Balloon Pop or Target Letter
  const [targetLetter, setTargetLetter] = useState<string>('A');
  const [balloonOptions, setBalloonOptions] = useState<{ id: number; letter: string; color: string }[]>([]);

  // Falling fruits for Fruit Catch
  const [fallingItems, setFallingItems] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);

  const startMiniGame = (gameId: MiniGameId) => {
    setActiveGame(gameId);
    setScore(0);
    setRound(1);
    setIsGameOver(false);
    setupRound(gameId, 1);
  };

  const setupRound = (gameId: MiniGameId, currentRound: number) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'P', 'S', 'Z'];
    const chosenTarget = letters[(currentRound - 1) % letters.length];
    setTargetLetter(chosenTarget);

    if (gameId === 'balloon_pop' || gameId === 'letter_pop' || gameId === 'target_letter') {
      const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6'];
      const otherLetters = letters.filter((l) => l !== chosenTarget).sort(() => 0.5 - Math.random()).slice(0, 3);
      const all = [chosenTarget, ...otherLetters].sort(() => 0.5 - Math.random());
      setBalloonOptions(
        all.map((l, i) => ({
          id: i,
          letter: l,
          color: colors[i % colors.length],
        }))
      );
      audio.speak(`Find letter ${chosenTarget}!`, progress.settings.voice);
    } else if (gameId === 'fruit_catch') {
      const fruits = ['🍎', '🍌', '🍇', '🍓', '🍊'];
      setFallingItems(
        fruits.map((f, i) => ({
          id: i,
          emoji: f,
          x: 15 + i * 18,
          y: 20 + (i % 2) * 20,
        }))
      );
    }
  };

  const handleBalloonTap = (letter: string) => {
    if (letter === targetLetter) {
      audio.playBalloonPop(progress.settings.sound);
      audio.playCorrect(progress.settings.sound);
      setScore((s) => s + 10);

      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}

      if (round < 5) {
        setRound((r) => r + 1);
        setTimeout(() => setupRound(activeGame!, round + 1), 600);
      } else {
        finishMiniGame(score + 10);
      }
    } else {
      audio.playWrong(progress.settings.sound);
      audio.speak('Try another one!', progress.settings.voice);
    }
  };

  const handleFruitTap = (id: number) => {
    audio.playObjectTap(progress.settings.sound);
    setScore((s) => s + 5);
    setFallingItems((prev) => prev.filter((item) => item.id !== id));

    if (fallingItems.length <= 1) {
      if (round < 3) {
        setRound((r) => r + 1);
        setTimeout(() => setupRound('fruit_catch', round + 1), 500);
      } else {
        finishMiniGame(score + 15);
      }
    }
  };

  const finishMiniGame = (finalScore: number) => {
    setIsGameOver(true);
    audio.playLevelComplete(progress.settings.sound);

    const updated: GameProgress = {
      ...progress,
      stars: progress.stars + 3,
      coins: progress.coins + 20,
      xp: progress.xp + 45,
      score: progress.score + finalScore,
      miniGamesPlayedCount: progress.miniGamesPlayedCount + 1,
    };
    onUpdateProgress(updated);
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 50%, #1a252f 100%)',
      }}
    >
      {/* Menu / Selection */}
      {!activeGame ? (
        <>
          <div className="w-full max-w-xl flex items-center justify-between z-10 pt-2 mb-4">
            <button
              onClick={onBack}
              aria-label="Back to menu"
              className="w-12 h-12 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/40 flex items-center justify-center text-white active:scale-95 transition-all shadow"
            >
              <ArrowLeft className="w-7 h-7 stroke-[2.5]" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-[0_2px_0_#b33939] tracking-wider flex items-center justify-center gap-2">
                <span>🎮</span>
                <span>MINI GAMES</span>
                <span>🎮</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-white/80">
                Fun arcade learning games!
              </p>
            </div>

            <div className="bg-amber-400 text-amber-950 font-black px-3.5 py-1.5 rounded-full border-2 border-white shadow text-sm">
              ⭐ {progress.stars}
            </div>
          </div>

          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4 z-10 my-auto py-2">
            {MINI_GAMES_LIST.map((game) => (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => startMiniGame(game.id)}
                className={`p-4 rounded-3xl border-3 border-white bg-gradient-to-r ${game.color} shadow-[0_6px_0_rgba(0,0,0,0.4)] flex items-center gap-4 text-left cursor-pointer`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/25 border-2 border-white/50 flex items-center justify-center text-4xl shrink-0 shadow-inner">
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-white text-lg drop-shadow">
                    {game.title}
                  </h3>
                  <p className="text-xs text-white/90 font-medium">{game.subtitle}</p>
                </div>
                <span className="text-xl text-white">▶</span>
              </motion.button>
            ))}
          </div>
        </>
      ) : isGameOver ? (
        /* Game Over Result */
        <div className="w-full max-w-md my-auto z-10 flex flex-col items-center text-center p-6 rounded-3xl bg-white/10 backdrop-blur-md border-4 border-amber-400 shadow-[0_12px_0_rgba(0,0,0,0.4)]">
          <span className="text-6xl mb-2 animate-bounce">🏆</span>
          <h3 className="text-3xl font-black text-amber-300 drop-shadow">
            AWESOME PLAY! 🎉
          </h3>
          <p className="text-base font-bold text-white/90 mt-1">
            Score: <span className="text-amber-300 text-xl font-black">{score}</span> points!
          </p>

          <div className="flex gap-4 my-4">
            <span className="bg-amber-400/20 border-2 border-amber-400 px-3 py-1.5 rounded-xl font-black text-amber-300">
              ⭐ +3 Stars
            </span>
            <span className="bg-yellow-400/20 border-2 border-yellow-400 px-3 py-1.5 rounded-xl font-black text-yellow-300">
              🪙 +20 Coins
            </span>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => startMiniGame(activeGame)}
              className="w-full py-3.5 px-4 rounded-2xl btn-cartoon-green text-white font-black text-lg border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>PLAY AGAIN</span>
            </button>
            <button
              onClick={() => setActiveGame(null)}
              className="w-full py-3.5 px-4 rounded-2xl btn-cartoon-blue text-white font-black text-lg border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>OTHER GAMES 🎮</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Mini Game Stage */
        <div className="w-full max-w-md my-auto z-10 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <button
              onClick={() => setActiveGame(null)}
              className="text-xs font-bold text-white/70 hover:text-white"
            >
              ✕ Exit Game
            </button>
            <span className="text-sm font-black text-amber-300">
              Round {round}/5 • Score: {score}
            </span>
          </div>

          {activeGame === 'fruit_catch' ? (
            /* Fruit Catch Mini Game */
            <div className="w-full flex flex-col items-center">
              <p className="text-xl font-black text-white mb-4">Tap the falling fruits! 🍎</p>
              <div className="w-full h-64 bg-white/10 rounded-3xl border-3 border-white/20 relative overflow-hidden">
                {fallingItems.map((item) => (
                  <motion.button
                    key={item.id}
                    animate={{ y: [0, 180, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    onClick={() => handleFruitTap(item.id)}
                    className="absolute text-5xl cursor-pointer active:scale-125 transition-transform"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  >
                    {item.emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            /* Balloon / Target Letter Mini Game */
            <div className="w-full flex flex-col items-center">
              <div className="p-4 bg-white/20 rounded-2xl border-2 border-white/40 mb-6 text-center">
                <p className="text-sm font-bold text-white/80">Pop the balloon with:</p>
                <span className="text-6xl font-black text-amber-300 drop-shadow">
                  {targetLetter}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {balloonOptions.map((b) => (
                  <motion.button
                    key={b.id}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 + b.id * 0.3 }}
                    onClick={() => handleBalloonTap(b.letter)}
                    className="h-32 rounded-3xl border-4 border-white flex flex-col items-center justify-center font-black text-5xl text-white shadow-xl active:scale-90 transition-transform cursor-pointer relative"
                    style={{ backgroundColor: b.color }}
                  >
                    <span className="drop-shadow-md">{b.letter}</span>
                    <span className="text-xs text-white/70 absolute bottom-2">🎈</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Branding */}
      <div className="z-10 text-center pt-4 pb-2">
        <p className="text-xs font-bold text-white/70 tracking-wider">
          © VYRONIX CODER LTD • By Dilsher & Team
        </p>
      </div>
    </div>
  );
};
