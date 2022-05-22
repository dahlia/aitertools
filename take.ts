/**
 * Takes a specified number of elements from the beginning of an async iterable.
 * If the iterable is shorter than the specified number, the whole elements are
 * taken.
 * @param source The async iterable to take elements from.
 * @param count The number of elements to take.
 * @returns An async iterable that yields the first `count` elements
 *          from the `source` iterable.
 */
export async function* take<T>(
  source: Iterable<T> | AsyncIterable<T>,
  count: number,
): AsyncIterableIterator<T> {
  let i = 0;
  for await (const value of source) {
    yield value;
    if (++i >= count) break;
  }
}
