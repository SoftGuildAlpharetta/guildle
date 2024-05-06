export const zeroTo = (n: number): number[] => [...Array(n).keys()];

export const randomNumberInRange = (arrayLength: number): number =>
  Math.floor(Math.random() * (arrayLength - 1));

export const date = new Date();
export const todayKey = `${date.getUTCFullYear()}-${
  date.getUTCMonth().toString().length < 2
    ? "0" + date.getUTCMonth()
    : date.getUTCMonth()
}-${
  date.getUTCDate().toString().length < 2
    ? "0" + date.getUTCDate()
    : date.getUTCDate()
}`;

export const isEmptyObject = (obj: any) => {
  try {
    return !(Object.keys(obj).length > 0);
  } catch(_) {
    return (typeof obj === 'object' || typeof obj === 'undefined') && true;
  }
}

export const isEmptyString = (obj: any) => typeof obj === 'string' && obj === '';

export const isEmpty = (obj: any) => obj === undefined || obj === null || isEmptyObject(obj) || isEmptyString(obj);