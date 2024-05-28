import GuessChecker from "./GuessChecker";

describe("should check a guess correctly", () => {
  let wordOfTheDay: string;
  let guess: string;
  it("should correctly return guess with tents/crest", () => {
    guess = "tents";
    wordOfTheDay = "crest";

    const guessResult = GuessChecker.checkGuess(guess, wordOfTheDay);
    expect(guessResult[0]?.isLetterUsedInWord).toBe("in-word");
    expect(guessResult[1]?.isLetterUsedInWord).toBe("in-word");
    expect(guessResult[2]?.isLetterUsedInWord).toBe("not-in-word");
    expect(guessResult[3]?.isLetterUsedInWord).toBe("in-word");
    expect(guessResult[4]?.isLetterUsedInWord).toBe("in-word");
  });

  it("should correctly return guess with cheep/mired", () => {
    guess = "cheep";
    wordOfTheDay = "mired";

    const guessResult = GuessChecker.checkGuess(guess, wordOfTheDay);
    expect(guessResult[0]?.isLetterUsedInWord).toBe("not-in-word");
    expect(guessResult[1]?.isLetterUsedInWord).toBe("not-in-word");
    expect(guessResult[2]?.isLetterUsedInWord).toBe("not-in-word");
    expect(guessResult[3]?.isLetterUsedInWord).toBe("correct");
    expect(guessResult[4]?.isLetterUsedInWord).toBe("not-in-word");
  });
});
