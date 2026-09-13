import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Star, Volume2, Trophy, RotateCcw, Award, CheckCircle2, Heart } from 'lucide-react';
import { QuizCategory, QuizQuestion, GameProgress } from '../types';
import { generateQuizQuestions } from '../data/expansionData';
import { audio } from '../utils/audio';

interface QuizHubProps {
  progress: GameProgress;
  onUpdateProgress: (newProgress: GameProgress) => void;
  onBack: () => void;
}

const QUIZ_CATEGORIES: { id: QuizCategory; title: string; icon: string; color: string }[] = [
  { id: 'alphabet', title: 'Alphabet Quiz', icon: '🔤', color: 'from-rose-500 to-red-600' },
  { id: 'words', title: 'Word Quiz', icon: '🧩', color: 'from-emerald-500 to-teal-600' },
  { id: 'colors', title: 'Colour Quiz', icon: '🎨', color: 'from-blue-500 to-indigo-600' },
  { id: 'numbers', title: 'Number Quiz', icon: '🔢', color: 'from-purple-500 to-violet-600' },
  { id: 'math', title: 'Math Quiz', icon: '🧮', color: 'from-amber-500 to-orange-600' },
  { id: 'memory', title: 'Memory Quiz', icon: '🧠', color: 'from-cyan-500 to-blue-600' },
  { id: 'listening', title: 'Listening Quiz', icon: '👂', color: 'from-pink-500 to-rose-600' },
];

export const QuizHub: React.FC<QuizHubProps> = ({
  progress,
  onUpdateProgress,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const startQuiz = (cat: QuizCategory) => {
    const qList = generateQuizQuestions(cat, 5);
    setQuestions(qList);
    setCurrentIdx(0);
    setCorrectCount(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setIsFinished(false);
    setSelectedCategory(cat);

    // If first question has audio, speak it
    if (qList[0]?.audioPrompt) {
      setTimeout(() => {
        audio.speak(qList[0].audioPrompt || '', progress.settings.voice);
      }, 400);
    }
  };

  const handleOptionClick = (option: { id: string; text: string; visual?: string; isCorrect: boolean }) => {
    if (selectedOptionId !== null) return; // Prevent double taps

    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      setFeedback('correct');
      audio.playCorrect(progress.settings.sound);
      setCorrectCount((prev) => prev + 1);

      // Trigger sparkles
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setTimeout(() => {
        advanceQuestion(true);
      }, 1300);
    } else {
      setFeedback('wrong');
      audio.playWrong(progress.settings.sound);
      audio.speak("Good try! Keep going!", progress.settings.voice);

      // Gentle pause then allow child to move on or try again
      setTimeout(() => {
        advanceQuestion(false);
      }, 1500);
    }
  };

  const advanceQuestion = (wasCorrect: boolean) => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentIdx(nextIdx);
      setSelectedOptionId(null);
      setFeedback(null);
      if (questions[nextIdx]?.audioPrompt) {
        audio.speak(questions[nextIdx].audioPrompt || '', progress.settings.voice);
      }
    } else {
      // Finished Quiz!
      setIsFinished(true);
      const finalCorrect = wasCorrect ? correctCount + 1 : correctCount;
      const starsEarned = finalCorrect;
      const coinsEarned = finalCorrect * 5;
      const xpEarned = 50 + (finalCorrect === questions.length ? 25 : 0);

      if (finalCorrect === questions.length) {
        audio.playGrandFanfare(progress.settings.sound);
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        } catch (e) {}
      } else {
        audio.playLevelComplete(progress.settings.sound);
      }

      // Update global progress
      const updated: GameProgress = {
        ...progress,
        stars: progress.stars + starsEarned,
        coins: progress.coins + coinsEarned,
        xp: progress.xp + xpEarned,
        score: progress.score + (finalCorrect * 15),
        quizCompletedCount: progress.quizCompletedCount + 1,
      };

      // Check level up threshold
      const nextLevelThreshold = updated.playerLevel * 300;
      if (updated.xp >= nextLevelThreshold && updated.playerLevel < 10) {
        updated.playerLevel += 1;
      }

      onUpdateProgress(updated);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #341f97 0%, #5f27cd 60%, #1e1045 100%)',
      }}
    >
      {/* Category Selection View */}
      {!selectedCategory ? (
        <>
          {/* Header */}
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
                <span>🧠</span>
                <span>QUIZ ZONE</span>
                <span>🧠</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-white/80">
                Choose a fun quiz to earn stars & coins!
              </p>
            </div>

            <div className="bg-amber-400 text-amber-950 font-black px-3.5 py-1.5 rounded-full border-2 border-white shadow text-sm">
              ⭐ {progress.stars}
            </div>
          </div>

          {/* Quiz Categories Grid */}
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 z-10 my-auto py-2">
            {QUIZ_CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => startQuiz(cat.id)}
                className={`p-4 rounded-3xl border-3 border-white bg-gradient-to-r ${cat.color} shadow-[0_6px_0_rgba(0,0,0,0.3)] flex items-center gap-4 text-left cursor-pointer`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/25 border-2 border-white/50 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-white text-lg drop-shadow">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-white/90 font-medium">5 Fun Questions</p>
                </div>
                <span className="text-xl">▶</span>
              </motion.button>
            ))}
          </div>
        </>
      ) : isFinished ? (
        /* Quiz Results Card */
        <div className="w-full max-w-md my-auto z-10 flex flex-col items-center text-center p-6 rounded-3xl bg-white/10 backdrop-blur-md border-4 border-amber-400 shadow-[0_12px_0_rgba(0,0,0,0.4)]">
          <span className="text-6xl mb-2 animate-bounce">
            {correctCount === questions.length ? '🌟' : '🎉'}
          </span>
          <h3 className="text-3xl font-black text-amber-300 drop-shadow">
            {correctCount === questions.length ? 'PERFECT SCORE!' : 'QUIZ COMPLETE! 🎉'}
          </h3>
          <p className="text-sm font-bold text-white/90 mt-1">
            You got <span className="text-amber-300 text-lg font-black">{correctCount}</span> of{' '}
            {questions.length} correct!
          </p>

          {/* Rewards Bento */}
          <div className="w-full grid grid-cols-3 gap-2 my-5">
            <div className="p-3 bg-amber-400/20 border-2 border-amber-400 rounded-2xl">
              <span className="text-2xl">⭐</span>
              <p className="text-xl font-black text-amber-300">+{correctCount}</p>
              <p className="text-[11px] font-bold text-amber-100">Stars</p>
            </div>
            <div className="p-3 bg-yellow-400/20 border-2 border-yellow-400 rounded-2xl">
              <span className="text-2xl">🪙</span>
              <p className="text-xl font-black text-yellow-300">+{correctCount * 5}</p>
              <p className="text-[11px] font-bold text-yellow-100">Coins</p>
            </div>
            <div className="p-3 bg-cyan-400/20 border-2 border-cyan-400 rounded-2xl">
              <span className="text-2xl">🏆</span>
              <p className="text-xl font-black text-cyan-300">+50</p>
              <p className="text-[11px] font-bold text-cyan-100">XP</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => startQuiz(selectedCategory)}
              className="w-full py-3.5 px-4 rounded-2xl btn-cartoon-green text-white font-black text-lg border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>PLAY AGAIN</span>
            </button>
            <button
              onClick={() => setSelectedCategory(null)}
              className="w-full py-3.5 px-4 rounded-2xl btn-cartoon-blue text-white font-black text-lg border-3 border-white tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>NEXT QUIZ 🧠</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Card */
        <div className="w-full max-w-md my-auto z-10 flex flex-col items-center">
          {/* Question Header & Progress Bar */}
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-white/70 hover:text-white"
            >
              ✕ Exit Quiz
            </button>
            <span className="text-sm font-black text-amber-300">
              QUESTION {currentIdx + 1} / {questions.length}
            </span>
          </div>

          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Display Card */}
          <div className="w-full p-6 rounded-3xl bg-white/10 backdrop-blur-md border-3 border-white/40 shadow-xl flex flex-col items-center text-center mb-5">
            {/* Visual Icon / Emoji */}
            {questions[currentIdx]?.displayVisual && (
              <div className="text-6xl mb-3 filter drop-shadow-md">
                {questions[currentIdx].displayVisual}
              </div>
            )}

            <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow mb-2 leading-snug">
              {questions[currentIdx]?.prompt}
            </h3>

            {/* Audio Listen Button */}
            {questions[currentIdx]?.audioPrompt && (
              <button
                onClick={() =>
                  audio.speak(questions[currentIdx]?.audioPrompt || '', progress.settings.voice)
                }
                className="mt-1 px-3.5 py-1.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center gap-1.5 shadow active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Sound</span>
              </button>
            )}
          </div>

          {/* Answer Options */}
          <div className="w-full flex flex-col gap-3">
            {questions[currentIdx]?.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  whileHover={selectedOptionId === null ? { scale: 1.02 } : {}}
                  whileTap={selectedOptionId === null ? { scale: 0.98 } : {}}
                  onClick={() => handleOptionClick(opt)}
                  disabled={selectedOptionId !== null}
                  className={`w-full p-4 rounded-2xl border-3 font-black text-lg sm:text-xl flex items-center justify-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-500 border-white text-white shadow-[0_6px_0_#1e824c]'
                        : 'bg-amber-500 border-white text-white shadow-[0_6px_0_#d35400]'
                      : 'bg-white text-slate-800 border-amber-400 shadow-[0_5px_0_#d98020]'
                  }`}
                >
                  {opt.visual && <span className="text-2xl">{opt.visual}</span>}
                  <span>{opt.text}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback Banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className={`mt-4 px-6 py-2 rounded-full font-black text-base shadow-lg ${
                  feedback === 'correct'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 text-amber-950'
                }`}
              >
                {feedback === 'correct' ? '🎉 CORRECT! GREAT JOB!' : '😊 GOOD TRY! KEEP GOING!'}
              </motion.div>
            )}
          </AnimatePresence>
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
