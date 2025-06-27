
import { ThemeColors } from './types';

export const PROBLEMS_PER_LEVEL = 5;
export const INITIAL_LEVEL = 1;
export const INITIAL_SCORE = 0;
export const INITIAL_STREAK = 0;
export const MAX_LEVELS = 5; // Example max levels

export const LEVEL_THEMES: Record<number, ThemeColors> = {
  1: { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'border-blue-500', button: 'bg-blue-500', buttonHover: 'hover:bg-blue-600' },
  2: { bg: 'bg-green-100', text: 'text-green-800', accent: 'border-green-500', button: 'bg-green-500', buttonHover: 'hover:bg-green-600' },
  3: { bg: 'bg-purple-100', text: 'text-purple-800', accent: 'border-purple-500', button: 'bg-purple-500', buttonHover: 'hover:bg-purple-600' },
  4: { bg: 'bg-pink-100', text: 'text-pink-800', accent: 'border-pink-500', button: 'bg-pink-500', buttonHover: 'hover:bg-pink-600' },
  5: { bg: 'bg-orange-100', text: 'text-orange-800', accent: 'border-orange-500', button: 'bg-orange-500', buttonHover: 'hover:bg-orange-600' },
};

export const CHARACTER_IMAGES: Record<number, string> = {
  1: 'panda',
  2: 'koala',
  3: 'sloth',
  4: 'bear',
  5: 'lion',
};

// Returns a random integer between min (inclusive) and max (inclusive)
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
