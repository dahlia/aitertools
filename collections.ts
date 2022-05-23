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
 * @param source An async iterable to create an array from.  It must be finite.
 * @returns An array that contains the elements from the `source` iterable.
 */
export async function toArray<T>(source: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const value of source) result.push(value);
  return result;
}
