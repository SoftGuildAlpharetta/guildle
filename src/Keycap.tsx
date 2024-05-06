const Keycap = ({
  keyLetter,
  keyPushed,
}: {
  keyLetter: string;
  keyPushed: Function;
}) => (
  <div className="keycap" onClick={() => keyPushed(keyLetter)}>
    <span className="key-lettering">{keyLetter}</span>
  </div>
);

export default Keycap;
