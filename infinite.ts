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
