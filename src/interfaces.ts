export interface Guess {
  isActive: boolean;
  word: string;
  guessResults?: GuessMap;
}

export interface GuessMap {
  characterIndexInWord: number;
  characterValue: string;
}

export interface GameState {
  guesses: Guess[];
  wordOfTheDay: string;
  wordsArray?: string[];
  gameOver: boolean;
}
