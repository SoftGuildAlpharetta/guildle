import "./App.css";
import { useEffect, useState } from "react";
import { zeroTo } from "./utils";
import LetterRow from "./LetterRow";
import Keycap from './Keycap';
const WORD_LIST_URL =
  "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";
const randomNumberInRange = (arrayLength) =>
  Math.floor(Math.random() * (arrayLength - 1));
const keyMapStr = 'qwertyuiopasdfghjklzxcvbnm';
const qwertyArr = keyMapStr.split('');

function App() {
  const [guesses, setGuesses] = useState(
    zeroTo(6).map((index) => ({
      isActive: index === 0,
      word: "",
    }))
  );
  const [wordsArray, setWordsArray] = useState([]);
  const [wordOfTheDay, setWordOfTheDay] = useState("");

  const setCurrentGuess = (newGuess) => setGuesses(
    guesses.map((guess) =>
      guess.isActive
        ? { ...guess, word: newGuess }
        : { ...guess }
    )
  )

  const handleKeyPush = (letter) => {
    const guess = guesses.find(x => x.isActive).word;
    const newGuess = guess + letter;
    setCurrentGuess(newGuess);
  }


  useEffect(() => {
    const guessInput = document.getElementById('guess-input');
    guessInput.focus();
    guessInput.onblur = (ev) => {
      ev.preventDefault();
      guessInput.focus();
    };
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

  const checkGuess = (event) => {
    event.preventDefault();
    const guessValue = guesses.find((guess) => guess.isActive).word;
    let isActiveIndex = guesses.findIndex((guess) => guess.isActive);
    console.log(isActiveIndex);
    console.log(guessValue);
    const guessResults = guessValue.split("").map((character) => {
      const characterIndexInWord = wordOfTheDay.indexOf(character);
      return { characterIndexInWord, characterValue: character };
    });
    setGuesses(
      guesses.map((val, idx, arr) => {
        if (idx === isActiveIndex) {
          val.isActive = false;
          val.guessResults = guessResults;
        }
        if (idx === isActiveIndex + 1) {
          val.isActive = true;
        }
        return val;
      })
    );
    if (wordOfTheDay === guessValue) {
      console.log("Correct!");
    }
  };

  return (
    <div className="App">
      <header id="app-nav">
        <div id="app-hamburger">
          <i className='bx bx-menu'></i>
        </div>
        <div id="app-title">Guildle</div>
        <div id="app-options">
          <i className='bx bx-help-circle'></i>
          <i className='bx bx-bar-chart-alt-2' ></i>
          <i className='bx bx-cog' ></i>
        </div>
      </header >
      <div className="flex-container">
        <div className="board-container">
          {zeroTo(6).map((index) => (
            <LetterRow key={"letterRow" + index} guessInfo={guesses[index]} />
          ))}
        </div>
        <div className="keyboard-container">
          <div className="keyboard-row">
            {zeroTo(10).map(index => {
              const firstTen = qwertyArr.slice(0, 10);
              return (
                <Keycap key={"keycap-" + firstTen[index]}
                  keyPushed={handleKeyPush} keyLetter={firstTen[index]} />
              )
            })}
          </div>
          <div className="keyboard-row">
            <div className="spacer"></div>
            {zeroTo(9).map(index => {
              const secondNine = qwertyArr.slice(10, 19);
              return (
                <Keycap key={"keycap-" + secondNine[index]}
                  keyPushed={handleKeyPush} keyLetter={secondNine[index]} />
              )
            })}
            <div className="spacer"></div>
          </div>
          <div className="keyboard-row">
            <div className="keycap-wide" onClick={checkGuess}>Enter</div>
            {zeroTo(7).map(index => {
              const thirdTen = qwertyArr.slice(19, 26);
              return (
                <Keycap
                  key={"keycap-" + thirdTen[index]}
                  keyPushed={handleKeyPush} keyLetter={thirdTen[index]} />
              )
            })}
            <div onClick={ev => {
              const guess = guesses.find(x => x.isActive).word;
              const guessLength = guess.length;
              const newGuess = guess.split('').slice(0, guessLength - 1).join('');
              setCurrentGuess(newGuess);
            }} className="keycap-wide"><i className='bx bxs-chevrons-left'></i></div>
          </div>
        </div>
        <div>
          <form id="hidden-form" onSubmit={checkGuess}>
            <div id="guess-input-hider"><input
              id="guess-input"
              maxLength={5}
              onChange={(event) =>
                setCurrentGuess(event.target.value)
              }
              value={guesses.filter((guess) => guess.isActive).word}
            ></input>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
}

export default App;
