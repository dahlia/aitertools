/**
 * Makes an infinite async iterable of evenly spaced values starting with
 * the `start` number.
 *
 * ``` typescript
 * import { count } from "./infinite.ts";
 * const iterable = count(5);
 * for await (const value of iterable) {
 *   console.log(value);
 * }
 * ```
 *
 * The above example will print the following and keep going forever:
 *
 * ~~~
 * 5
 * 6
 * 7
 * 8
 * 9
 * (...)
 * ~~~
 *
 * You could adjust the interval by passing a second argument to `count()`:
 *
 * ``` typescript
 * import { count } from "./infinite.ts";
 * const iterable = count(0, 3);
 * for await (const value of iterable) {
 *   console.log(value);
 * }
 * ```
 *
 * The above example will print the following and keep going forever:
 *
 * ~~~
 * 0
 * 3
 * 6
 * 9
 * 12
 * (...)
 * ~~~
 *
 * As it's infinite, it's usually used with `break` to stop the iteration:
 *
 * ``` typescript
 * import { count } from "./infinite.ts";
 * for await (const value of count(0)) {
 *   if (value > 4) break;
 *   console.log(value);
 * }
 * ```
 *
 * Or with other async generators like `takeWhile()`:
 *
 * ``` typescript
 * import { count } from "./infinite.ts";
 * import { takeWhile } from "./take.ts";
 * for await (const value of takeWhile(count(0), v => v <= 4)) {
 *   console.log(value);
 * }
 * ```
 *
 * The both examples above will print the following 4 lines:
 *
 * ~~~
 * 0
 * 1
 * 2
 * 3
 * ~~~
 *
 * @param start The first value in the sequence.  Defaults to 0.
 * @param step The difference between each value in the sequence.
 *             Defaults to 1.
 * @returns An async iterable of evenly spaced values.
 */
export async function* count(
  start = 0,
  step = 1,
): AsyncIterableIterator<number> {
  for (let i = start; true; i += step) {
    yield i;
  }
}

/**
 * Makes an async iterator that yields elements from the `source` and saving
 * a copy of each.  When the `source` is exhausted, yields saved copies
 * indefinitely.
 *
 * Note that it may require significant memory to save the copies
 * depending on the length of the `source`.
 *
 * ``` typescript
 * import { cycle } from "./infinite.ts";
 *
 * async function* gen() { yield 3; yield 6; yield 9; }
 * const iterable = cycle(gen());
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following and keep going forever:
 *
 * ~~~
 * 3
 * 6
 * 9
 * 3
 * 6
 * 9
 * (...)
 * ~~~
 *
 * @param source An async iterable to repeat.
 * @returns An async iterable that repeats the `source` indefinitely.
 */
export async function* cycle<T>(
  source: Iterable<T> | AsyncIterable<T>,
): AsyncIterableIterator<T> {
  const cache = [];
  for await (const value of source) {
    yield value;
    cache.push(value);
  }
  if (cache.length > 0) {
    while (true) {
      for await (const value of cache) {
        yield value;
      }
    }
  }
}

/**
 * Makes an async iterator that yields the same value over and over again.
 * It will repeat indefinitely unless `times` is specified.
 *
 * ``` typescript
 * import { repeat } from "./infinite.ts";
 *
 * const iterable = repeat("v");
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following and keep going forever:
 *
 * ~~~
 * v
 * v
 * v
 * (...)
 * ~~~
 *
 * However, if you specify the second parameter `times` it will repeat that many
 * times:
 *
 * ``` typescript
 * import { repeat } from "./infinite.ts";
 *
 * const iterable = repeat("V", 3);
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 3 lines:
 *
 * ~~~
 * V
 * V
 * V
 * ~~~
 *
 * @param value The value to repeat.
 * @param times The number of times to repeat.  Defaults to `Infinity`.
 * @returns An async iterable that repeats the `value` indefinitely or
 *          `times` times.
 * @throws {RangeError} when `times` is not a non-negative integer.
 */
export function repeat<T>(
  value: T,
  times = Infinity,
): AsyncIterableIterator<T> {
  if (times === Infinity) return repeatIndefinitely(value);
  if (!Number.isInteger(times) || times < 0) {
    throw new RangeError("times must be a non-negative integer");
  }
  return repeatDefinitely(value, times);
}

async function* repeatDefinitely<T>(
  value: T,
  times: number,
): AsyncIterableIterator<T> {
  for (let i = 0; i < times; i++) yield value;
}

async function* repeatIndefinitely<T>(value: T): AsyncIterableIterator<T> {
  while (true) yield value;
}
