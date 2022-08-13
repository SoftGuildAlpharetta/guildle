const LetterRow = ({ word, isActive }) => {
  const zeroToFourArr = [...Array(5).keys()];
  return (
    <div className="flex-row">
      {zeroToFourArr.map((idx) => {
        return word[idx] && isActive ? (
          <div key={idx} className="tile">{word[idx]}</div>
        ) : (
          <div key={idx} className="tile">
          </div>
        );
      })}
    </div>
  );
};
export default LetterRow;
