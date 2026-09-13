import { GameProgress, DailyChallenge, WorldId } from '../types';

const STORAGE_KEY = 'SMASH_LEARN_PLAY_PROGRESS_V2';
const BACKUP_KEY = 'SMASH_LEARN_PLAY_PROGRESS_BACKUP';

export function getTodayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateDailyChallenge(dateKey = getTodayDateKey()): DailyChallenge {
  const pool: Omit<DailyChallenge, 'current' | 'claimed' | 'dateKey'>[] = [
    {
      id: 'daily_smash_3',
      title: 'Box Smasher',
      description: 'Smash 3 boxes today',
      icon: '🔨',
      reqType: 'smashes',
      target: 3,
      rewardType: 'coins',
      rewardAmount: 30,
    },
    {
      id: 'daily_quiz_1',
      title: 'Quiz Whiz',
      description: 'Complete 1 Quiz Zone challenge',
      icon: '🧠',
      reqType: 'quiz_completed',
      target: 1,
      rewardType: 'stars',
      rewardAmount: 10,
    },
    {
      id: 'daily_levels_2',
      title: 'Little Explorer',
      description: 'Complete 2 learning levels',
      icon: '🚀',
      reqType: 'levels_completed',
      target: 2,
      rewardType: 'xp',
      rewardAmount: 75,
    },
    {
      id: 'daily_stars_5',
      title: 'Star Catcher',
      description: 'Collect 5 stars today',
      icon: '⭐',
      reqType: 'stars_earned',
      target: 5,
      rewardType: 'coins',
      rewardAmount: 40,
    },
  ];

  // Pick deterministic challenge based on date hash
  const charCodeSum = dateKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const selected = pool[charCodeSum % pool.length];

  return {
    ...selected,
    current: 0,
    claimed: false,
    dateKey,
  };
}

export const DEFAULT_PROGRESS: GameProgress = {
  score: 0,
  stars: 0,
  coins: 0,
  xp: 0,
  playerLevel: 1,
  totalSmashes: 0,
  completedLetters: [],
  currentLetterIdx: 0,
  unlockedAchievements: [],
  unlockedWorlds: ['w1_alphabet', 'w2_letter_match', 'w3_word_match', 'w4_missing_letter', 'w5_find_object', 'w6_colors', 'w7_numbers', 'w8_math', 'w9_memory', 'w10_puzzle', 'w11_listening'],
  levelStars: {},
  masteredWords: [],
  quizCompletedCount: 0,
  miniGamesPlayedCount: 0,
  dailyChallenge: generateDailyChallenge(),
  activeBoxSkin: 'box_classic',
  activeBackground: 'bg_meadow',
  unlockedCosmetics: ['box_classic', 'bg_meadow'],
  settings: {
    sound: true,
    music: true,
    voice: true,
  },
};

export function loadProgress(): GameProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_KEY);
    if (!raw) return DEFAULT_PROGRESS;

    const parsed = JSON.parse(raw);
    const today = getTodayDateKey();

    // Check if daily challenge needs refresh
    let dailyChallenge = parsed.dailyChallenge;
    if (!dailyChallenge || dailyChallenge.dateKey !== today) {
      dailyChallenge = generateDailyChallenge(today);
    }

    const progress: GameProgress = {
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      stars: typeof parsed.stars === 'number' ? parsed.stars : 0,
      coins: typeof parsed.coins === 'number' ? parsed.coins : 0,
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      playerLevel: typeof parsed.playerLevel === 'number' ? parsed.playerLevel : 1,
      totalSmashes: typeof parsed.totalSmashes === 'number' ? parsed.totalSmashes : 0,
      completedLetters: Array.isArray(parsed.completedLetters) ? parsed.completedLetters : [],
      currentLetterIdx: typeof parsed.currentLetterIdx === 'number' ? Math.min(Math.max(parsed.currentLetterIdx, 0), 25) : 0,
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      unlockedWorlds: Array.isArray(parsed.unlockedWorlds) ? parsed.unlockedWorlds : DEFAULT_PROGRESS.unlockedWorlds,
      levelStars: parsed.levelStars && typeof parsed.levelStars === 'object' ? parsed.levelStars : {},
      masteredWords: Array.isArray(parsed.masteredWords) ? parsed.masteredWords : [],
      quizCompletedCount: typeof parsed.quizCompletedCount === 'number' ? parsed.quizCompletedCount : 0,
      miniGamesPlayedCount: typeof parsed.miniGamesPlayedCount === 'number' ? parsed.miniGamesPlayedCount : 0,
      dailyChallenge,
      activeBoxSkin: parsed.activeBoxSkin || 'box_classic',
      activeBackground: parsed.activeBackground || 'bg_meadow',
      unlockedCosmetics: Array.isArray(parsed.unlockedCosmetics) ? parsed.unlockedCosmetics : ['box_classic', 'bg_meadow'],
      settings: {
        sound: parsed.settings?.sound ?? true,
        music: parsed.settings?.music ?? true,
        voice: parsed.settings?.voice ?? true,
      },
    };

    return progress;
  } catch (err) {
    console.error('Failed to load game progress, safely recovering default state:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: GameProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(progress);
    localStorage.setItem(STORAGE_KEY, serialized);
    // Automatic safe backup mirror
    localStorage.setItem(BACKUP_KEY, serialized);
  } catch (err) {
    console.warn('Failed to save game progress:', err);
  }
}

export function resetProgress(): GameProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
  } catch (err) {
    console.warn('Error clearing progress:', err);
  }
  return {
    ...DEFAULT_PROGRESS,
    dailyChallenge: generateDailyChallenge(),
  };
}
