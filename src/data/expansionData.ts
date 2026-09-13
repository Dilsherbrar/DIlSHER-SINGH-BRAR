import { WorldInfo, QuizQuestion, QuizCategory, CosmeticItem } from '../types';
import { ALPHABET_DATA } from './alphabetData';

export const WORLDS_DATA: WorldInfo[] = [
  {
    id: 'w1_alphabet',
    number: 1,
    title: 'Alphabet Adventure',
    subtitle: 'Smash boxes & discover A–Z',
    icon: '🔤',
    color: '#ff6b6b',
    borderColor: '#ee5253',
    totalLevels: 6,
  },
  {
    id: 'w2_letter_match',
    number: 2,
    title: 'Letter Matching',
    subtitle: 'Match objects to their first letter',
    icon: '🎯',
    color: '#48dbfb',
    borderColor: '#0abde3',
    requiredWorld: 'w1_alphabet',
    totalLevels: 6,
  },
  {
    id: 'w3_word_match',
    number: 3,
    title: 'Word Matching',
    subtitle: 'Find the matching word for each picture',
    icon: '🧩',
    color: '#1dd1a1',
    borderColor: '#10ac84',
    requiredWorld: 'w2_letter_match',
    totalLevels: 5,
  },
  {
    id: 'w4_missing_letter',
    number: 4,
    title: 'Missing Letter',
    subtitle: 'Fill in the blanks to complete words',
    icon: '✏️',
    color: '#feca57',
    borderColor: '#ff9f43',
    requiredWorld: 'w3_word_match',
    totalLevels: 5,
  },
  {
    id: 'w5_find_object',
    number: 5,
    title: 'Tap The Object',
    subtitle: 'Look at the letter and tap its object',
    icon: '🍎',
    color: '#ff9ff3',
    borderColor: '#f368e0',
    requiredWorld: 'w4_missing_letter',
    totalLevels: 5,
  },
  {
    id: 'w6_colors',
    number: 6,
    title: 'Colour & Learn',
    subtitle: 'Explore bright & beautiful colours',
    icon: '🎨',
    color: '#54a0ff',
    borderColor: '#2e86de',
    requiredWorld: 'w5_find_object',
    totalLevels: 5,
  },
  {
    id: 'w7_numbers',
    number: 7,
    title: 'Numbers & Counting',
    subtitle: 'Smash and count 1 to 20 objects',
    icon: '🔢',
    color: '#5f27cd',
    borderColor: '#341f97',
    requiredWorld: 'w6_colors',
    totalLevels: 6,
  },
  {
    id: 'w8_math',
    number: 8,
    title: 'Simple Math',
    subtitle: 'Fun addition and counting games',
    icon: '➕',
    color: '#ff9f43',
    borderColor: '#ee5253',
    requiredWorld: 'w7_numbers',
    totalLevels: 5,
  },
  {
    id: 'w9_memory',
    number: 9,
    title: 'Memory Match',
    subtitle: 'Flip and match magical picture cards',
    icon: '🧠',
    color: '#00d2d3',
    borderColor: '#01a3a4',
    requiredWorld: 'w8_math',
    totalLevels: 4,
  },
  {
    id: 'w10_puzzle',
    number: 10,
    title: 'Puzzle Builder',
    subtitle: 'Assemble cute educational puzzles',
    icon: '🧱',
    color: '#ff6b81',
    borderColor: '#c44569',
    requiredWorld: 'w9_memory',
    totalLevels: 4,
  },
  {
    id: 'w11_listening',
    number: 11,
    title: 'Sound & Phonics',
    subtitle: 'Listen carefully to match the letters',
    icon: '🎵',
    color: '#a55eea',
    borderColor: '#8854d0',
    requiredWorld: 'w10_puzzle',
    totalLevels: 5,
  },
];

export const PLAYER_LEVELS = [
  { level: 1, title: 'Beginner', minXp: 0, badge: '🌱' },
  { level: 2, title: 'Little Learner', minXp: 150, badge: '⭐' },
  { level: 3, title: 'Smart Explorer', minXp: 350, badge: '🧭' },
  { level: 4, title: 'Alphabet Hero', minXp: 600, badge: '🔤' },
  { level: 5, title: 'Learning Star', minXp: 950, badge: '🌟' },
  { level: 6, title: 'Quiz Master', minXp: 1400, badge: '🧠' },
  { level: 7, title: 'Super Learner', minXp: 2000, badge: '🚀' },
  { level: 8, title: 'Knowledge Hero', minXp: 2800, badge: '🏅' },
  { level: 9, title: 'Learning Champion', minXp: 3800, badge: '🏆' },
  { level: 10, title: 'Alphabet Master', minXp: 5000, badge: '👑' },
];

export const COLORS_DATA = [
  { name: 'Red', hex: '#ff4757', emoji: '🍎', sampleItem: 'Red Apple' },
  { name: 'Blue', hex: '#1e90ff', emoji: '🚗', sampleItem: 'Blue Car' },
  { name: 'Green', hex: '#2ed573', emoji: '⚽', sampleItem: 'Green Ball' },
  { name: 'Yellow', hex: '#fed330', emoji: '☀️', sampleItem: 'Yellow Sun' },
  { name: 'Orange', hex: '#ff793f', emoji: '🍊', sampleItem: 'Orange Fruit' },
  { name: 'Purple', hex: '#9b59b6', emoji: '🍇', sampleItem: 'Purple Grapes' },
];

export const NUMBERS_DATA = [
  { num: 1, word: 'One', emoji: '⭐', visual: '⭐' },
  { num: 2, word: 'Two', emoji: '🍎', visual: '🍎 🍎' },
  { num: 3, word: 'Three', emoji: '⚽', visual: '⚽ ⚽ ⚽' },
  { num: 4, word: 'Four', emoji: '🚗', visual: '🚗 🚗 🚗 🚗' },
  { num: 5, word: 'Five', emoji: '🐶', visual: '🐶 🐶 🐶 🐶 🐶' },
  { num: 6, word: 'Six', emoji: '🎈', visual: '🎈 🎈 🎈 🎈 🎈 🎈' },
  { num: 7, word: 'Seven', emoji: '🍇', visual: '🍇 🍇 🍇 🍇 🍇 🍇 🍇' },
  { num: 8, word: 'Eight', emoji: '🍦', visual: '🍦 🍦 🍦 🍦 🍦 🍦 🍦 🍦' },
  { num: 9, word: 'Nine', emoji: '🥭', visual: '🥭 🥭 🥭 🥭 🥭 🥭 🥭 🥭 🥭' },
  { num: 10, word: 'Ten', emoji: '🌟', visual: '🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟' },
];

export const COSMETICS_CATALOG: CosmeticItem[] = [
  { id: 'box_classic', name: 'Classic Wooden Box', category: 'box', icon: '📦', unlocked: true, costCoins: 0 },
  { id: 'box_golden', name: 'Golden Treasure Box', category: 'box', icon: '✨', unlocked: false, costCoins: 100 },
  { id: 'box_toy', name: 'Colourful Toy Box', category: 'box', icon: '🎁', unlocked: false, costCoins: 150 },
  { id: 'box_cosmic', name: 'Cosmic Star Box', category: 'box', icon: '🌌', unlocked: false, costCoins: 250 },
  { id: 'bg_meadow', name: 'Sunny Meadow', category: 'background', icon: '🌼', unlocked: true, costCoins: 0 },
  { id: 'bg_space', name: 'Starry Sky', category: 'background', icon: '🚀', unlocked: false, costCoins: 120 },
  { id: 'bg_candy', name: 'Candy Land', category: 'background', icon: '🍭', unlocked: false, costCoins: 180 },
];

export const MASCOT_QUOTES = [
  "Hi! I'm Barnaby Bear 🐻! Let's learn together!",
  "Smash the box to see what's hiding inside! 🔨",
  "You are doing fantastic! Keep going! ⭐",
  "Learning is like an adventure! 🚀",
  "Wow! You are super smart! 💡",
  "Let's practice our alphabet letters! 🔤",
  "You're a superstar! ⭐",
];

// Generates dynamic question sets for each of the 7 quiz categories
export function generateQuizQuestions(category: QuizCategory, count = 5): QuizQuestion[] {
  const list: QuizQuestion[] = [];

  if (category === 'alphabet') {
    const shuffled = [...ALPHABET_DATA].sort(() => 0.5 - Math.random()).slice(0, count);
    shuffled.forEach((item, idx) => {
      const distractors = ALPHABET_DATA.filter((a) => a.letter !== item.letter)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const options = [
        { id: '1', text: item.letter, visual: item.emoji, isCorrect: true },
        { id: '2', text: distractors[0].letter, visual: distractors[0].emoji, isCorrect: false },
        { id: '3', text: distractors[1].letter, visual: distractors[1].emoji, isCorrect: false },
      ].sort(() => 0.5 - Math.random());

      list.push({
        id: `q_alpha_${idx}`,
        category: 'alphabet',
        prompt: `Which letter starts ${item.word}?`,
        displayVisual: item.emoji,
        audioPrompt: `${item.letter} for ${item.word}`,
        options,
      });
    });
  } else if (category === 'words') {
    const shuffled = [...ALPHABET_DATA].sort(() => 0.5 - Math.random()).slice(0, count);
    shuffled.forEach((item, idx) => {
      const distractors = ALPHABET_DATA.filter((a) => a.word !== item.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const options = [
        { id: '1', text: item.word, isCorrect: true },
        { id: '2', text: distractors[0].word, isCorrect: false },
        { id: '3', text: distractors[1].word, isCorrect: false },
      ].sort(() => 0.5 - Math.random());

      list.push({
        id: `q_word_${idx}`,
        category: 'words',
        prompt: `What is this object?`,
        displayVisual: item.emoji,
        audioPrompt: item.word,
        options,
      });
    });
  } else if (category === 'colors') {
    COLORS_DATA.slice(0, count).forEach((col, idx) => {
      const others = COLORS_DATA.filter((c) => c.name !== col.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const options = [
        { id: '1', text: col.name, visual: col.emoji, isCorrect: true },
        { id: '2', text: others[0].name, visual: others[0].emoji, isCorrect: false },
        { id: '3', text: others[1].name, visual: others[1].emoji, isCorrect: false },
      ].sort(() => 0.5 - Math.random());

      list.push({
        id: `q_col_${idx}`,
        category: 'colors',
        prompt: `What colour is the ${col.sampleItem}?`,
        displayVisual: col.emoji,
        audioPrompt: col.name,
        options,
      });
    });
  } else if (category === 'numbers') {
    NUMBERS_DATA.slice(0, count).forEach((n, idx) => {
      const distractors = [n.num + 1, Math.max(1, n.num - 1), n.num + 2].filter((x) => x !== n.num).slice(0, 2);
      const options = [
        { id: '1', text: `${n.num} (${n.word})`, isCorrect: true },
        { id: '2', text: `${distractors[0]}`, isCorrect: false },
        { id: '3', text: `${distractors[1]}`, isCorrect: false },
      ].sort(() => 0.5 - Math.random());

      list.push({
        id: `q_num_${idx}`,
        category: 'numbers',
        prompt: `How many are there?`,
        displayVisual: n.visual,
        audioPrompt: `${n.num}`,
        options,
      });
    });
  } else if (category === 'math') {
    const mathProblems = [
      { p: '🍎 + 🍎 = ?', ans: '2', opt: ['2', '3', '1'], visual: '🍎 + 🍎' },
      { p: '⭐⭐ + ⭐ = ?', ans: '3', opt: ['3', '2', '4'], visual: '⭐⭐ + ⭐' },
      { p: '🚗🚗 + 🚗🚗 = ?', ans: '4', opt: ['4', '3', '5'], visual: '🚗🚗 + 🚗🚗' },
      { p: '⭐⭐⭐ take away ⭐ = ?', ans: '2', opt: ['2', '1', '3'], visual: '⭐⭐⭐ - ⭐' },
      { p: '🐶 + 🐶🐶 = ?', ans: '3', opt: ['3', '4', '2'], visual: '🐶 + 🐶🐶' },
    ];
    mathProblems.slice(0, count).forEach((mp, idx) => {
      const options = mp.opt.map((o) => ({
        id: o,
        text: o,
        isCorrect: o === mp.ans,
      }));
      list.push({
        id: `q_math_${idx}`,
        category: 'math',
        prompt: mp.p,
        displayVisual: mp.visual,
        audioPrompt: `Solve the problem: ${mp.ans}`,
        options,
      });
    });
  } else if (category === 'listening') {
    const shuffled = [...ALPHABET_DATA].sort(() => 0.5 - Math.random()).slice(0, count);
    shuffled.forEach((item, idx) => {
      const distractors = ALPHABET_DATA.filter((a) => a.letter !== item.letter)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const options = [
        { id: '1', text: item.word, visual: item.emoji, isCorrect: true },
        { id: '2', text: distractors[0].word, visual: distractors[0].emoji, isCorrect: false },
        { id: '3', text: distractors[1].word, visual: distractors[1].emoji, isCorrect: false },
      ].sort(() => 0.5 - Math.random());

      list.push({
        id: `q_listen_${idx}`,
        category: 'listening',
        prompt: `Listen to the letter! Which object starts with it?`,
        displayVisual: '🔊 Tap to Listen',
        audioPrompt: item.letter,
        options,
      });
    });
  } else {
    // Memory quiz
    const shuffled = [...ALPHABET_DATA].sort(() => 0.5 - Math.random()).slice(0, count);
    shuffled.forEach((item, idx) => {
      const options = [
        { id: '1', text: `${item.letter} for ${item.word}`, visual: item.emoji, isCorrect: true },
        { id: '2', text: `Z for Zebra`, visual: '🦓', isCorrect: false },
        { id: '3', text: `B for Ball`, visual: '⚽', isCorrect: false },
      ].sort(() => 0.5 - Math.random());

      list.push({
        id: `q_mem_${idx}`,
        category: 'memory',
        prompt: `Which pair matches correctly?`,
        displayVisual: item.emoji,
        options,
      });
    });
  }

  return list;
}
