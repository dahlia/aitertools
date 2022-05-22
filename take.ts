/**
 * Takes a specified number of elements from the beginning of an async iterable.
 * If the iterable is shorter than the specified number, the whole elements are
 * taken.
 * @param source The async iterable to take elements from.  It can be either
 *               finite or infinite.
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

/**
 * Takes elements from the beginning of an async iterable as long as a specified
 * condition is met.  If the condition is not met, the iterable stops.
 * @param source The async iterable to take elements from.  It can be either
 *               finite or infinite.
 * @param predicate A predicate function to test each source element for
 *                  a condition; the second parameter of the function represents
 *                  the index of the source element.  It can be either
 *                  synchronous or asynchronous.
 * @returns An async iterable that contains elements from the `source` iterable
 *          that occur before the element at which the `predicate` no longer
 *          passes.
 */
export async function* takeWhile<T>(
  source: Iterable<T> | AsyncIterable<T>,
  predicate: (value: T, index: number) => (boolean | Promise<boolean>),
): AsyncIterableIterator<T> {
  let i = 0;
  for await (const value of source) {
    let cont = predicate(value, i++);
    if (cont instanceof Promise) cont = await cont;
    if (!cont) break;
    yield value;
  }
}
