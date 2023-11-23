/**
 * Drops a specified number of elements from the beginning of an async iterable,
 * and yields the remaining elements.
 *
 * ``` typescript
 * import { drop } from "./drop.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = drop(gen(), 2);
 * for await (const value of iterable) {
 *   console.log(value);
 * }
 * ```
 *
 * The above example will print the following 2 lines:
 *
 * ~~~
 * baz
 * qux
 * ~~~
 *
 * If the iterable is shorter than or equal to the specified number, no elements
 * are yielded.
 *
 * ``` typescript
 * import { drop } from "./drop.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = drop(gen(), 4);
 * for await (const value of iterable) {
 *   console.log(value);
 * }
 * ```
 *
 * The above example will print nothing.
 *
 * @template T The type of the elements in the `source` and the returned async
 *             iterable.
 * @param source The async iterable to drop elements from.  It can be either
 *               finite or infinite.
 * @param count The number of elements to drop.
 * @returns An async iterable that yields the remaining elements after dropping
 *          the first `count` elements from the `source` iterable.
 */
export async function* drop<T>(
  source: Iterable<T> | AsyncIterable<T>,
  count: number,
): AsyncIterableIterator<T> {
  let i = 0;
  for await (const value of source) {
    if (++i <= count) continue;
    yield value;
  }
}

/**
 * Drops elements from the beginning of an async iterable as long as a specified
 * condition is met, and yields the remaining elements.
 *
 * ``` typescript
 * import { dropWhile } from "./drop.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = dropWhile(gen(), v => v !== "baz");
 * for await (const value of iterable) {
 *   console.log(value);
 * }
 * ```
 *
 * The above example will print the following 2 lines:
 *
 * ~~~
 * baz
 * qux
 * ~~~
 *
 * An async `predicate` function also works.  The following example will print
 * the same 2 lines as the previous example:
 *
 * ``` typescript
 * import { dropWhile } from "./drop.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = dropWhile(gen(), v => Promise.resolve(v !== "baz"));
 * for await (const value of iterable) {
 *   console.log(value);
 * }
 * ```
 *
 * A `predicate` function can take an index as well as the value.
 *
 * ``` typescript
 * import { dropWhile } from "./drop.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = dropWhile(gen(), (_, i) => i % 2 === 0);
 * for await (const value of iterable) {
 *   console.log(value);
 * }
 * ```
 *
 * The above example will print the following 3 lines:
 *
 * ~~~
 * bar
 * baz
 * qux
 * ~~~
 *
 * @template T The type of the elements in the `source` and the returned async
 *             iterable.
 * @param source The async iterable to drop elements from.  It can be either
 *               finite or infinite.
 * @param predicate A predicate function to test each source element for
 *                  a condition; the second parameter of the function represents
 *                  the index of the source element.  It can be either a
 *                  synchronous or an asynchronous function.
 * @returns An async iterable that contains elements from the `source` iterable
 *          that occur that and after the element at which the `predicate` first
 *          fails.
 */
export async function* dropWhile<T>(
  source: Iterable<T> | AsyncIterable<T>,
  predicate: (value: T, index: number) => boolean | Promise<boolean>,
): AsyncIterableIterator<T> {
  let i = 0;
  let ignorePredicate = false;
  for await (const value of source) {
    if (!ignorePredicate) {
      let drop = predicate(value, i++);
      if (drop instanceof Promise) drop = await drop;
      if (drop) continue;
      ignorePredicate = true;
    }
    yield value;
  }
}

/**
 * Drops a specified number of elements from the end of an async iterable, and
 * yields the remaining elements.
 *
 * ``` typescript
 * import { dropEnd } from "./drop.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = dropEnd(gen(), 2);
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 2 lines:
 *
 * ~~~
 * foo
 * bar
 * ~~~
 *
 * If the iterable is shorter than or equal to the specified number, no elements
 * are yielded.
 *
 * ``` typescript
 * import { dropEnd } from "./drop.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = dropEnd(gen(), 4);
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print nothing.
 *
 * @template T The type of the elements in the `source` and the returned async
 *             iterable.
 * @param source The async iterable to drop elements from.  It can be either
 *               finite or infinite.
 * @param count The number of elements to drop.  Must be a finite integer.
 * @returns An async iterable that yields the remaining elements after dropping
 *          the last `count` elements from the `source` iterable.
 * @throws `RangeError` if `count` is not a finite integer.
 */
export async function* dropEnd<T>(
  source: Iterable<T> | AsyncIterable<T>,
  count: number,
): AsyncIterableIterator<T> {
  if (!Number.isFinite(count)) throw new RangeError("count must be finite");
  else if (!Number.isInteger(count)) {
    throw new RangeError("count must be integer");
  } else if (count < 1) {
    for await (const value of source) yield value;
    return;
  }

  const buffer: T[] = [];
  let rewindPos = 0;
  for await (const value of source) {
    if (buffer.length >= count) {
      yield buffer[rewindPos];
      buffer[rewindPos] = value;
      if (rewindPos < count - 1) rewindPos++;
      else rewindPos = 0;
    } else {
      buffer.push(value);
    }
  }
}
