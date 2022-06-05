import { assertEquals } from "https://deno.land/std@0.140.0/testing/asserts.ts";

/**
 * Makes an assertion that the elements of the `actual` iterable are equal to
 * the elements of the `expected` array.
 *
 * ``` typescript
 * import { assertStreams } from "./testing.ts";
 *
 * async function* gen() { yield "actual"; yield "elements"; }
 *
 * Deno.test("your test name", async () => {
 *   const stream = gen();
 *   await assertStreams(stream, ["actual", "elements"]);
 * });
 * ```
 *
 * @template T The type of the elements in the `actual` async iterable and the
 *             `expected` array.
 * @param actual The async iterable to compare.  It must be finite.
 * @param expected The array that contains the expected elements.
 * @param msg Optional string message to display if the assertion fails.
 */
export async function assertStreams<T>(
  actual: AsyncIterable<T>,
  expected: T[],
  msg?: string,
): Promise<void> {
  const elements: T[] = [];
  for await (const value of actual) elements.push(value);
  assertEquals(elements, expected, msg);
}

/**
 * Makes an assertion that the beginning elements of the `actual` iterable are
 * in common with the elements of the `expected` array.
 *
 * ``` typescript
 * import { assertStreamStartsWith } from "./testing.ts";
 * import { count } from "./infinite.ts";
 *
 * Deno.test("your test name", async () => {
 *   const stream = count(0, 5);
 *   await assertStreamStartsWith(stream, [0, 5, 10, 15]);
 * });
 * ```
 *
 * @template T The type of the elements in the `actual` async iterable and the
 *             `expected` array.
 * @param actual The async iterable to compare.  It can be either finite or
 *               infinite.
 * @param expected The array that contains the expected beginning elements.
 * @param msg Optional string message to display if the assertion fails.
 */
export async function assertStreamStartsWith<T>(
  actual: AsyncIterable<T>,
  expected: T[],
  msg?: string,
): Promise<void> {
  const elements: T[] = [];
  for await (const value of actual) {
    elements.push(value);
    if (elements.length >= expected.length) break;
  }
  assertEquals(elements.slice(0, expected.length), expected, msg);
}
