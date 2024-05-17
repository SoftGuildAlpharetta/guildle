import "./Keycap.css";
import { LetterUsedIndicator } from "./interfaces";

const getKeyCapStyle = (letterUsedAlready: LetterUsedIndicator) => {
  return `keycap keycap-${letterUsedAlready || 'not-guessed-yet'}`;
};

const Keycap = ({
  keyLetter,
  keyPushed,
  letterUsedAlready,
}: {
  keyLetter: string;
  keyPushed: Function;
  letterUsedAlready: LetterUsedIndicator;
}) => (
  <div
    className={getKeyCapStyle(letterUsedAlready)}
    onClick={() => keyPushed(keyLetter)}
  >
    <span className="key-lettering">{keyLetter}</span>
  </div>
);

export default Keycap;
