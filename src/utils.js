export const zeroTo = (n) => [...Array(n).keys()];
export const randomNumberInRange = (arrayLength) =>
  Math.floor(Math.random() * (arrayLength - 1));

const date = new Date();
export const todayKey = `${date.getUTCFullYear()}-${date.getUTCMonth().toString().length < 2
  ? '0' + date.getUTCMonth()
  : date.getUTCMonth()
  }-${date.getUTCDate().toString().length < 2
    ? '0' + date.getUTCDate()
    : date.getUTCDate()
  }`;