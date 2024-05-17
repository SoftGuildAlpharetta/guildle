import { render, screen } from "@testing-library/react";
import App from './App'
import { test, expect } from "vitest";
import { WORD_LIST_URL } from "./constants";
import { randomNumberInRange } from "./utils";

test("renders learn react link", async () => {
  render(<App />);
  const linkElement = screen.getByText(/Guildle/i);
  expect(linkElement).toBeInTheDocument();
});

test("algo for random number in range", async () => {
  const wordsArray = await fetch(WORD_LIST_URL)
    .then((response) => response.text())
    .then((text) => text.split("\n"));
  const wordsOfTheDayByDay = [];
  for (let i = 1; i <= 31; i++) {
    const today = new Date(2024, 4, i);
    wordsOfTheDayByDay.push({
      today: today.toDateString(),
      wordOfTheDay: wordsArray[randomNumberInRange(wordsArray.length, today)],
    });
  }
  const wordsOfTheDay = wordsOfTheDayByDay
    .map((wordOfTheDayByDay) => wordOfTheDayByDay.wordOfTheDay)
    .filter((wordOfTheDay, idx, arr) => arr.indexOf(wordOfTheDay) === idx);
    // Add +1 to make sure we account for 0-based indexing.
  expect((wordsOfTheDay.length + 1)).toBe(31);
});
