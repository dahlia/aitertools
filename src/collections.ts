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
 * @param source The synchronous or asynchronous iterable to take elements from.
 *               It can be either finite or infinite.
 * @returns An async iterable that yields the same elements as the `source`
 *          iterable.
 */
export async function* fromIterable<T>(
  source: AsyncIterable<T> | Iterable<T>,
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

/**
 * Creates a set from an async iterable.
 *
 * ``` typescript
 * import { toSet } from "./collections.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "baz"; }
 * const set = await toSet(gen());
 * ```
 *
 * The `set` variable will be a set like `new Set(["foo", "bar", "baz"])`.
 *
 * Duplicate elements are removed except for the first occurrence of each
 * element.  E.g.:
 *
 * ``` typescript
 * import { toSet } from "./collections.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "foo"; }
 * const set = await toSet(gen());
 * ```
 *
 * The `set` variable will be a set like `new Set(["foo", "bar"])`.
 *
 * Note that the iterable `source` is assumed to be finite; otherwise, it will
 * never return.  The following example will never return:
 *
 * ``` typescript
 * import { toSet } from "./collections.ts";
 * import { count } from "./infinite.ts";
 *
 * await toSet(count(0));
 * ```
 *
 * @template T The type of the elements in the `source` and the returned set.
 * @param source An async iterable to create a set from.  It must be finite.
 * @returns A set that contains the elements from the `source` iterable.
 *          Duplicate elements are removed except for the first one.
 */
export async function toSet<T>(source: AsyncIterable<T>): Promise<Set<T>> {
  const result = new Set<T>();
  for await (const value of source) result.add(value);
  return result;
}

/**
 * Creates a map from an async iterable of key-value pairs.  Each pair is
 * represented as an array of two elements.
 *
 * ``` typescript
 * import { toMap } from "./collections.ts";
 *
 * async function* gen(): AsyncIterableIterator<[string, number]> {
 *   yield ["foo", 1]; yield ["bar", 2]; yield ["baz", 3]; yield ["qux", 4];
 * }
 * const map = await toMap<string, number>(gen());
 * ```
 *
 * The `map` variable will be a map like `Map { "foo" => 1, "bar" => 2,
 * "baz" => 3, "qux" => 4 }`.
 *
 * Duplicate keys are removed except for the last occurrence of each key.  E.g.:
 *
 * ``` typescript
 * import { fromIterable, toMap } from "./collections.ts";
 *
 * const iterable = fromIterable<[string, number]>([
 *   ["foo", 1], ["bar", 2], ["baz", 3], ["qux", 4],
 *   ["foo", 5], ["bar", 6],
 * ]);
 * const map = await toMap<string, number>(iterable);
 * ```
 *
 * The `map` variable will be a map like `Map { "foo" => 5, "bar" => 6,
 * "baz" => 3, "qux" => 4 }`.
 *
 * Note that the iterable `source` is assumed to be finite; otherwise, it will
 * never return.  The following example will never return:
 *
 * ``` typescript
 * import { toMap } from "./collections.ts";
 * import { count } from "./infinite.ts";
 * import { map } from "./map.ts";
 *
 * await toMap<number, number>(
 *   map((v: number) => [v, v] as [number, number], count(0))
 * );
 * ```
 *
 * @template K The type of the keys in the `source` and the returned map.
 * @template V The type of the values in the `source` and the returned map.
 * @param source An async iterable of key-value pairs to create a map from.
 *               Each pair is represented as an array of two elements.
 *               It must be finite.
 * @returns A map that contains the key-value pairs from the `source` iterable.
 *          Duplicate keys are removed except for the last one.
 */
export async function toMap<K, V>(
  source: AsyncIterable<[K, V]>,
): Promise<Map<K, V>> {
  const result = new Map<K, V>();
  for await (const [key, value] of source) result.set(key, value);
  return result;
}
