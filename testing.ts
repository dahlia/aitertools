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
