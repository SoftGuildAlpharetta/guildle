import "./App.css";
import { createContext, useContext, useEffect, useState } from "react";
import { zeroTo, randomNumberInRange, todayKey } from "./utils";
import LetterRow from "./LetterRow";
import Keycap from "./Keycap";
import { WORD_LIST_URL, QWERTY_ARRAY } from "./constants";
import { GameState, Guess } from "./interfaces";

function App() {
  const [gameState, updateGameState] = useState<GameState>({
    guesses: zeroTo(6).map((index) => ({
      isActive: index === 0,
      word: "",
    })),
    wordOfTheDay: "",
  });
  const contextObj: Record<string, any> = {};
  contextObj[todayKey] = gameState;
  contextObj.wordsArray = [];
  const WordleContext = createContext(contextObj);
  const wordleContext = useContext(WordleContext);

  function WordleContextProvider({ children }: { children: any }) {
    return (
      <WordleContext.Provider value={{}}>{children}</WordleContext.Provider>
    );
  }
  const setGuesses = (guesses: Guess[]) => {
    console.log(guesses);
    updateGameState({ ...gameState, guesses });
  };
  const setCurrentGuess = (newGuess: string) =>
    setGuesses(
      wordleContext[todayKey].guesses.map((guess: Guess) =>
        guess.isActive ? { ...guess, word: newGuess } : { ...guess }
      )
    );
  const setWordOfTheDay = (wordOfTheDay: string) =>
    updateGameState({ ...gameState, wordOfTheDay });
  const setWordsArray = (wordsArray: string[]) =>
    updateGameState({ ...gameState, wordsArray });

  const handleKeyPush = (letter: string) => {
    const guess = wordleContext[todayKey].guesses.find(
      (guess: Guess) => guess.isActive
    ).word;
    const newGuess = guess + letter;
    setCurrentGuess(newGuess);
  };

  useEffect(() => {
    const guessInput = document.getElementById("guess-input")!;

    if (wordleContext.wordsArray.length === 0) {
      fetch(WORD_LIST_URL)
        .then((response) => response.text())
        .then((text) => {
          const wordsArr = text.split("\n");
          setWordsArray(wordsArr);
          const wordOfTheDay = wordsArr[randomNumberInRange(wordsArr.length)];
          setWordOfTheDay(wordOfTheDay);
        })
        .catch((err) => console.error(err));
    }
    guessInput.onblur = (ev) => {
      ev.preventDefault();
      guessInput.focus();
      console.log("failed to focus!");
    };
    guessInput.focus();
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem("wordleGameState", JSON.stringify(wordleContext));
  }, [wordleContext]);

  const checkGuess = (event: React.FormEvent) => {
    event.preventDefault();
    const guessValue = wordleContext[todayKey].guesses.find(
      (guess: Guess) => guess.isActive
    ).word;
    let isActiveIndex = wordleContext[todayKey].guesses.findIndex(
      (guess: Guess) => guess.isActive
    );
    const guessResults = guessValue.split("").map((character: string) => {
      const characterIndexInWord =
        wordleContext[todayKey].wordOfTheDay.indexOf(character);
      return { characterIndexInWord, characterValue: character };
    });
    if (guessValue.length === 5 && checkWordInWordList(guessValue)) {
      setGuesses(
        wordleContext[todayKey].guesses.map(
          (val: Guess, idx: number, _arr: Guess[]) => {
            console.log("today");
            if (idx === isActiveIndex) {
              val.isActive = false;
              val.guessResults = guessResults;
            }
            if (idx === isActiveIndex + 1) {
              val.isActive = true;
            }
            return val;
          }
        )
      );
      if (wordleContext[todayKey].wordOfTheDay === guessValue) {
        alert("Correct!");
      }
      (document.getElementById("guess-input") as HTMLInputElement)!.value = "";
    } else {
      shakeCurrentRow();
    }
  };

  const checkWordInWordList = (guessValue: string) =>
    wordleContext.wordsArray.indexOf(guessValue) !== -1;

  const shakeCurrentRow = () => {};

  return (
    <WordleContextProvider>
      <div className="App">
        <header id="app-nav">
          <div id="app-hamburger">
            <i className="bx bx-menu"></i>
          </div>
          <div id="app-title">Guildle</div>
          <div id="app-options">
            <i className="bx bx-help-circle"></i>
            <i className="bx bx-bar-chart-alt-2"></i>
            <i className="bx bx-cog"></i>
          </div>
        </header>
        <div className="flex-container">
          <div className="board-container">
            {zeroTo(6).map((index) => (
              <LetterRow
                key={"letterRow" + index}
                guessInfo={wordleContext[todayKey].guesses[index]}
              />
            ))}
          </div>
          <div className="keyboard-container">
            <div className="keyboard-row">
              {zeroTo(10).map((index) => {
                const firstTen = QWERTY_ARRAY.slice(0, 10);
                return (
                  <Keycap
                    key={"keycap-" + firstTen[index]}
                    keyPushed={handleKeyPush}
                    keyLetter={firstTen[index]}
                  />
                );
              })}
            </div>
            <div className="keyboard-row">
              <div className="spacer"></div>
              {zeroTo(9).map((index) => {
                const secondNine = QWERTY_ARRAY.slice(10, 19);
                return (
                  <Keycap
                    key={"keycap-" + secondNine[index]}
                    keyPushed={handleKeyPush}
                    keyLetter={secondNine[index]}
                  />
                );
              })}
              <div className="spacer"></div>
            </div>
            <div className="keyboard-row">
              <div className="keycap-wide" onClick={checkGuess}>
                Enter
              </div>
              {zeroTo(7).map((index) => {
                const thirdTen = QWERTY_ARRAY.slice(19, 26);
                return (
                  <Keycap
                    key={"keycap-" + thirdTen[index]}
                    keyPushed={handleKeyPush}
                    keyLetter={thirdTen[index]}
                  />
                );
              })}
              <div
                onClick={(_ev) => {
                  const guess = wordleContext[todayKey].guesses.find(
                    (x: Guess) => x.isActive
                  ).word;
                  const guessLength = guess.length;
                  const newGuess = guess
                    .split("")
                    .slice(0, guessLength - 1)
                    .join("");
                  setCurrentGuess(newGuess);
                }}
                className="keycap-wide"
              >
                <i className="bx bxs-chevrons-left"></i>
              </div>
            </div>
          </div>
          <div>
            <form id="hidden-form" onSubmit={checkGuess}>
              <div id="guess-input-hider">
                <input
                  id="guess-input"
                  maxLength={5}
                  onChange={(event) => setCurrentGuess(event.target.value)}
                  value={
                    wordleContext[todayKey].guesses.filter(
                      (guess: Guess) => guess.isActive
                    ).word
                  }
                ></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    </WordleContextProvider>
  );
}

export default App;
