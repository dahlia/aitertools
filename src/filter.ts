/**
 * Eliminates all elements from the iterable `source` that do not satisfy
 * the `predicate` function.
 *
 * ``` typescript
 * import { filter } from "./filter.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; yield "qux" }
 * const iterable = filter((v: string) => !!v.match(/^b/), gen());
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 2 lines:
 *
 * ~~~
 * bar
 * baz
 * ~~~
 *
 * The `predicate` function can take an index as well as the value.
 *
 * ``` typescript
 * import { filter } from "./filter.ts";
 *
 * const iterable = filter(
 *   (v: string, i: number) => !v.match(/^b/) && i % 2 === 0,
 *   ["foo", "bar", "baz", "qux", "quux"]
 * );
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 2 lines:
 *
 * ~~~
 * foo
 * quux
 * ~~~
 *
 * @template T The type of the elements in the iterable `source` and
 *             the returned async iterable.
 * @param predicate A predicate function that takes the value and the index of
 *                  the element and returns a boolean, which indicates whether
 *                  the element should be included in the resulting iterable.
 *                  It can be either synchronous or asynchronous.
 * @param source An iterable to filter elements from.  It can be either finite
 *               or infinite.
 * @returns An async iterable that contains elements from the `source` iterable
 *          that satisfy the `predicate` function.
 */
export async function* filter<T>(
  predicate:
    | ((value: T) => Promise<boolean> | boolean)
    | ((value: T, index: number) => Promise<boolean> | boolean),
  source: Iterable<T> | AsyncIterable<T>,
): AsyncIterableIterator<T> {
  let i = 0;
  for await (const value of source) {
    let v: boolean | Promise<boolean> = predicate(value, i++);
    if (v instanceof Promise) v = await v;
    if (v) yield value;
  }
}
