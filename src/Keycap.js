const Keycap = ({ keyLetter, keyPushed }) => {
  return (
    <div className="keycap" onClick={() => keyPushed(keyLetter)}>
      <span className="key-lettering">{keyLetter}</span>
    </div>
  )
}

export default Keycap;