/**
 * Turns a synchrnous iterable `source` into an async iterable.
 *
 * ``` typescript
 * import { fromIterable } from "./collections.ts";
 *
 * function* iterable() { yield 1; yield 2; yield 3; }
 * const asyncIterable = fromIterable(iterable());
 * for await (const value of asyncIterable) console.log(value);
 * ```
 *
 * The above example will print the following lines:
 *
 * ~~~
 * 1
 * 2
 * 3
 * ~~~
 *
 * @template T The type of the elements in the `source` and the returned async
 *             iterable.
 * @param source The synchronous iterable to take elements from.
 *               It can be either finite or infinite.
 * @returns An async iterable that yields the same elements as the `source`
 *          iterable.
 */
export async function* fromIterable<T>(
  source: Iterable<T>,
): AsyncIterableIterator<T> {
  yield* source;
}

/**
 * Creates an array from an async iterable.
 *
 * ``` typescript
 * import { toArray } from "./collections.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; }
 * const array = await toArray(gen());
 * ```
 *
 * The `array` variable will be an array like `["foo", "bar", "baz"]`.
 *
 * Note that its first parameter is assumed to be finite; otherwise, it will
 * never return.  The following example will never return:
 *
 * ``` typescript
 * import { toArray } from "./collections.ts";
 * import { count } from "./infinite.ts";
 *
 * await toArray(count(0));
 * ```
 *
 * @template T The type of the elements in the `source` and the returned array.
 * @param source An async iterable to create an array from.  It must be finite.
 * @returns An array that contains the elements from the `source` iterable.
 */
export async function toArray<T>(source: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const value of source) result.push(value);
  return result;
}
