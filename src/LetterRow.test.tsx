import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import LetterRow from "./LetterRow";
test("should show correct letter on consecutive same letter", () => {
  render(
    <LetterRow guessInfo={{ isActive: false, word: "allin" }}></LetterRow>
  );
  screen.findByDisplayValue("l");
  // TODO: Fix this test.
});
