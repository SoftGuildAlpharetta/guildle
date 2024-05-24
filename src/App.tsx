// TODO: Break this component down into smaller components.
import "./App.css";
import { MouseEventHandler, useEffect, useState } from "react";
import {
  zeroTo,
  randomNumberInRangeForDate,
  todayKey,
  isEmptyObject,
  isEmpty,
  mobileAndTabletCheck,
  randomNumberInRange,
} from "./utils";
import LetterRow from "./LetterRow";
import Keycap from "./Keycap";
import { WORD_LIST_URL, QWERTY_ARRAY } from "./constants";
import { GameState, Guess, GuessMap, LetterUsedIndicator } from "./interfaces";

const getRandomSuccessWord = () => {
  const successWords: string[] = [
    "Awesome",
    "Great",
    "Correct",
    "Hooray",
    "Fantastic",
    "Excellent",
    "Bravo",
    "Well done",
    "Nice",
    "Superb",
    "Wonderful",
    "Yay",
    "Right",
    "Perfect",
    "Good job",
    "Splendid",
    "Magnificent",
    "Outstanding",
    "Impressive",
    "Kudos",
  ];
  return `${successWords[randomNumberInRange(successWords.length)]}!`;
};

const successWord = getRandomSuccessWord();

function App() {
  const getInitialGuildleContext = () => {
    try {
      const guildleContext = JSON.parse(
        localStorage.getItem("guildleGameState")!
      );
      return guildleContext || {};
    } catch (ex) {
      return {};
    }
  };
  const getInitialGameState = () => {
    const guildleContext = getInitialGuildleContext();
    if (!isEmptyObject(guildleContext[todayKey])) {
      return guildleContext[todayKey];
    }
    return {
      guesses: zeroTo(6).map((index) => ({
        isActive: index === 0,
        word: "",
      })),
      gameOver: false,
      wordOfTheDay: "",
      lettersUsedAlready: {},
    };
  };
  const getWordsArray = (): string[] => {
    try {
      const guildWordsArray = JSON.parse(
        localStorage.getItem("guildleWordsArray")!
      );
      return guildWordsArray || [];
    } catch (ex) {
      return [];
    }
  };

  const [gameState, updateGameState] = useState<GameState>(getInitialGameState);
  const guildleContext: Record<string, any> = getInitialGuildleContext();
  const [wordsArray, setWordsArray] = useState(getWordsArray);
  guildleContext[todayKey] = gameState;

  const setGuesses = (guesses: Guess[]) => {
    updateGameState({ ...gameState, guesses });
  };
  const setCurrentGuess = (newGuess: string) =>
    setGuesses(
      guildleContext[todayKey].guesses.map((guess: Guess) =>
        guess.isActive ? { ...guess, word: newGuess } : { ...guess }
      )
    );
  const toggleShakeRowOn = () => {
    setGuesses(
      guildleContext[todayKey].guesses.map((guess: Guess) =>
        guess.isActive ? { ...guess, isGuessNotInWordList: true } : { ...guess }
      )
    );
  };
  const toggleShakeRowOff = () => {
    setGuesses(
      guildleContext[todayKey].guesses.map((guess: Guess) =>
        guess.isActive
          ? { ...guess, isGuessNotInWordList: false }
          : { ...guess }
      )
    );
  };
  const setWordOfTheDay = (wordOfTheDay: string) =>
    isEmpty(gameState.wordOfTheDay)
      ? updateGameState({ ...gameState, wordOfTheDay })
      : gameState;

  const setIsGuessProcessing = (
    gameState: GameState,
    isGuessProcessing: boolean
  ) =>
    updateGameState({
      ...gameState,
      guesses: gameState.guesses.map((guess: Guess) =>
        guess.isActive ? { ...guess, isGuessProcessing } : guess
      ),
    });

  const setGameOver = (gameOver: boolean) =>
    updateGameState({ ...gameState, gameOver });

  const handleKeyPush = (letter: string) => {
    const guess = guildleContext[todayKey].guesses.find(
      (guess: Guess) => guess.isActive
    ).word;
    const newGuess = guess + letter;
    setCurrentGuess(newGuess);
  };

  const handleBackspace = (_ev: KeyboardEvent | React.MouseEvent) => {
    const guess = guildleContext[todayKey].guesses.find(
      (x: Guess) => x.isActive
    ).word;
    const guessLength = guess.length;
    const newGuess = guess
      .split("")
      .slice(0, guessLength - 1)
      .join("");
    setCurrentGuess(newGuess);
  };

  const getLetterUsedIndicator: (
    wordOfTheDay: string,
    characterGuess: string,
    characterIndex: number
  ) => LetterUsedIndicator = (wordOfTheDay, characterGuess, characterIndex) =>
    wordOfTheDay.charAt(characterIndex) === characterGuess
      ? "correct"
      : wordOfTheDay.indexOf(characterGuess) !== -1
      ? "in-word"
      : "not-in-word";

  useEffect(() => {
    const localWordsArray = getWordsArray();
    if (isEmpty(localWordsArray)) {
      fetch(WORD_LIST_URL)
        .then((response) => response.text())
        .then((text) => {
          const wordsArr = text.split("\n");
          setWordsArray(wordsArr);
          const wordOfTheDay =
            wordsArr[randomNumberInRangeForDate(wordsArr.length)];
          setWordOfTheDay(wordOfTheDay);
        })
        .catch((err) => console.error(err));
    } else {
      const wordOfTheDay =
        localWordsArray[randomNumberInRangeForDate(localWordsArray.length)];
      setWordOfTheDay(wordOfTheDay);
    }
    if (
      !guildleContext[todayKey].guesses
        .map((x: { isActive: any }) => x.isActive)
        .find((x: boolean) => x === true)
    ) {
      setGameOver(true);
    }
    if (gameState.gameOver) {
      showToast("game-over");
    }
  }, []);

  useEffect(() => {
    if (!mobileAndTabletCheck()) {
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
    }
  });

  useEffect(() => {
    localStorage.setItem("guildleGameState", JSON.stringify(guildleContext));
  }, [guildleContext]);

  useEffect(() => {
    localStorage.setItem("guildleWordsArray", JSON.stringify(wordsArray));
  }, [wordsArray]);

  useEffect(() => {
    guildleContext[todayKey] = gameState;
  }, [gameState]);

  const checkGuess = () => {
    const isGameOver = guildleContext[todayKey].gameOver;
    if (!isGameOver) {
      const guessValue = guildleContext[todayKey].guesses.find(
        (guess: Guess) => guess.isActive
      ).word;
      let isActiveIndex = guildleContext[todayKey].guesses.findIndex(
        (guess: Guess) => guess.isActive
      );
      const guessResults = guessValue
        .split("")
        .map((character: string, index: number, arr: string[]) => {
          const characterIndexInWord =
            arr[index] === guildleContext[todayKey].wordOfTheDay.charAt(index)
              ? index
              : guildleContext[todayKey].wordOfTheDay.indexOf(character);
          return {
            characterIndexInWord,
            characterValue: character,
            isLetterUsedInWord: getLetterUsedIndicator(
              guildleContext[todayKey].wordOfTheDay,
              character,
              index
            ),
          } as GuessMap;
        });
      if (guessValue.length === 5 && checkWordInWordList(guessValue)) {
        const newGameState = {
          ...gameState,
          lettersUsedAlready: Object.assign(
            { ...gameState.lettersUsedAlready },
            guessResults.reduce(
              (
                accumulator: Record<string, LetterUsedIndicator>,
                currentValue: GuessMap
              ) => {
                accumulator[currentValue.characterValue] =
                  currentValue.isLetterUsedInWord!;
                return accumulator;
              },
              {}
            )
          ),
          guesses: guildleContext[todayKey].guesses.map(
            (val: Guess, idx: number, _arr: Guess[]) => {
              if (idx === isActiveIndex) {
                val.isActive = false;
                val.guessResults = guessResults;
                val.isGuessProcessing = true;
              }
              if (idx === isActiveIndex + 1) {
                val.isActive = true;
              }
              return val;
            }
          ),
        };
        updateGameState(newGameState);
        setTimeout(() => setIsGuessProcessing(newGameState, false), 1500);
        if (guildleContext[todayKey].wordOfTheDay === guessValue) {
          showToast("success");
          setTimeout(() => hideToast("success"), 2000);
          setGameOver(true);
          document.onkeydown = null;
        }
        if (
          !guildleContext[todayKey].guesses
            .map((x: { isActive: any }) => x.isActive)
            .find((x: boolean) => x === true)
        ) {
          showToast("game-over");
          setGameOver(true);
        }
        if (!mobileAndTabletCheck()) {
          (document.getElementById("guess-input") as HTMLInputElement).value =
            "";
        }
      } else {
        shakeCurrentRow(
          guessValue.length === 5 ? "not-in-list" : "not-enough-letters"
        );
      }
    }
  };

  const checkWordInWordList = (guessValue: string) =>
    wordsArray.indexOf(guessValue) !== -1;

  const shakeCurrentRow = (toastId: string) => {
    showToast(toastId);
    toggleShakeRowOn();
    setTimeout(() => {
      toggleShakeRowOff();
      hideToast(toastId);
    }, 1000);
  };

  const showToast = (toastId: string) => {
    const el = document.getElementById(toastId)!;
    el.setAttribute("style", "opacity: 100%;");
  };
  const hideToast = (toastId: string) => {
    const el = document.getElementById(toastId)!;
    el.setAttribute("style", "");
  };

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

  const toggleHamburgerModal = (ev: React.MouseEvent<HTMLDivElement>) => {
    const burgerModal = document.getElementById("hamburger-modal");
    const burgerModalClassList = burgerModal?.classList;
    burgerModal?.setAttribute(
      "class",
      burgerModalClassList?.contains("modal-open")
        ? "modal-closed"
        : "modal-open"
    );
  };

  const goToPage = (url: string) => {
    window.open(url, "_blank")?.focus();
  };

  const openModal = (type: string) => {
    const modal = document.getElementById(type);
    (modal as HTMLDialogElement).showModal();
  };

  const dismissModal: MouseEventHandler<HTMLDivElement> = (
    ev: React.MouseEvent<HTMLDivElement>
  ) => {
    const modal = ev.target?.closest("dialog") as HTMLDialogElement;
    modal.close();
  };

  if (!gameState.gameOver && !mobileAndTabletCheck()) {
    document.onkeydown = keyHandler;
  }

  return (
    <div className="App">
      <header id="app-nav">
        <div id="app-hamburger" onClick={toggleHamburgerModal}>
          <i className="bx bx-menu"></i>
        </div>
        <div id="app-title">Guildle</div>
        <div id="app-options">
          <i
            className="bx bx-help-circle"
            onClick={() => openModal("how-to-play")}
          ></i>
          <i
            className="bx bx-bar-chart-alt-2"
            onClick={() => openModal("stats")}
          ></i>
          <i className="bx bx-cog" onClick={() => openModal("settings")}></i>
        </div>
      </header>
      {/* #region Hideables */}
      <section id="hamburger-modal" className="modal-closed">
        <nav>
          <div id="more-games-container">
            <h2>More Games</h2>
            <p onClick={toggleHamburgerModal}>
              <i className="bx bx-x"></i>
            </p>
          </div>
          <div id="game-spacer">
            <p>More games coming soon!</p>
          </div>
        </nav>
        <div id="modal-btn-container">
          <button
            onClick={() =>
              goToPage("https://github.com/SoftGuildAlpharetta/guildle")
            }
          >
            <i className="bx bx-star"></i> on <i className="bx bxl-github"></i>
          </button>
          <button onClick={() => goToPage("https://smallbizdevops.com")}>
            Hire me!
          </button>
        </div>
      </section>
      <div id="not-enough-letters" className="toast">
        Not enough letters
      </div>
      <div id="not-in-list" className="toast">
        Not in word list
      </div>
      <div id="success" className="toast">
        {successWord}
      </div>
      <div id="game-over" className="toast">
        {gameState.wordOfTheDay}
      </div>
      <dialog id="how-to-play" className="modal">
        <div onClick={dismissModal}>
          <i className="bx bx-x"></i>
        </div>
        <h2>How to play</h2>
        <div>Guess the wordle in six tries.</div>
        <ul>
          <li>Each guess must be a valid five letter word.</li>
          <li>
            The tiles will change color to indicate how close you were to the
            answer.
          </li>
        </ul>
        <p>
          <b>Examples</b>
        </p>
        <LetterRow
          guessInfo={{
            word: "birds",
            isActive: false,
            guessResults: [{ characterIndexInWord: 0, characterValue: "b" }],
          }}
        ></LetterRow>
        <p>
          The letter <b>B</b> is in the word and in the correct place.
        </p>
        <LetterRow
          guessInfo={{
            word: "cheat",
            isActive: false,
            guessResults: [
              { characterIndexInWord: -1, characterValue: "z" },
              { characterIndexInWord: -1, characterValue: "z" },
              { characterIndexInWord: 3, characterValue: "e" },
            ],
          }}
        ></LetterRow>
        <p>
          The letter <b>E</b> is in the word but not in the correct place.
        </p>
        <LetterRow
          guessInfo={{
            word: "naive",
            isActive: false,
            guessResults: [],
          }}
        ></LetterRow>
        <p>
          The letter <b>I</b> is neither in the word nor is it in the correct
          place.
        </p>
        <p>A new puzzle is calculated every day, so come back and play!</p>
      </dialog>
      <dialog id="stats" className="modal">
        <div onClick={dismissModal}>
          <i className="bx bx-x"></i>
        </div>
        <h2>Stats</h2>
        <p>Coming soon!</p>
      </dialog>
      <dialog id="settings" className="modal">
        <div onClick={dismissModal}>
          <i className="bx bx-x"></i>
        </div>
        <h2>Settings</h2>
        <p>Coming soon!</p>
      </dialog>
      {/* #endregion */}
      <div className="flex-container">
        <div className="board-container">
          {zeroTo(6).map((index) => (
            <LetterRow
              key={"letterRow" + index}
              guessInfo={guildleContext[todayKey].guesses[index]}
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
                  letterUsedAlready={
                    gameState.lettersUsedAlready[firstTen[index]]
                  }
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
                  letterUsedAlready={
                    gameState.lettersUsedAlready[secondNine[index]]
                  }
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
                  letterUsedAlready={
                    gameState.lettersUsedAlready[thirdTen[index]]
                  }
                />
              );
            })}
            <div onClick={handleBackspace} className="keycap-wide">
              <i className="bx bxs-chevrons-left"></i>
            </div>
          </div>
        </div>
        <div>
          {mobileAndTabletCheck() ? (
            <div></div>
          ) : (
            <div id="guess-input-hider">
              <input
                id="guess-input"
                maxLength={5}
                autoComplete="off"
                value={
                  guildleContext[todayKey].guesses.filter(
                    (guess: Guess) => guess.isActive
                  ).word
                }
              ></input>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
