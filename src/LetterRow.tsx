import "./LetterRow.css";
const getLetterStyle = (idx: number, guessInfo: { guessResults: any }) => {
  try {
    return idx === guessInfo.guessResults[idx].characterIndexInWord
      ? "tile letter-correct"
      : guessInfo.guessResults[idx].characterIndexInWord !== -1
      ? "tile letter-in-word"
      : "tile";
  } catch (ex) {
    return "tile";
  }
};

const LetterRow = ({
  guessInfo,
}: {
  guessInfo: { guessResults: any; word: any };
}) => {
  const zeroToFiveArr = [...Array(5).keys()];
  return (
    <div className="flex-row">
      {zeroToFiveArr.map((idx) => {
        return guessInfo !== undefined && guessInfo.word[idx] ? (
          <div key={idx} className={getLetterStyle(idx, guessInfo)}>
            {guessInfo.word[idx]}
          </div>
        ) : (
          <div key={idx} className="tile"></div>
        );
      })}
    </div>
  );
};
export default LetterRow;
