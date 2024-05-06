import { render, screen } from "@testing-library/react";
import App from "./App";
import { test, expect } from "vitest";

test("renders learn react link", async () => {
  render(<App />);
  const linkElement = screen.getByText(/Guildle/i);
  expect(linkElement).toBeInTheDocument();
});