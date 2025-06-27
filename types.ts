
export enum Operation {
  ADD = '足し算',
  SUBTRACT = '引き算',
  MULTIPLY = '掛け算',
  DIVIDE = '割り算',
}

export interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  operationSymbol: string;
  answer: number;
  questionText: string;
}

export type GamePhase = 'START' | 'PLAYING' | 'FEEDBACK' | 'LEVEL_UP';

export interface ThemeColors {
  bg: string;
  text: string;
  accent: string;
  button: string;
  buttonHover: string;
}
