/**
 * Makes an async iterable of evenly spaced values starting with the `start`
 * number.
 * @param start The first value in the sequence.  Defaults to 0.
 * @param step The difference between each value in the sequence.
 *             Defaults to 1.
 * @returns An async iterable of evenly spaced values.
 */
export async function* count(
  start = 0,
  step = 1,
): AsyncIterableIterator<number> {
  for (let i = start; true; i += step) {
    yield i;
  }
}
