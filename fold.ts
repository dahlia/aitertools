/**
 * Apply `reducer` function of two arguments cumulatively to the elements of
 * an async iterable `source`, from left to right, so as to reduce the async
 * iterable to a single value.
 *
 * ``` typescript
 * import { reduce } from "./fold.ts";
 *
 * async function* oneToFive() { yield 1; yield 2; yield 3; yield 4; yield 5; }
 * const reducedValue = await reduce(
 *   (x, y) => { console.log(`${x} + ${y} = ${x + y}`); return x + y; },
 *   oneToFive(),
 *   0,
 * );
 * console.log("reduced value:", reducedValue);
 * ```
 *
 * The above example will print the following:
 *
 * ~~~
 * 0 + 1 = 1
 * 1 + 2 = 3
 * 3 + 3 = 6
 * 6 + 4 = 10
 * 10 + 5 = 15
 * reduced value: 15
 * ~~~
 *
 * If the async iterable `source` is empty, the `reducer` function is not
 * called and `initialValue` is returned.
 *
 * ``` typescript
 * import { reduce } from "./fold.ts";
 *
 * const reducedValue = await reduce(
 *   (x, y) => { console.log(`${x} + ${y} = ${x * y}`); return x * y; },
 *   [],
 *   1,
 * );
 * console.log("reduced value:", reducedValue);
 * ```
 *
 * The above example will print the following:
 *
 * ~~~
 * reduced value: 1
 * ~~~
 *
 * @param reducer A binary operation that accepts the previous reduction result
 *                and the next element in the async iterable, and returns
 *                the next reduction result.
 * @param source The async iterable to reduce over the elements into a single
 *               value.  It should be finite, and can be empty.
 * @param initialValue The initial value of the accumulator.  It's usually
 *                     the identity element for the `reducer` function,
 *                     e.g., `0` for `(x, y) => x + y`, or `1` for
 *                     `(x, y) => x * y`.  If `source` is empty, this value
 *                     is returned.
 * @returns The final result of the reduction.
 */
export function reduce<E, V>(
  reducer: (reducedValue: V, element: E) => V,
  source: Iterable<E> | AsyncIterable<E>,
  initialValue: V,
): Promise<V>;

/**
 * Apply `reducer` function of two arguments cumulatively to the elements of
 * an async iterable `source`, from left to right, so as to reduce the async
 * iterable to a single value.
 *
 * ``` typescript
 * import { reduce } from "./fold.ts";
 *
 * async function* oneToFive() { yield 1; yield 2; yield 3; yield 4; yield 5; }
 * const reducedValue = await reduce<number, number>(
 *   (x, y) => { console.log(`${x} + ${y} = ${x + y}`); return x + y; },
 *   oneToFive(),
 * );
 * console.log("reduced value:", reducedValue);
 * ```
 *
 * The above example will print the following:
 *
 * ~~~
 * 1 + 2 = 3
 * 3 + 3 = 6
 * 6 + 4 = 10
 * 10 + 5 = 15
 * reduced value: 15
 * ~~~
 *
 * If the async iterable `source` is empty, it throws an `TypeError`.
 *
 * ``` typescript
 * import { reduce } from "./fold.ts";
 *
 * const reducedValue = await reduce<number, number>(
 *   (x, y) => { console.log(`${x} + ${y} = ${x * y}`); return x * y; },
 *   [],
 * );
 * console.log("reduced value:", reducedValue);
 * ```
 *
 * The above example will print the following:
 *
 * ~~~
 * Uncaught TypeError: reduce without initialValue requires at least one element
 *     at reduce ...
 *     at async ...
 * ~~~
 *
 * @param reducer A binary operation that accepts the previous reduction result
 *                and the next element in the async iterable, and returns
 *                the next reduction result.
 * @param source The async iterable to reduce over the elements into a single
 *               value.  It should be finite, and must not be empty.  If you
 *               want to reduce a potentially empty async iterable,
 *               call the `reduce` function with an `initialValue`.
 * @returns The final result of the reduction.
 * @throws {TypeError} when the async iterable `source` is empty.
 */
export function reduce<E, V>(
  reducer: (reducedValue: E | V, element: E) => V,
  source: Iterable<E> | AsyncIterable<E>,
): Promise<E | V>;

export async function reduce<E, V>(
  reducer: (reducedValue: E | V, element: E) => V,
  source: Iterable<E> | AsyncIterable<E>,
  initialValue?: V,
) {
  let state:
    | { initialized: false }
    | { initialized: true; value: E | V } = arguments.length < 3
      ? { initialized: false }
      : { initialized: true, value: initialValue as V };
  for await (const element of source) {
    if (state.initialized) {
      state.value = reducer(state.value, element);
    } else {
      state = { initialized: true, value: element };
    }
  }
  if (state.initialized) return state.value;
  throw new TypeError(
    "reduce without initialValue requires at least one element",
  );
}
