export const zeroTo = (n: number): number[] => [...Array(n).keys()];

export const date = new Date();
export const todayKey = `${date.getUTCFullYear()}-${
  (date.getUTCMonth() + 1).toString().length < 2
    ? "0" + (date.getUTCMonth() + 1)
    : date.getUTCMonth() + 1
}-${
  date.getUTCDate().toString().length < 2
    ? "0" + date.getUTCDate()
    : date.getUTCDate()
}`;

export const randomNumberInRange = (
  arrayLength: number,
  passedInDate: Date = date
): number => {
  const operation = passedInDate.getDate() % 2 === 0 ? Math.floor : Math.ceil;
  return operation(
    parseInt(
      `${passedInDate.getFullYear()}${
        passedInDate.getUTCMonth().toString().length < 2
          ? "0" + (passedInDate.getUTCMonth() + 1)
          : passedInDate.getUTCMonth() + 1
      }${passedInDate.getDate()}`
    ) *
      passedInDate.getDate() *
      (passedInDate.getDate() > 0 && passedInDate.getDate() < 10
        ? passedInDate.getDate() % 2 === 0
          ? 0.00000001
          : 0.000000001
        : passedInDate.getDate() > 10 && passedInDate.getDate() < 20
        ? passedInDate.getDate() % 2 === 0
          ? 0.000000001
          : 0.0000000001
        : 0.0000000001) *
      (arrayLength - 1)
  );
};

export const isEmptyObject = (obj: any) => {
  try {
    return !(Object.keys(obj).length > 0);
  } catch (_) {
    return (typeof obj === "object" || typeof obj === "undefined") && true;
  }
};

export const isEmptyString = (obj: any) =>
  typeof obj === "string" && obj === "";

export const isEmpty = (obj: any) =>
  obj === undefined || obj === null || isEmptyObject(obj) || isEmptyString(obj);
