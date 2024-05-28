export interface Guess {
  isActive: boolean;
  word: string;
  guessResults?: GuessMap[];
  isGuessProcessing?: boolean;
  isGuessNotInWordList?: boolean;
}

export interface GuessMap {
  characterIndicesInWord: number[];
  characterValue: string;
  isLetterUsedInWord?: LetterUsedIndicator;
}

export interface GameState {
  guesses: Guess[];
  wordOfTheDay: string;
  wordsArray?: string[];
  gameOver: boolean;
  lettersUsedAlready: Record<string, LetterUsedIndicator>;
}

export type LetterUsedIndicator =
  | "correct"
  | "in-word"
  | "not-in-word"
  | "not-guessed-yet";
