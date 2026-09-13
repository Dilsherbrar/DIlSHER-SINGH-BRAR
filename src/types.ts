export interface AlphabetItem {
  letter: string;
  word: string;
  emoji: string;
  themeColor: string;
  borderColor: string;
  funFact: string;
  category: 'fruit' | 'animal' | 'object' | 'nature' | 'food' | 'toy';
  phonics: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reqType: 'smashes' | 'score' | 'letters_completed' | 'all_completed' | 'quizzes' | 'mini_games' | 'level';
  reqValue: number;
}

export interface GameSettings {
  sound: boolean;
  music: boolean;
  voice: boolean;
}

export type WorldId =
  | 'w1_alphabet'
  | 'w2_letter_match'
  | 'w3_word_match'
  | 'w4_missing_letter'
  | 'w5_find_object'
  | 'w6_colors'
  | 'w7_numbers'
  | 'w8_math'
  | 'w9_memory'
  | 'w10_puzzle'
  | 'w11_listening';

export interface WorldInfo {
  id: WorldId;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  borderColor: string;
  requiredWorld?: WorldId;
  totalLevels: number;
}

export type QuizCategory =
  | 'alphabet'
  | 'words'
  | 'colors'
  | 'numbers'
  | 'math'
  | 'memory'
  | 'listening';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  prompt: string;
  subPrompt?: string;
  displayVisual?: string; // emoji or math formula or letter
  audioPrompt?: string;
  options: {
    id: string;
    text: string;
    visual?: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
}

export type MiniGameId =
  | 'fruit_catch'
  | 'balloon_pop'
  | 'letter_pop'
  | 'memory_flip'
  | 'target_letter';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  reqType: 'smashes' | 'quiz_completed' | 'levels_completed' | 'stars_earned';
  target: number;
  current: number;
  rewardType: 'coins' | 'stars' | 'xp';
  rewardAmount: number;
  claimed: boolean;
  dateKey: string; // e.g. "2026-09-13"
}

export interface CosmeticItem {
  id: string;
  name: string;
  category: 'box' | 'background' | 'particles';
  icon: string;
  unlocked: boolean;
  costCoins: number;
}

export interface GameProgress {
  score: number;
  stars: number;
  coins: number;
  xp: number;
  playerLevel: number;
  totalSmashes: number;
  completedLetters: string[];
  currentLetterIdx: number;
  unlockedAchievements: string[];
  unlockedWorlds: WorldId[];
  levelStars: Record<string, number>; // worldId_levelIdx -> 1..3
  masteredWords: string[];
  quizCompletedCount: number;
  miniGamesPlayedCount: number;
  dailyChallenge: DailyChallenge;
  activeBoxSkin: string;
  activeBackground: string;
  unlockedCosmetics: string[];
  settings: GameSettings;
}

export type GameScreen =
  | 'SPLASH'
  | 'MENU'
  | 'PLAY'
  | 'ALPHABET'
  | 'REWARDS'
  | 'LEARNING_MAP'
  | 'QUIZ_HUB'
  | 'MINI_GAMES'
  | 'WORLD_PRACTICE'
  | 'REVIEW';

export interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
  type: 'wood' | 'star' | 'confetti' | 'sparkle' | 'coin';
  shape?: 'circle' | 'square' | 'star' | 'chip';
}

export interface FloatingScoreText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  createdAt: number;
}
