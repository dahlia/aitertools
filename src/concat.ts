/**
 * Concatenates multiple async iterables into one async iterable.
 *
 * ``` typescript
 * import { concat } from "./concat.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = concat(gen(), ["a", "b", "c", "d"]);
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 8 lines:
 *
 * ~~~
 * foo
 * bar
 * baz
 * qux
 * a
 * b
 * c
 * d
 * ~~~
 *
 * @template T The type of the elements in the iterable `sources` and
 *             the returned async iterable.
 * @param sources Async iterables to concatenate.  It can be either finite
 *                or infinite, and finite iterables and infinite iterables can
 *                be mixed.
 * @returns An async iterable that contains elements from the iterable
 *          `sources`.  If any of the iterable `sources` is infinite,
 *          the returned iterable is infinite.
 */
export async function* concat<T>(
  ...sources: (AsyncIterable<T> | Iterable<T>)[]
): AsyncIterableIterator<T> {
  for (const source of sources) yield* source;
}
