/* Length of the longest word: lets a heading size itself so that word fits. */
export const longestWord = (s: string) => Math.max(...s.split(/\s+/).map((w) => w.length));
