import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import LetterRow from "./LetterRow";

function App() {
  const [wordStr, setWordStr] = useState("");
  const [guessNumber, setGuessNumber] = useState(1);

  return (
    <div className="App">
      <div className="flex-container">
        <LetterRow word={wordStr} isActive={guessNumber === 1} />
        <LetterRow word={wordStr} isActive={guessNumber === 2} />
        <LetterRow word={wordStr} isActive={guessNumber === 3} />
        <LetterRow word={wordStr} isActive={guessNumber === 4} />
        <LetterRow word={wordStr} isActive={guessNumber === 5} />
        <LetterRow word={wordStr} isActive={guessNumber === 6} />
      </div>
      <div>
        <p>Some JSON!</p>
        <input
          maxLength={5}
          onChange={(event) => setWordStr(event.target.value)}
          value={wordStr}
        ></input>
      </div>
    </div>
  );
}

export default App;
