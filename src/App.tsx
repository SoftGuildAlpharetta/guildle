import "./App.css";
import { useEffect, useState } from "react";
import {
  zeroTo,
  randomNumberInRange,
  todayKey,
  isEmptyObject,
  isEmpty,
} from "./utils";
import LetterRow from "./LetterRow";
import Keycap from "./Keycap";
import { WORD_LIST_URL, QWERTY_ARRAY } from "./constants";
import { GameState, Guess } from "./interfaces";

function App() {
  const getInitialWordleContext = () => {
    try {
      const wordleContext = JSON.parse(
        localStorage.getItem("wordleGameState")!
      );
      return wordleContext || {};
    } catch (ex) {
      return {};
    }
  };
  const getInitialGameState = () => {
    const wordleContext = getInitialWordleContext();
    if (!isEmptyObject(wordleContext[todayKey])) {
      return wordleContext[todayKey];
    }
    return {
      guesses: zeroTo(6).map((index) => ({
        isActive: index === 0,
        word: "",
      })),
      gameOver: false,
      wordOfTheDay: "",
    };
  };
  const [gameState, updateGameState] = useState<GameState>(getInitialGameState);
  const wordleContext: Record<string, any> = getInitialWordleContext();
  wordleContext[todayKey] = gameState;

  const setGuesses = (guesses: Guess[]) => {
    updateGameState({ ...gameState, guesses });
  };
  const setCurrentGuess = (newGuess: string) =>
    setGuesses(
      wordleContext[todayKey].guesses.map((guess: Guess) =>
        guess.isActive ? { ...guess, word: newGuess } : { ...guess }
      )
    );
  const setWordOfTheDay = (wordOfTheDay: string) =>
    isEmpty(gameState.wordOfTheDay)
      ? updateGameState({ ...gameState, wordOfTheDay })
      : gameState;
  const setWordsArray = (wordsArray: string[]) =>
    (wordleContext.wordsArray = wordsArray);

  const setGameOver = (gameOver: boolean) =>
    updateGameState({ ...gameState, gameOver });

  const handleKeyPush = (letter: string) => {
    const guess = wordleContext[todayKey].guesses.find(
      (guess: Guess) => guess.isActive
    ).word;
    const newGuess = guess + letter;
    setCurrentGuess(newGuess);
  };

  const handleBackspace = (_ev: KeyboardEvent | React.MouseEvent) => {
    const guess = wordleContext[todayKey].guesses.find(
      (x: Guess) => x.isActive
    ).word;
    const guessLength = guess.length;
    const newGuess = guess
      .split("")
      .slice(0, guessLength - 1)
      .join("");
    setCurrentGuess(newGuess);
  };

  useEffect(() => {
    // Just do it no matter what. Not worth fighting good caching.
    fetch(WORD_LIST_URL)
      .then((response) => response.text())
      .then((text) => {
        const wordsArr = text.split("\n");
        setWordsArray(wordsArr);
        const wordOfTheDay = wordsArr[randomNumberInRange(wordsArr.length)];
        setWordOfTheDay(wordOfTheDay);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const guessInput = (document.getElementById(
      "guess-input"
    ) as HTMLInputElement)!;
    const onLeavingInputHandler = (ev: FocusEvent) => {
      ev.preventDefault();
      guessInput.focus();
    };
    guessInput.onblur = onLeavingInputHandler;
    guessInput.onfocus = onLeavingInputHandler;
    guessInput.focus();
  });

  useEffect(() => {
    localStorage.setItem("wordleGameState", JSON.stringify(wordleContext));
  }, [wordleContext]);

  useEffect(() => {
    wordleContext[todayKey] = gameState;
  }, [gameState]);

  const checkGuess = () => {
    const isGameOver = wordleContext[todayKey].gameOver;
    if (!isGameOver) {
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
          // TODO: show popover, remove key events, remove styling from keycaps, set game over = true
          // alert("Correct!");
          setGameOver(true);
          document.onkeydown = null;
        }
        (document.getElementById("guess-input") as HTMLInputElement)!.value =
          "";
      } else {
        shakeCurrentRow();
      }
    }
  };

  const checkWordInWordList = (guessValue: string) =>
    wordleContext.wordsArray.indexOf(guessValue) !== -1;

  const shakeCurrentRow = () => {};

  const keyHandler = (ev: KeyboardEvent) => {
    if (ev instanceof KeyboardEvent) {
      switch (ev.code) {
        case "Enter":
          checkGuess();
          break;
        case "Backspace":
          handleBackspace(ev);
          break;
        default:
          if (QWERTY_ARRAY.includes(ev.key)) {
            handleKeyPush(ev.key);
          } else {
            console.warn("Nothing to do here!");
          }
          break;
      }
    } else {
    }
  };

  if (!gameState.gameOver) {
    document.onkeydown = keyHandler;
  }

  return (
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
            <div onClick={handleBackspace} className="keycap-wide">
              <i className="bx bxs-chevrons-left"></i>
            </div>
          </div>
        </div>
        <div>
          <div id="guess-input-hider">
            <input
              id="guess-input"
              maxLength={5}
              value={
                wordleContext[todayKey].guesses.filter(
                  (guess: Guess) => guess.isActive
                ).word
              }
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
