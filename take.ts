/**
 * Takes a specified number of elements from the beginning of an async iterable.
 *
 * ``` typescript
 * import { take } from "./take.ts";
 * import { count } from "./infinite.ts";
 *
 * const iterable = take(count(0, 5), 3);
 * for await (const value of iterable) {
 *   console.log(value);
 * }
 * ```
 *
 * The above example will print the following 3 lines:
 *
 * ~~~
 * 0
 * 5
 * 10
 * ~~~
 *
 * If the iterable is shorter than the specified number, the whole elements are
 * taken.
 *
 * ``` typescript
 * import { take } from "./take.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; }
 * const iterable = take(gen(), 5);
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print only 3 elements, because `gen()` yields only 3
 * elements:
 *
 * ~~~
 * foo
 * bar
 * baz
 * ~~~
 *
 * @template T The type of the elements in the `source` and the returned async
 *             iterable.
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
 *
 * ``` typescript
 * import { takeWhile } from "./take.ts";
 * import { count } from "./infinite.ts";
 *
 * const iterable = takeWhile(count(0), v => v < 4);
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 4 lines:
 *
 * ~~~
 * 0
 * 1
 * 2
 * 3
 * ~~~
 *
 * An async `predicate` function also works.  The following example will print
 * the same 4 lines as the previous example:
 *
 * ``` typescript
 * import { takeWhile } from "./take.ts";
 * import { count } from "./infinite.ts";
 *
 * const iterable = takeWhile(count(0), v => Promise.resolve(v < 4));
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * A `predicate` function can take an index as well as the value.
 *
 * ``` typescript
 * import { takeWhile } from "./take.ts";
 * import { count } from "./infinite.ts";
 *
 * const iterable = takeWhile(count(0, 10), (_, i) => i < 4);
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 4 lines:
 *
 * ~~~
 * 0
 * 10
 * 20
 * 30
 * ~~~
 *
 * @template T The type of the elements in the `source` and the returned async
 *             iterable.
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
