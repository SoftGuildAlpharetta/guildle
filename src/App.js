import './App.css';
import { WordleContextProvider, WordleContext } from './WordleContext';
import { useContext, useEffect } from 'react';
import { zeroTo, randomNumberInRange, todayKey } from './utils';
import LetterRow from './LetterRow';
import Keycap from './Keycap';
const WORD_LIST_URL =
  'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words';

const keyMapStr = 'qwertyuiopasdfghjklzxcvbnm';
const qwertyArr = keyMapStr.split('');


function App() {
  const wordleContext = useContext(WordleContext);
  const updateGameState = (argument) => {
    console.log(argument)
  };
  const setGuesses = (guesses) => {
    updateGameState({ guesses });
  };
  const setCurrentGuess = (newGuessCharacter) =>
    setGuesses(
      wordleContext[todayKey].guesses.map((guess) => {
        if (guess.isActive && !(guess.word.length >= 5)) {
          const newGuess = guess.word + newGuessCharacter;
          return { ...guess, word: newGuess };
        } else {
          return { ...guess };
        }
      })
    );
  const setWordOfTheDay = (wordOfTheDay) =>
    updateGameState({ wordOfTheDay });
  const setWordsArray = (wordsArray) =>
    updateGameState({ wordsArray });

  const handleKeyPush = (letter) => {
    const guess = wordleContext[todayKey].guesses.find((x) => x.isActive).word;
    const newGuess = guess + letter;
    setCurrentGuess(newGuess);
  };

  const handleDelete = (ev) => {
    const guess = wordleContext[todayKey].guesses.find((x) => x.isActive).word;
    const guessLength = guess.length;
    const newGuess = guess
      .split('')
      .slice(0, guessLength - 1)
      .join('');
    setCurrentGuess(newGuess);
  };

  const handleSubmit = (ev) => {
    console.log("derp")
  }

  useEffect(() => {

    if (wordleContext.wordsArray.length === 0) {
      fetch(WORD_LIST_URL)
        .then((response) => response.text())
        .then((text) => {
          const wordsArr = text.split('\n');
          setWordsArray(wordsArr);
          const wordOfTheDay = wordsArr[randomNumberInRange(wordsArr.length)];
          setWordOfTheDay(wordOfTheDay);
        })
        .catch((err) => console.error(err));
    }
    document.addEventListener('keydown', (ev) => {
      // ev.preventDefault();
      if (ev.key === 'Enter') {
        handleSubmit(ev)
      } else if (ev.key === 'Backspace') {
        handleDelete(ev);
      } else if (qwertyArr.indexOf(ev.key) !== -1) {
        setCurrentGuess(ev.key);
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('wordleGameState', JSON.stringify(wordleContext));
  }, [wordleContext]);

  const checkGuess = (event) => {
    event.preventDefault();
    const guessValue = wordleContext[todayKey].guesses.find(
      (guess) => guess.isActive
    ).word;
    let isActiveIndex = wordleContext[todayKey].guesses.findIndex(
      (guess) => guess.isActive
    );
    const guessResults = guessValue.split('').map((character) => {
      const characterIndexInWord = wordleContext[todayKey].wordOfTheDay.indexOf(
        character
      );
      return { characterIndexInWord, characterValue: character };
    });
    if (guessValue.length === 5 && checkWordInWordList(guessValue)) {
      setGuesses(
        wordleContext[todayKey].guesses.map((val, idx, arr) => {
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
      if (wordleContext[todayKey].wordOfTheDay === guessValue) {
        alert('Correct!');
      }
    } else {
      shakeCurrentRow();
    }
  };

  const checkWordInWordList = (guessValue) =>
    wordleContext.wordsArray.indexOf(guessValue) !== -1;

  const shakeCurrentRow = () => { };

  return (
    <div className="App">
      <WordleContextProvider>
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
                key={'letterRow' + index}
                guessInfo={wordleContext[todayKey].guesses[index]}
              />
            ))}
          </div>

          <div className="keyboard-container">
            <div className="keyboard-row">
              {zeroTo(10).map((index) => {
                const firstTen = qwertyArr.slice(0, 10);
                return (
                  <Keycap
                    key={'keycap-' + firstTen[index]}
                    keyPushed={handleKeyPush}
                    keyLetter={firstTen[index]}
                  />
                );
              })}
            </div>
            <div className="keyboard-row">
              <div className="spacer"></div>
              {zeroTo(9).map((index) => {
                const secondNine = qwertyArr.slice(10, 19);
                return (
                  <Keycap
                    key={'keycap-' + secondNine[index]}
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
                const thirdTen = qwertyArr.slice(19, 26);
                return (
                  <Keycap
                    key={'keycap-' + thirdTen[index]}
                    keyPushed={handleKeyPush}
                    keyLetter={thirdTen[index]}
                  />
                );
              })}
              <div onClick={handleDelete} className="keycap-wide">
                <i className="bx bxs-chevrons-left"></i>
              </div>
            </div>
          </div>
        </div>
      </WordleContextProvider>
    </div>
  );
}

export default App;
