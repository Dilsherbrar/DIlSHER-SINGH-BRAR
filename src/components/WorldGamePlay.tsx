import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Star, Volume2, RotateCcw, Award, CheckCircle } from 'lucide-react';
import { WorldId, GameProgress } from '../types';
import { WORLDS_DATA, COLORS_DATA, NUMBERS_DATA } from '../data/expansionData';
import { ALPHABET_DATA } from '../data/alphabetData';
import { audio } from '../utils/audio';

interface WorldGamePlayProps {
  worldId: WorldId;
  progress: GameProgress;
  onUpdateProgress: (newProgress: GameProgress) => void;
  onBack: () => void;
}

export const WorldGamePlay: React.FC<WorldGamePlayProps> = ({
  worldId,
  progress,
  onUpdateProgress,
  onBack,
}) => {
  const worldInfo = WORLDS_DATA.find((w) => w.id === worldId) || WORLDS_DATA[0];

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(3);
  const [mistakes, setMistakes] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Memory card game state for World 9
  const [memoryCards, setMemoryCards] = useState<
    { id: number; visual: string; pairId: string; flipped: boolean; matched: boolean }[]
  >([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // Puzzle pieces for World 10
  const [puzzlePlaced, setPuzzlePlaced] = useState<boolean[]>([false, false, false]);

  // Missing letter merge animation state for World 4
  const [missingLetterCompletedWord, setMissingLetterCompletedWord] = useState<string | null>(null);

  // Initialize level content
  useEffect(() => {
    setIsLevelComplete(false);
    setMistakes(0);
    setFeedback(null);
    setMissingLetterCompletedWord(null);

    if (worldId === 'w9_memory') {
      // Setup 6 cards (3 pairs)
      const pairs = [
        { pairId: 'apple', visual: '🍎' },
        { pairId: 'ball', visual: '⚽' },
        { pairId: 'car', visual: '🚗' },
      ];
      const deck = [...pairs, ...pairs]
        .sort(() => 0.5 - Math.random())
        .map((c, i) => ({
          id: i,
          visual: c.visual,
          pairId: c.pairId,
          flipped: false,
          matched: false,
        }));
      setMemoryCards(deck);
      setSelectedCards([]);
    } else if (worldId === 'w10_puzzle') {
      setPuzzlePlaced([false, false, false]);
    }
  }, [worldId, currentLevel]);

  // Award level completion
  const handleLevelFinished = (finalMistakes = mistakes) => {
    setIsLevelComplete(true);
    const awardedStars = finalMistakes === 0 ? 3 : finalMistakes <= 2 ? 2 : 1;
    setStarsEarned(awardedStars);

    audio.playLevelComplete(progress.settings.sound);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    const key = `${worldId}_${currentLevel}`;
    const previousBestStars = progress.levelStars[key] || 0;
    const bestStars = Math.max(previousBestStars, awardedStars);

    const updated: GameProgress = {
      ...progress,
      stars: progress.stars + awardedStars,
      coins: progress.coins + 15,
      xp: progress.xp + 40,
      score: progress.score + 50,
      levelStars: {
        ...progress.levelStars,
        [key]: bestStars,
      },
    };

    onUpdateProgress(updated);
  };

  // Next level
  const handleNextLevel = () => {
    if (currentLevel < worldInfo.totalLevels) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      onBack(); // finished all levels in this world
    }
  };

  // --- RENDER GAMEPLAY PER WORLD ---

  // WORLD 2: Letter Matching (🍎 Apple -> A, B, C)
  const renderWorld2 = () => {
    const item = ALPHABET_DATA[(currentLevel - 1) % ALPHABET_DATA.length];
    const distractors = ALPHABET_DATA.filter((a) => a.letter !== item.letter)
      .slice(0, 2)
      .map((a) => a.letter);
    const options = [item.letter, ...distractors].sort(() => 0.5 - Math.random());

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-8xl my-2 animate-bounce">{item.emoji}</div>
        <p className="text-2xl font-black text-white drop-shadow">
          Which letter starts {item.word}?
        </p>
        <div className="flex gap-4 mt-3">
          {options.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                if (letter === item.letter) {
                  audio.playCorrect(progress.settings.sound);
                  audio.speak(`${item.letter}! ${item.letter} for ${item.word}!`, progress.settings.voice);
                  setFeedback(`${letter}! GREAT JOB! ⭐`);
                  setTimeout(() => handleLevelFinished(), 1200);
                } else {
                  audio.playWrong(progress.settings.sound);
                  setMistakes((m) => m + 1);
                  setFeedback('TRY AGAIN! 😊');
                }
              }}
              className="w-20 h-20 rounded-3xl bg-white text-indigo-900 border-4 border-amber-400 font-black text-4xl shadow-[0_6px_0_#d98020] active:scale-95 transition-transform"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 3: Word Matching (🍎 -> APPLE, BALL, DOG)
  const renderWorld3 = () => {
    const item = ALPHABET_DATA[(currentLevel + 2) % ALPHABET_DATA.length];
    const distractors = ALPHABET_DATA.filter((a) => a.word !== item.word)
      .slice(0, 2)
      .map((a) => a.word);
    const options = [item.word, ...distractors].sort(() => 0.5 - Math.random());

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-8xl my-2 filter drop-shadow-lg">{item.emoji}</div>
        <p className="text-xl font-black text-white drop-shadow">
          Tap the correct word:
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
          {options.map((w) => (
            <button
              key={w}
              onClick={() => {
                if (w === item.word) {
                  audio.playCorrect(progress.settings.sound);
                  audio.speak(`${item.letter} for ${item.word}!`, progress.settings.voice);
                  setFeedback(`🎉 ${item.letter} FOR ${item.word.toUpperCase()}!`);
                  setTimeout(() => handleLevelFinished(), 1200);
                } else {
                  audio.playWrong(progress.settings.sound);
                  setMistakes((m) => m + 1);
                  setFeedback('TRY AGAIN! 😊');
                }
              }}
              className="py-4 px-6 rounded-2xl bg-white text-indigo-950 border-4 border-emerald-400 font-black text-2xl shadow-[0_5px_0_#05c46b] active:scale-95 transition-transform"
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 4: Missing Letter (_PPLE -> A, B, C -> A + PPLE = APPLE)
  const renderWorld4 = () => {
    const item = ALPHABET_DATA[(currentLevel + 4) % ALPHABET_DATA.length];
    const missingLetter = item.letter;
    const restOfWord = item.word.slice(1).toUpperCase();
    const options = [missingLetter, 'B', 'C'].sort(() => 0.5 - Math.random());

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-7xl mb-1">{item.emoji}</div>

        {/* Missing Letter Box */}
        <div className="flex items-center gap-2 text-4xl sm:text-5xl font-black text-white bg-black/30 px-6 py-3 rounded-2xl border-2 border-white/40">
          <span className="w-12 h-14 bg-amber-400 text-amber-950 rounded-xl flex items-center justify-center border-2 border-white animate-pulse">
            {missingLetterCompletedWord ? missingLetter : '_'}
          </span>
          <span>{restOfWord}</span>
        </div>

        {missingLetterCompletedWord && (
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black text-amber-300"
          >
            {missingLetter} + {restOfWord} = {item.word.toUpperCase()}! 🎉
          </motion.p>
        )}

        <div className="flex gap-4 mt-3">
          {options.map((l) => (
            <button
              key={l}
              onClick={() => {
                if (l === missingLetter) {
                  setMissingLetterCompletedWord(item.word);
                  audio.playCorrect(progress.settings.sound);
                  audio.speak(`${missingLetter} for ${item.word}!`, progress.settings.voice);
                  setFeedback('CORRECT! 🌟');
                  setTimeout(() => handleLevelFinished(), 1400);
                } else {
                  audio.playWrong(progress.settings.sound);
                  setMistakes((m) => m + 1);
                  setFeedback('TRY AGAIN! 😊');
                }
              }}
              className="w-18 h-18 rounded-2xl bg-white text-indigo-900 border-4 border-amber-400 font-black text-3xl shadow-[0_5px_0_#d98020] active:scale-95"
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 5: Tap The Correct Object (Letter B -> find ⚽ among 🍎, ⚽, 🐶, 🚗)
  const renderWorld5 = () => {
    const targetItem = ALPHABET_DATA[(currentLevel + 6) % ALPHABET_DATA.length];
    const distractors = ALPHABET_DATA.filter((a) => a.letter !== targetItem.letter).slice(0, 3);
    const objects = [targetItem, ...distractors].sort(() => 0.5 - Math.random());

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-amber-400 border-4 border-white flex items-center justify-center text-5xl font-black text-amber-950 shadow-[0_6px_0_#b33939]">
          {targetItem.letter}
        </div>
        <p className="text-xl sm:text-2xl font-black text-white text-center drop-shadow">
          Find something that starts with{' '}
          <span className="text-amber-300 font-black">{targetItem.letter}</span>!
        </p>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {objects.map((obj) => (
            <button
              key={obj.letter}
              onClick={() => {
                if (obj.letter === targetItem.letter) {
                  audio.playCorrect(progress.settings.sound);
                  audio.speak(`${obj.word}! ${obj.letter} for ${obj.word}!`, progress.settings.voice);
                  setFeedback(`🎉 ${obj.word.toUpperCase()}! AWESOME!`);
                  setTimeout(() => handleLevelFinished(), 1200);
                } else {
                  audio.playWrong(progress.settings.sound);
                  setMistakes((m) => m + 1);
                  setFeedback('TRY AGAIN! 😊');
                }
              }}
              className="w-28 h-28 rounded-3xl bg-white/95 border-4 border-amber-300 shadow-[0_6px_0_#d98020] flex flex-col items-center justify-center text-5xl active:scale-90 transition-transform"
            >
              <span>{obj.emoji}</span>
              <span className="text-xs font-black text-slate-700 mt-1">{obj.word}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 6: Colour & Learn (Find RED apple among blue, yellow, green)
  const renderWorld6 = () => {
    const targetColor = COLORS_DATA[(currentLevel - 1) % COLORS_DATA.length];
    const options = [...COLORS_DATA].sort(() => 0.5 - Math.random()).slice(0, 4);

    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="px-6 py-2.5 rounded-full text-white font-black text-2xl border-3 border-white shadow-lg"
          style={{ backgroundColor: targetColor.hex }}
        >
          {targetColor.name}
        </div>
        <p className="text-xl sm:text-2xl font-black text-white text-center drop-shadow">
          Find the <span className="underline">{targetColor.name}</span> object!
        </p>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {options.map((col) => (
            <button
              key={col.name}
              onClick={() => {
                if (col.name === targetColor.name) {
                  audio.playCorrect(progress.settings.sound);
                  audio.speak(`${col.name}! Great job!`, progress.settings.voice);
                  setFeedback(`🎉 ${col.name.toUpperCase()}! GREAT!`);
                  setTimeout(() => handleLevelFinished(), 1200);
                } else {
                  audio.playWrong(progress.settings.sound);
                  setMistakes((m) => m + 1);
                  setFeedback('TRY AGAIN! 😊');
                }
              }}
              className="w-28 h-28 rounded-3xl border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-5xl active:scale-95 transition-transform"
              style={{ backgroundColor: col.hex }}
            >
              <span>{col.emoji}</span>
              <span className="text-xs font-black text-white mt-1 drop-shadow">
                {col.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 7: Numbers & Counting (Count stars inside box)
  const renderWorld7 = () => {
    const targetNumber = NUMBERS_DATA[currentLevel % NUMBERS_DATA.length];
    const distractors = [targetNumber.num + 1, Math.max(1, targetNumber.num - 1), targetNumber.num + 2].slice(0, 2);
    const options = [targetNumber.num, ...distractors].sort(() => 0.5 - Math.random());

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white/20 p-6 rounded-3xl border-3 border-white flex flex-wrap justify-center gap-2 max-w-xs text-3xl">
          {Array.from({ length: targetNumber.num }).map((_, i) => (
            <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
              {targetNumber.emoji}
            </span>
          ))}
        </div>
        <p className="text-2xl font-black text-white drop-shadow">
          How many {targetNumber.word}s?
        </p>
        <div className="flex gap-4 mt-2">
          {options.map((n) => (
            <button
              key={n}
              onClick={() => {
                if (n === targetNumber.num) {
                  audio.playCorrect(progress.settings.sound);
                  audio.speakCount(targetNumber.num, targetNumber.word, progress.settings.voice);
                  setFeedback(`🎉 ${targetNumber.num}! ${targetNumber.word.toUpperCase()}!`);
                  setTimeout(() => handleLevelFinished(), 1200);
                } else {
                  audio.playWrong(progress.settings.sound);
                  setMistakes((m) => m + 1);
                  setFeedback('TRY AGAIN! 😊');
                }
              }}
              className="w-20 h-20 rounded-3xl bg-white text-indigo-950 border-4 border-amber-400 font-black text-3xl shadow-[0_5px_0_#d98020] active:scale-95"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 8: Simple Math (🍎 + 🍎 = ?)
  const renderWorld8 = () => {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl sm:text-5xl font-black text-white bg-black/20 p-5 rounded-3xl border-2 border-white/30 flex items-center gap-3">
          <span>🍎</span>
          <span>+</span>
          <span>🍎</span>
          <span>=</span>
          <span className="text-amber-300">?</span>
        </div>
        <p className="text-2xl font-black text-white">One apple + One apple = ?</p>
        <div className="flex gap-4 mt-2">
          {[2, 3, 1].map((ans) => (
            <button
              key={ans}
              onClick={() => {
                if (ans === 2) {
                  audio.playCorrect(progress.settings.sound);
                  audio.speak('Two! One plus one is two!', progress.settings.voice);
                  setFeedback('🎉 2 APPLES! AWESOME!');
                  setTimeout(() => handleLevelFinished(), 1200);
                } else {
                  audio.playWrong(progress.settings.sound);
                  setMistakes((m) => m + 1);
                  setFeedback('TRY AGAIN! 😊');
                }
              }}
              className="w-20 h-20 rounded-3xl bg-white text-indigo-950 border-4 border-emerald-400 font-black text-3xl shadow-[0_5px_0_#05c46b] active:scale-95"
            >
              {ans}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 9: Memory Match (Flip 6 cards)
  const renderWorld9 = () => {
    const handleCardClick = (index: number) => {
      if (selectedCards.length >= 2 || memoryCards[index].flipped || memoryCards[index].matched) return;

      audio.playCardFlip(progress.settings.sound);
      const newDeck = [...memoryCards];
      newDeck[index].flipped = true;
      setMemoryCards(newDeck);

      const newSelected = [...selectedCards, index];
      setSelectedCards(newSelected);

      if (newSelected.length === 2) {
        const [first, second] = newSelected;
        if (newDeck[first].pairId === newDeck[second].pairId) {
          // MATCH!
          setTimeout(() => {
            audio.playCorrect(progress.settings.sound);
            newDeck[first].matched = true;
            newDeck[second].matched = true;
            setMemoryCards([...newDeck]);
            setSelectedCards([]);

            if (newDeck.every((c) => c.matched)) {
              setTimeout(() => handleLevelFinished(), 800);
            }
          }, 500);
        } else {
          // No match, gently flip back
          setTimeout(() => {
            newDeck[first].flipped = false;
            newDeck[second].flipped = false;
            setMemoryCards([...newDeck]);
            setSelectedCards([]);
          }, 900);
        }
      }
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-xl font-black text-white">Find the matching pairs!</p>
        <div className="grid grid-cols-3 gap-3">
          {memoryCards.map((card, i) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(i)}
              className={`w-24 h-28 rounded-2xl border-4 font-black text-5xl flex items-center justify-center transition-all ${
                card.flipped || card.matched
                  ? 'bg-white border-amber-400 text-slate-800 shadow-[0_4px_0_#d98020]'
                  : 'bg-indigo-600 border-white text-white shadow-[0_4px_0_#2b1055]'
              }`}
            >
              {card.flipped || card.matched ? card.visual : '❓'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 10: Puzzle Builder (Snap 3 cute pieces)
  const renderWorld10 = () => {
    const pieces = ['🍎', '🐛', '🌱'];
    const handlePieceSnap = (idx: number) => {
      audio.playCorrect(progress.settings.sound);
      const next = [...puzzlePlaced];
      next[idx] = true;
      setPuzzlePlaced(next);

      if (next.every((p) => p)) {
        setFeedback('🎉 PUZZLE COMPLETE!');
        setTimeout(() => handleLevelFinished(), 1000);
      }
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-xl font-black text-white">Tap the pieces to complete the puzzle!</p>
        {/* Puzzle Board Slots */}
        <div className="flex gap-3 bg-black/30 p-4 rounded-3xl border-3 border-white/30">
          {puzzlePlaced.map((placed, i) => (
            <div
              key={i}
              className={`w-22 h-24 rounded-2xl border-3 border-dashed flex items-center justify-center text-5xl ${
                placed ? 'bg-white border-amber-400' : 'border-white/40'
              }`}
            >
              {placed ? pieces[i] : '🧩'}
            </div>
          ))}
        </div>

        {/* Piece Choices */}
        <div className="flex gap-3 mt-3">
          {pieces.map((p, i) => (
            <button
              key={p}
              disabled={puzzlePlaced[i]}
              onClick={() => handlePieceSnap(i)}
              className={`w-20 h-20 rounded-2xl bg-white border-3 border-amber-400 text-4xl flex items-center justify-center shadow-[0_4px_0_#d98020] active:scale-95 ${
                puzzlePlaced[i] ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // WORLD 11: Sound & Letter (Listening challenge)
  const renderWorld11 = () => {
    const item = ALPHABET_DATA[currentLevel % ALPHABET_DATA.length];
    const options = [item, ALPHABET_DATA[(currentLevel + 2) % 26], ALPHABET_DATA[(currentLevel + 5) % 26]].sort(
      () => 0.5 - Math.random()
    );

    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => audio.speak(item.letter, progress.settings.voice)}
          className="p-5 rounded-full bg-amber-400 text-amber-950 border-4 border-white shadow-xl flex items-center gap-2 text-2xl font-black active:scale-95"
        >
          <Volume2 className="w-8 h-8" />
          <span>Tap to Hear Letter</span>
        </button>
        <p className="text-xl font-black text-white">Which object starts with that sound?</p>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {options.map((opt) => (
            <button
              key={opt.letter}
              onClick={() => {
                if (opt.letter === item.letter) {
                  audio.playCorrect(progress.settings.sound);
                  audio.speak(`${item.letter}! ${item.word}!`, progress.settings.voice);
                  setFeedback(`🎉 ${item.word.toUpperCase()}!`);
                  setTimeout(() => handleLevelFinished(), 1200);
                } else {
                  audio.playWrong(progress.settings.sound);
                  setMistakes((m) => m + 1);
                  setFeedback('TRY AGAIN! 😊');
                }
              }}
              className="w-24 h-28 rounded-3xl bg-white border-4 border-amber-400 flex flex-col items-center justify-center text-4xl shadow-[0_5px_0_#d98020] active:scale-95"
            >
              <span>{opt.emoji}</span>
              <span className="text-xs font-black text-slate-800 mt-1">{opt.word}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderActiveWorld = () => {
    switch (worldId) {
      case 'w2_letter_match':
        return renderWorld2();
      case 'w3_word_match':
        return renderWorld3();
      case 'w4_missing_letter':
        return renderWorld4();
      case 'w5_find_object':
        return renderWorld5();
      case 'w6_colors':
        return renderWorld6();
      case 'w7_numbers':
        return renderWorld7();
      case 'w8_math':
        return renderWorld8();
      case 'w9_memory':
        return renderWorld9();
      case 'w10_puzzle':
        return renderWorld10();
      case 'w11_listening':
        return renderWorld11();
      default:
        return renderWorld2();
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto"
      style={{
        background: `linear-gradient(180deg, ${worldInfo.color} 0%, ${worldInfo.borderColor} 100%)`,
      }}
    >
      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center justify-between z-10 pt-2 mb-4">
        <button
          onClick={onBack}
          aria-label="Back to map"
          className="w-12 h-12 rounded-2xl bg-white/30 hover:bg-white/40 border-2 border-white/60 flex items-center justify-center text-white active:scale-95 transition-all shadow"
        >
          <ArrowLeft className="w-7 h-7 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <span className="text-xs font-black text-amber-200 uppercase bg-black/25 px-2.5 py-0.5 rounded-full">
            World {worldInfo.number} • Level {currentLevel}/{worldInfo.totalLevels}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow mt-0.5">
            {worldInfo.title}
          </h2>
        </div>

        <div className="bg-amber-400 text-amber-950 font-black px-3.5 py-1.5 rounded-full border-2 border-white shadow text-sm">
          ⭐ {progress.stars}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="w-full max-w-md my-auto z-10 flex flex-col items-center">
        {!isLevelComplete ? (
          <>
            {renderActiveWorld()}

            {/* Feedback Banner */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="mt-6 px-6 py-2 rounded-full bg-white text-slate-900 font-black text-base shadow-xl border-3 border-amber-400"
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Level Complete Celebration Card */
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full p-6 rounded-3xl bg-white/10 backdrop-blur-md border-4 border-amber-400 shadow-[0_12px_0_rgba(0,0,0,0.4)] text-center flex flex-col items-center"
          >
            <span className="text-6xl mb-1">🎉</span>
            <h3 className="text-3xl font-black text-amber-300 drop-shadow">
              LEVEL COMPLETE!
            </h3>

            {/* 3-Star Rating Display */}
            <div className="flex gap-2 my-4">
              {[1, 2, 3].map((starIdx) => (
                <motion.span
                  key={starIdx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: starIdx * 0.15 }}
                  className="text-4xl"
                >
                  {starIdx <= starsEarned ? '⭐' : '⚪'}
                </motion.span>
              ))}
            </div>

            {/* Rewards */}
            <div className="flex gap-4 my-2 text-sm font-black text-white">
              <span className="bg-amber-400/30 px-3 py-1.5 rounded-xl border border-amber-400">
                ⭐ +{starsEarned} Stars
              </span>
              <span className="bg-yellow-400/30 px-3 py-1.5 rounded-xl border border-yellow-400">
                🪙 +15 Coins
              </span>
              <span className="bg-cyan-400/30 px-3 py-1.5 rounded-xl border border-cyan-400">
                🏆 +40 XP
              </span>
            </div>

            {/* Next Level Button */}
            <button
              onClick={handleNextLevel}
              className="w-full mt-4 py-4 px-6 rounded-2xl btn-cartoon-green text-white font-black text-xl border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg"
            >
              <span>{currentLevel < worldInfo.totalLevels ? 'NEXT LEVEL →' : 'FINISH WORLD 🏆'}</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="z-10 text-center pt-4 pb-2">
        <p className="text-xs font-bold text-white/70 tracking-wider">
          © VYRONIX CODER LTD • By Dilsher & Team
        </p>
      </div>
    </div>
  );
};
