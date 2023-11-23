import { fromIterable } from "./collections.ts";

export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: 2,
): [AsyncIterableIterator<T>, AsyncIterableIterator<T>];

export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: 3,
): [
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
];

export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: 4,
): [
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
];

export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: 5,
): [
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
];

export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: 6,
): [
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
];

export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: 7,
): [
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
];

export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: 8,
): [
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
  AsyncIterableIterator<T>,
];

/**
 * Effectively duplicates an async iterable into multiple async iterables.
 * It guarantees that the async iterable `source` will be iterated in the same
 * order in all the duplicated async iterables, and the `source` will be only
 * iterated once.
 *
 * ``` typescript
 * import { tee } from "./tee.ts";
 *
 * async function* source() {
 *   console.log("Yielding 1...");
 *   yield 1;
 *   console.log("Yielding 2...");
 *   yield 2;
 *   console.log("Yielding 3...");
 *   yield 3;
 * }
 *
 * const [a, b, c] = tee(source(), 3);
 * for await (const value of a) console.log('a:', value);
 * for await (const value of b) console.log('b:', value);
 * for await (const value of c) console.log('c:', value);
 * ```
 *
 * The above example will print the following:
 *
 * ~~~
 * Yielding 1...
 * a: 1
 * Yielding 2...
 * a: 2
 * Yielding 3...
 * a: 3
 * b: 1
 * b: 2
 * b: 3
 * c: 1
 * c: 2
 * c: 3
 * ~~~
 *
 * Note that `console.log()` calls in the `source` function are executed only
 * once, and not three times.  Also these numbers are always in the same order.
 *
 * @template T The type of the elements in the `source` and the returned async
 *             iterables.
 * @param source The async iterable to duplicate.
 * @param number The number to duplicate the async iterable.
 * @returns An array of duplicated async iterables.
 */
export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: number,
): AsyncIterableIterator<T>[];

export function tee<T>(
  source: Iterable<T> | AsyncIterable<T>,
  number: number,
): AsyncIterableIterator<T>[] {
  if (number < 1) return [];
  else if (number === 1) return [fromIterable(source)];

  const queues: T[][] = [];
  for (let i = 0; i < number; i++) queues.push([]);
  const iterator = teePub(fromIterable(source), queues);
  const streams: AsyncIterableIterator<T>[] = [];
  for (let i = 0; i < number; i++) streams.push(teeSub(i, iterator, queues));
  return streams;
}

async function* teePub<T>(
  iterator: AsyncIterableIterator<T>,
  queues: T[][],
): AsyncIterableIterator<T> {
  for await (const value of iterator) {
    for (const queue of queues) queue.push(value);
    yield value;
  }
}

async function* teeSub<T>(
  index: number,
  source: AsyncIterator<T>,
  queues: T[][],
): AsyncIterableIterator<T> {
  const queue = queues[index];
  while (true) {
    while (queue.length > 0) yield queue.shift()!;
    const { done } = await source.next();
    if (done) {
      while (queue.length > 0) yield queue.shift()!;
      break;
    }
    while (queue.length > 0) yield queue.shift()!;
  }
}
