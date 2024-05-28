import "./LetterRow.css";
import { Guess } from "./interfaces";
const getLetterStyle = (idx: number, guessInfo: Guess) => {
  try {
    const guessResult = guessInfo.guessResults![idx];
    const initialClass =
      guessResult.isLetterUsedInWord === "correct"
        ? "tile letter-correct"
        : guessResult.isLetterUsedInWord === "in-word"
        ? "tile letter-in-word"
        : guessResult.isLetterUsedInWord === "not-in-word"
        ? "tile letter-absent"
        : "tile";
    return initialClass + (guessInfo.isGuessProcessing ? " letter-rotate" : "");
  } catch (ex) {
    return "tile";
  }
};

const getAnimationDelay = (idx: number): React.CSSProperties => ({
  animationDelay: (idx + 1) * 100 + "ms",
});

const LetterRow = ({ guessInfo }: { guessInfo: Guess }) => {
  const zeroToFiveArr = [...Array(5).keys()];
  return (
    <div
      className={`flex-row ${
        guessInfo.isGuessNotInWordList ? "row-shake" : ""
      }`}
    >
      {zeroToFiveArr.map((idx) => {
        return guessInfo !== undefined && guessInfo.word[idx] ? (
          <div
            key={idx}
            className={getLetterStyle(idx, guessInfo)}
            style={getAnimationDelay(idx)}
          >
            {guessInfo.word[idx]}
          </div>
        ) : (
          <div key={idx} className="tile" style={getAnimationDelay(idx)}></div>
        );
      })}
    </div>
  );
};
export default LetterRow;
