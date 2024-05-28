import { GuessMap } from "./interfaces";
import { indices } from "./utils";

export default class GuessChecker {

  static checkGuess(guess: string, wordOfTheDay: string): GuessMap[] {
    const guessMap: GuessMap[] = [];
    const wordOfTheDayArr = wordOfTheDay.split("");

    guess.split("").forEach((character, idx, _) => {
      const indicesInWord = indices(wordOfTheDayArr, character);
      if (indices.length === 0) {
        guessMap.push({
          characterValue: character,
          characterIndicesInWord: indicesInWord,
          isLetterUsedInWord: "not-in-word",
        });
        return;
      }
      if (indicesInWord.includes(idx)) {
        guessMap.push({
          characterValue: character,
          characterIndicesInWord: indicesInWord,
          isLetterUsedInWord: "correct",
        });
        return;
      }
      if (!indicesInWord.includes(idx)) {
        guessMap.push({
          characterValue: character,
          characterIndicesInWord: indicesInWord,
          isLetterUsedInWord: "in-word",
        });
        return;
      }
    });
    return guessMap.map((x) => {
      const indicesInWord = indices(wordOfTheDayArr, x.characterValue);
      const indicesLeft = indicesInWord.filter(
        (idx) => guessMap[idx]?.isLetterUsedInWord !== "correct" ?? false
      );
      if (indicesLeft.length > 0) {
        return x;
      } else {
        return {
          ...x,
          isLetterUsedInWord:
            x.isLetterUsedInWord === "in-word"
              ? "not-in-word"
              : x.isLetterUsedInWord,
        };
      }
    });
  }
}
