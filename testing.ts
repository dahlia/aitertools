import { assertEquals } from "https://deno.land/std@0.140.0/testing/asserts.ts";

/**
 * Makes an assertion that the elements of the `actual` iterable are equal to
 * the elements of the `expected` array.
 * @param actual The async iterable to compare.  It must be finite.
 * @param expected The array that contains the expected elements.
 */
export async function assertStreams<T>(
  actual: AsyncIterable<T>,
  expected: T[],
): Promise<void> {
  const elements: T[] = [];
  for await (const value of actual) elements.push(value);
  assertEquals(elements, expected);
}

/**
 * Makes an assertion that the beginning elements of the `actual` iterable are
 * in common with the elements of the `expected` array.
 * @param actual The async iterable to compare.  It can be either finite or
 *               infinite.
 * @param expected The array that contains the expected beginning elements.
 */
export async function assertStreamStartsWith<T>(
  actual: AsyncIterable<T>,
  expected: T[],
): Promise<void> {
  const elements: T[] = [];
  for await (const value of actual) {
    elements.push(value);
    if (elements.length >= expected.length) break;
  }
  assertEquals(elements.slice(0, expected.length), expected);
}
