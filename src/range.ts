/**
 * Creates a {@link Range} of numbers from 0 to `stop` with step 1.
 *
 * ``` typescript
 * import { range } from "./range.ts";
 *
 * for (const value of range(4)) console.log(value);
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
 * Note that the type of the range is `Range<number>`, which implements
 * both `Iterable<number>` and `AsyncIterable<number>`.
 *
 * @param stop The stop of the range.
 */
export function range(stop: number): Range<number>;

/**
 * Creates a {@link Range} of bigints from 0 to `stop` with step 1.
 *
 * ``` typescript
 * import { range } from "./range.ts";
 *
 * for (const value of range(4n)) console.log(value);
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
 * Note that the type of the range is `Range<bigint>`, which implements
 * both `Iterable<bigint>` and `AsyncIterable<bigint>`.
 *
 * @param stop The stop of the range.
 */
export function range(stop: bigint): Range<bigint>;

/**
 * Creates a {@link Range} of numbers with step 1.
 *
 * ``` typescript
 * import { range } from "./range.ts";
 *
 * for (const value of range(2, 5)) console.log(value);
 * ```
 *
 * The above example will print the following 3 lines:
 *
 * ~~~
 * 2
 * 3
 * 4
 * ~~~
 *
 * Note that the type of the range is `Range<number>`, which implements
 * both `Iterable<number>` and `AsyncIterable<number>`.
 *
 * @param start The start of the range.
 * @param stop The stop of the range.
 */
export function range(start: number, stop: number): Range<number>;

/**
 * Creates a {@link Range} of bigints with step 1.
 *
 * ``` typescript
 * import { range } from "./range.ts";
 *
 * for (const value of range(2n, 5n)) console.log(value);
 * ```
 *
 * The above example will print the following 3 lines:
 *
 * ~~~
 * 2
 * 3
 * 4
 * ~~~
 *
 * Note that the type of the range is `Range<bigint>`, which implements
 * both `Iterable<bigint>` and `AsyncIterable<bigint>`.
 *
 * @param start The start of the range.
 * @param stop The stop of the range.
 */
export function range(start: bigint, stop: bigint): Range<bigint>;

/**
 * Creates a {@link Range} of numbers.
 *
 * ``` typescript
 * import { range } from "./range.ts";
 *
 * for (const value of range(10, -10, -3.5)) console.log(value);
 * ```
 *
 * The above example will print the following 6 lines:
 *
 * ~~~
 * 10
 * 6.5
 * 3
 * -0.5
 * -4
 * -7.5
 * ~~~
 *
 * Note that the type of the range is `Range<number>`, which implements
 * both `Iterable<number>` and `AsyncIterable<number>`.
 *
 * @param start The start of the range.  It must be a finite number.
 * @param stop The stop of the range.  It must be a finite number.
 * @param step The step of the range.  It must be a finite number,
 *             and cannot be zero.
 */
export function range(start: number, stop: number, step: number): Range<number>;

/**
 * Creates a {@link Range} of bigints.
 *
 * ``` typescript
 * import { range } from "./range.ts";
 *
 * for (const value of range(10n, -10n, -5n)) console.log(value);
 * ```
 *
 * The above example will print the following 4 lines:
 *
 * ~~~
 * 10
 * 5
 * 0
 * -5
 * ~~~
 *
 * Note that the type of the range is `Range<bigint>`, which implements
 * both `Iterable<bigint>` and `AsyncIterable<bigint>`.
 *
 * @param start The start of the range.
 * @param stop The stop of the range.
 * @param step The step of the range.  Cannot be zero.
 * @returns A {@link Range} of bigints.
 */
export function range(start: bigint, stop: bigint, step: bigint): Range<bigint>;

export function range<T extends number | bigint>(start: T, stop?: T, step?: T) {
  if (step === 0 || step === 0n) throw new RangeError("step cannot be zero");
  else if (typeof step === "undefined") {
    step = (typeof start === "bigint" ? 1n : 1) as T;
  }
  if (typeof stop === "undefined") {
    stop = start;
    if (typeof start === "bigint") start = 0n as T;
    else start = 0 as T;
  }

  return new Range(start, stop, step);
}

function validateNumber(n: number | bigint): boolean {
  return typeof n === "bigint" || Number.isFinite(n);
}

/**
 * An immutable sequence of numbers.  It implements both `Iterable` and
 * `AsyncIterable`.
 *
 * It is similar to Python's `range()` function.
 * @template T The type of the elements in the range.  It must be either
 *             `number` or `bigint`.
 */
export class Range<T extends number | bigint>
  implements Iterable<T>, AsyncIterable<T> {
  /**
   * The start of the range.  It must be a finite number.
   */
  readonly start: T;

  /**
   * The stop of the range.  It must be a finite number.
   */
  readonly stop: T;

  /**
   * The step of the range.  It must be a finite number, and cannot be zero.
   */
  readonly step: T;

  /**
   * Constructs a new `Range` object.
   * @param start The start of the range.  It must be a finite number.
   * @param stop The stop of the range.  It must be a finite number.
   * @param step The step of the range.  It must be a finite number,
   *             and cannot be zero.
   */
  constructor(start: T, stop: T, step: T) {
    if (step === 0 || step === 0n) throw new RangeError("step cannot be zero");
    else if (!validateNumber(start)) throw new RangeError("start is invalid");
    else if (!validateNumber(stop)) throw new RangeError("stop is invalid");
    else if (!validateNumber(step)) throw new RangeError("step is invalid");
    else if (typeof start !== typeof stop || typeof start !== typeof step) {
      throw new TypeError("start, stop, and step must be the same type");
    }

    this.start = start;
    this.stop = stop;
    this.step = step;
  }

  #stepIsNegative(): boolean {
    return typeof this.step === "bigint" ? this.step < 0n : this.step < 0;
  }

  #stepIsPositive(): boolean {
    return typeof this.step === "bigint" ? this.step > 0n : this.step > 0;
  }

  /**
   * The length of the range.  Note that it guarantees to return the same value
   * as `Array.from(range).length`.
   *
   * ``` typescript
   * import { range } from "./range.ts";
   *
   * console.log(range(10, -10, -3.5).length);
   * ```
   *
   * The above example will print `6`.
   *
   * @returns The number of elements in the range.
   */
  get length(): number {
    if (this.#stepIsNegative() && this.start <= this.stop) return 0;
    else if (this.#stepIsPositive() && this.start >= this.stop) return 0;
    const amount = this.stop - this.start;
    return typeof amount == "number" ? Math.ceil(amount / this.step) : Number(
      amount / (this.step as bigint) +
        (amount % (this.step as bigint) === 0n ? 0n : 1n),
    );
  }

  /**
   * Iterates over the elements of the range.
   *
   * ``` typescript
   * import { range } from "./range.ts";
   *
   * for (const value of range(4n)) console.log(value);
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
   * @return An iterator that iterates over the elements of the range.
   */
  *[Symbol.iterator](): Iterator<T> {
    if (this.#stepIsNegative() && this.start <= this.stop) return;
    else if (this.#stepIsPositive() && this.start >= this.stop) return;
    let i = typeof this.start === "bigint" ? 0n : 0, v = this.start;
    const length = this.length;
    while (i < length) {
      v = (this.start as number) + (this.step as number) * (i as number) as T;
      yield v as T;
      i++;
    }
  }

  /**
   * Iterates over the elements of the range, in an asynchronous manner.
   *
   * ``` typescript
   * import { range } from "./range.ts";
   *
   * for await (const value of range(4)) console.log(value);
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
   * @return An async iterator that iterates over the elements of the range.
   */
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    for (const value of this) yield value;
  }

  /**
   * Returns the element at the specified index in the range.  Note that it
   * guarantees to return the same value as `Array.from(range).at(index)`.
   *
   * ``` typescript
   * import { range } from "./range.ts";
   *
   * const r = range(10, -10, -3.5);
   * console.log(r.at(3), r.at(-1));
   * ```
   *
   * The above example will print the following 2 lines:
   *
   * ~~~
   * -0.5
   * -7.5
   * ~~~
   *
   * @param index The index of the element to return.  If it is negative, it
   *              counts from the end of the range.
   * @returns The element at the specified index in the range.  If the index is
   *          out of range, `undefined` is returned.
   */
  at(index: number): T | undefined {
    if (!Number.isSafeInteger(index)) return undefined;
    if (this.#stepIsNegative() && this.start <= this.stop) return undefined;
    if (this.#stepIsPositive() && this.start >= this.stop) return undefined;
    if (index < 0) index += this.length;
    if (index >= this.length || index < 0) return undefined;
    if (typeof this.start === "bigint" && typeof this.step === "bigint") {
      return this.start + this.step * BigInt(index) as T;
    }
    return (this.start as number) + (this.step as number) * index as T;
  }

  /**
   * Represents the range as a string.
   * @returns A string representation of the range.
   */
  toString(): string {
    const suffix = typeof this.start === "bigint" ? "n" : "";
    return `[object Range(${this.start}${suffix}, ${this.stop}${suffix}, ` +
      `${this.step}${suffix})]`;
  }
}
