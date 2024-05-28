import { indices } from "./utils";

describe("#indices", () => {
  it("should get correct indices", () => {
    const haystack = "cheep".split("");
    const needle = "e";

    const result = indices(haystack, needle);
    expect(result).toStrictEqual([2, 3]);
  });
});
