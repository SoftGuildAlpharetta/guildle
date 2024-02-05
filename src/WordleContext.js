import { createContext } from "react";
import { zeroTo, todayKey } from "./utils";
const initialGameState = {
  guesses: zeroTo(6).map((index) => ({
    isActive: index === 0,
    word: '',
  })),
  wordOfTheDay: '',
};
const contextObj = {};
contextObj[todayKey] = initialGameState;
contextObj.wordsArray = [];
export const WordleContext = createContext(contextObj);

export const WordleContextProvider = ({ children }) =>
(
  <WordleContext.Provider value={{ initialGameState }}>{children}</WordleContext.Provider>
);