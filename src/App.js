import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import LetterRow from "./LetterRow";
const WORD_LIST_URL =
  "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";
const randomNumberInRange = (arrayLength) =>
  Math.floor(Math.random() * (arrayLength - 1));
const zeroToSixArr = [...Array(6).keys()];

function App() {
  const [wordStr, setWordStr] = useState("");
  const [guesses, setGuesses] = useState(
    zeroToSixArr.map((index) => ({
      isActive: index === 0,
      word: "",
    }))
  );
  const [wordsArray, setWordsArray] = useState([]);
  const [wordOfTheDay, setWordOfTheDay] = useState("");

  useEffect(() => {
    fetch(WORD_LIST_URL)
      .then((response) => response.text())
      .then((text) => {
        const wordsArr = text.split("\n");
        setWordsArray(wordsArr);
        const wordOfTheDay = wordsArr[randomNumberInRange(wordsArr.length)];
        console.log(wordOfTheDay);
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
      <div className="flex-container">
        {zeroToSixArr.map((index) => (
          <LetterRow key={"letterRow" + index} guessInfo={guesses[index]} />
        ))}
      </div>
      <div>
        <p>Some JSON!</p>
        <form onSubmit={checkGuess}>
          <input
            maxLength={5}
            onChange={(event) =>
              setGuesses(
                guesses.map((guess) =>
                  guess.isActive
                    ? { ...guess, word: event.target.value }
                    : { ...guess }
                )
              )
            }
            value={guesses.filter((guess) => guess.isActive).word}
          ></input>
        </form>
      </div>
    </div>
  );
}

export default App;
