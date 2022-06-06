import { fromIterable } from "./collections.ts";

/**
 * Transforms every element of the iterable `source` into a new iterable.
 *
 * ``` typescript
 * import { map } from "./map.ts";
 * import { count } from "./infinite.ts";
 *
 * const iterable = map((v: number) => v * 2, count());
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following and keep going forever:
 *
 * ~~~
 * 0
 * 2
 * 4
 * 6
 * (...)
 * ~~~
 *
 * The `fn` function can take an additional argument, which is the index of the
 * element in the iterable.
 *
 * ``` typescript
 * import { map } from "./map.ts";
 *
 * const iterable = map(
 *   (v: string, i: number) => `${i}. ${v.toUpperCase()}`,
 *   ["foo", "bar", "baz", "qux"]
 * );
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 4 lines:
 *
 * ~~~
 * 0. FOO
 * 1. BAR
 * 2. BAZ
 * 3. QUX
 * ~~~
 *
 * @template I The type of the elements in the iterable `source`.
 * @template O The type of the elements in the returned async iterable.
 * @param fn A function that takes an element to transform and returns
 *           a transformed element.  It can be either async or sync.
 * @param source An iterable or async iterable to transform with `fn`.
 * @returns An async iterable that consist of the results of `fn` applied to
 *          each element of `source`.
 */
export function map<I, O>(
  fn:
    | ((value: I) => Promise<O> | O)
    | ((value: I, index: number) => Promise<O> | O),
  source: Iterable<I> | AsyncIterable<I>,
): AsyncIterableIterator<O>;

/**
 * Transforms every element of the iterables into a new single iterable.
 * If iterable sources are of different lengths, the resulting iterable will
 * be of the same length as the shortest iterable.
 *
 * ``` typescript
 * import { map } from "./map.ts";
 * import { count } from "./infinite.ts";
 *
 * const iterable = map(
 *   (s: string, n: number) => `${s} ${n}`,
 *   ["foo", "bar", "baz", "qux"],
 *   count()
 * );
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 4 lines:
 *
 * ~~~
 * foo 0
 * bar 1
 * baz 2
 * qux 3
 * ~~~
 *
 * The `fn` function can take an additional argument, which is the index of the
 * element in the iterable.
 *
 * ``` typescript
 * import { map } from "./map.ts";
 * import { count } from "./infinite.ts";
 *
 * const iterable = map(
 *   (s: string, n: number, i: number) => `${i}. ${s} ${n}`,
 *   ["foo", "bar", "baz", "qux"],
 *   count(0, 5)
 * );
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 4 lines:
 *
 * ~~~
 * 0. foo 0
 * 1. bar 5
 * 2. baz 10
 * 3. qux 15
 * ~~~
 *
 * @template I1 The type of the elements in the iterable `source1`.
 * @template I2 The type of the elements in the iterable `source2`.
 * @template O The type of the elements in the returned async iterable.
 * @param fn A function that takes elements of the same position in the
 *           sources and returns a single transformed element.  It can be
 *           either async or sync.
 * @param source1 The first iterable to transform with `fn`.
 *                Its each element will be passed as the first argument to
 *                `fn`.
 * @param source2 The second iterable iterable to transform with `fn`.
 *                Its each element will be passed as the second argument to
 *                `fn`.
 * @returns An async iterable that consist of the results of `fn` applied
 *          to each element of `source1` and `source2`.
 */
export function map<I1, I2, O>(
  fn:
    | ((value1: I1, value2: I2) => Promise<O> | O)
    | ((value1: I1, value2: I2, index: number) => Promise<O> | O),
  source1: Iterable<I1> | AsyncIterable<I1>,
  source2: Iterable<I2> | AsyncIterable<I2>,
): AsyncIterableIterator<O>;

/**
 * Transforms every element of the iterables into a new single iterable.
 * If iterable sources are of different lengths, the resulting iterable will
 * be of the same length as the shortest iterable.
 *
 * @template I1 The type of the elements in the iterable `source1`.
 * @template I2 The type of the elements in the iterable `source2`.
 * @template I3 The type of the elements in the iterable `source3`.
 * @template O The type of the elements in the returned async iterable.
 * @param fn A function that takes elements of the same position in the
 *           sources and returns a single transformed element.  It can be
 *           either async or sync.
 * @param source1 The first iterable to transform with `fn`.
 *                Its each element will be passed as the first argument to
 *                `fn`.
 * @param source2 The second iterable iterable to transform with `fn`.
 *                Its each element will be passed as the second argument to
 *                `fn`.
 * @param source3 The third iterable iterable to transform with `fn`.
 *                Its each element will be passed as the third argument to
 *                `fn`.
 * @returns An async iterable that consist of the results of `fn` applied
 *          to each element of `source1`, `source2`, and `source3`.
 */
export function map<I1, I2, I3, O>(
  fn:
    | ((value1: I1, value2: I2, value3: I3, index: number) => Promise<O> | O)
    | ((value1: I1, value2: I2, value3: I3, index: number) => Promise<O> | O),
  source1: Iterable<I1> | AsyncIterable<I1>,
  source2: Iterable<I2> | AsyncIterable<I2>,
  source3: Iterable<I3> | AsyncIterable<I3>,
): AsyncIterableIterator<O>;

/**
 * Transforms every element of the iterables into a new single iterable.
 * If iterable sources are of different lengths, the resulting iterable will
 * be of the same length as the shortest iterable.
 *
 * @template I1 The type of the elements in the iterable `source1`.
 * @template I2 The type of the elements in the iterable `source2`.
 * @template I3 The type of the elements in the iterable `source3`.
 * @template I4 The type of the elements in the iterable `source4`.
 * @template O The type of the elements in the returned async iterable.
 * @param fn A function that takes elements of the same position in the
 *           sources and returns a single transformed element.  It can be
 *           either async or sync.
 * @param source1 The first iterable to transform with `fn`.
 *                Its each element will be passed as the first argument to
 *                `fn`.
 * @param source2 The second iterable iterable to transform with `fn`.
 *                Its each element will be passed as the second argument to
 *                `fn`.
 * @param source3 The third iterable iterable to transform with `fn`.
 *                Its each element will be passed as the third argument to
 *                `fn`.
 * @param source4 The fourth iterable iterable to transform with `fn`.
 *                Its each element will be passed as the fourth argument to
 *                `fn`.
 * @returns An async iterable that consist of the results of `fn` applied
 *          to each element of `source1`, `source2`, `sourc3`, and `source4`.
 */
export function map<I1, I2, I3, I4, O>(
  fn:
    | ((v1: I1, v2: I2, v3: I3, v4: I4, index: number) => Promise<O> | O)
    | ((v1: I1, v2: I2, v3: I3, v4: I4, index: number) => Promise<O> | O),
  source1: Iterable<I1> | AsyncIterable<I1>,
  source2: Iterable<I2> | AsyncIterable<I2>,
  source3: Iterable<I3> | AsyncIterable<I3>,
  source4: Iterable<I4> | AsyncIterable<I4>,
): AsyncIterableIterator<O>;

/**
 * Transforms every element of the iterables into a new single iterable.
 * If iterable sources are of different lengths, the resulting iterable will
 * be of the same length as the shortest iterable.
 *
 * @template I1 The type of the elements in the iterable `source1`.
 * @template I2 The type of the elements in the iterable `source2`.
 * @template I3 The type of the elements in the iterable `source3`.
 * @template I4 The type of the elements in the iterable `source4`.
 * @template I5 The type of the elements in the iterable `source5`.
 * @template O The type of the elements in the returned async iterable.
 * @param fn A function that takes elements of the same position in the
 *           sources and returns a single transformed element.  It can be
 *           either async or sync.
 * @param source1 The first iterable to transform with `fn`.
 *                Its each element will be passed as the first argument to
 *                `fn`.
 * @param source2 The second iterable iterable to transform with `fn`.
 *                Its each element will be passed as the second argument to
 *                `fn`.
 * @param source3 The third iterable iterable to transform with `fn`.
 *                Its each element will be passed as the third argument to
 *                `fn`.
 * @param source4 The fourth iterable iterable to transform with `fn`.
 *                Its each element will be passed as the fourth argument to
 *                `fn`.
 * @param source5 The fifth iterable iterable to transform with `fn`.
 *                Its each element will be passed as the fifth argument to
 *                `fn`.
 * @returns An async iterable that consist of the results of `fn` applied
 *          to each element of `source1`, `source2`, `sourc3`, `source4`, and
 *          `source5`.
 */
export function map<I1, I2, I3, I4, I5, O>(
  fn:
    | ((
      v1: I1,
      v2: I2,
      v3: I3,
      v4: I4,
      v5: I5,
      index: number,
    ) => Promise<O> | O)
    | ((
      v1: I1,
      v2: I2,
      v3: I3,
      v4: I4,
      v5: I5,
      index: number,
    ) => Promise<O> | O),
  source1: Iterable<I1> | AsyncIterable<I1>,
  source2: Iterable<I2> | AsyncIterable<I2>,
  source3: Iterable<I3> | AsyncIterable<I3>,
  source4: Iterable<I4> | AsyncIterable<I4>,
  source5: Iterable<I5> | AsyncIterable<I5>,
): AsyncIterableIterator<O>;

export async function* map<O>(
  // deno-lint-ignore no-explicit-any
  fn: (..._: any[]) => Promise<O> | O,
  ...sources: (Iterable<unknown> | AsyncIterable<unknown>)[]
): AsyncIterable<O> {
  if (sources.length < 1) {
    throw new TypeError("map requires at least one source");
  } else if (sources.length === 1) {
    let i = 0;
    for await (const value of sources[0]) {
      let v: O | Promise<O> = fn(value, i++);
      if (v instanceof Promise) v = await v;
      yield v;
    }
    return;
  }

  const iterators: AsyncIterableIterator<unknown>[] = sources.map(fromIterable);
  let i = 0;
  while (true) {
    const args: unknown[] = [];
    for (const it of iterators) {
      const { value, done } = await it.next();
      if (done) return;
      args.push(value);
    }
    args.push(i++);
    let v: O | Promise<O> = fn.apply(undefined, args);
    if (v instanceof Promise) v = await v;
    yield v;
  }
}
