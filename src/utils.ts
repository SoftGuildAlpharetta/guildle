export const zeroTo = (n: number): number[] => [...Array(n).keys()];

export const randomNumberInRange = (arrayLength: number): number =>
  Math.floor(Math.random() * (arrayLength - 1));