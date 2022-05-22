/**
 * Creates an array from an async iterable.
 * @param source An async iterable to create an array from.  It must be finite.
 * @returns An array that contains the elements from the `source` iterable.
 */
export async function toArray<T>(source: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const value of source) result.push(value);
  return result;
}
