/**
 * Eliminate duplicates in an async iterable `source`.
 *
 * ``` typescript
 * import { unique } from "./unique.ts";
 *
 * async function* gen() { yield "foo"; yield "bar"; yield "bar"; yield "foo" }
 * const iterable = unique(gen());
 * for await (const value of iterable) console.log(value);
 * ```
 *
 * The above example will print the following 2 lines:
 *
 * ~~~
 * foo
 * bar
 * ~~~
 *
 * For complex elements, the `keySelector` function can be used to specify how
 * to compare the elements.   Among duplicate elements, the one with the first
 * occurrence of the key is kept.  E.g.:
 *
 * ``` typescript
 * import { unique } from "./unique.ts";
 *
 * async function* gen() {
 *   yield { id: 1, name: "foo" };
 *   yield { id: 2, name: "bar" };
 *   yield { id: 3, name: "bar" };
 *   yield { id: 4, name: "foo" };
 * }
 *
 * console.log("Unique by ID:");
 * const uniqueIds = unique(gen(), v => v.id);
 * for await (const value of uniqueIds) console.log(value);
 *
 * console.log("Unique by name:");
 * const uniqueNames = unique(gen(), v => v.name);
 * for await (const value of uniqueNames) console.log(value);
 * ```
 *
 * The above example will print the following:
 *
 * ~~~
 * Unique by ID:
 * { id: 1, name: "foo" }
 * { id: 2, name: "bar" }
 * { id: 3, name: "bar" }
 * { id: 4, name: "foo" }
 * Unique by name:
 * { id: 1, name: "foo" }
 * { id: 2, name: "bar" }
 * ~~~
 *
 * @template T The type of the elements in the iterable `source` and
 *             the returned async iterable.
 * @param source The async iterable to eliminate duplicates from.
 * @param keySelector An optional function to select the key for each element.
 *                    Among duplicate elements, the one with the first
 *                    occurrence of the key is kept.  If omitted, the identity
 *                    function is used.
 */
export async function* unique<T>(
  source: Iterable<T> | AsyncIterable<T>,
  keySelector?: (element: T) => unknown,
): AsyncIterableIterator<T> {
  const seen = new Set<unknown>();
  if (keySelector == null) {
    for await (const e of source) {
      if (seen.has(e)) continue;
      yield e;
      seen.add(e);
    }
  } else {
    for await (const e of source) {
      const key = keySelector(e);
      if (seen.has(key)) continue;
      yield e;
      seen.add(key);
    }
  }
}

/**
 * Groups elmenets of an async interable `source` according to a specified
 * `keySelector` function and creates a map of each group key to the elements in
 * that group.  Key values are compared using the `===` operator.
 *
 * ``` typescript
 * import { groupBy } from "./unique.ts";
 *
 * interface IdName { id: number; name: string; }
 * async function* gen(): AsyncIterableIterator<IdName> {
 *   yield { id: 1, name: "foo" };
 *   yield { id: 2, name: "bar" };
 *   yield { id: 3, name: "bar" };
 *   yield { id: 4, name: "foo" };
 * }
 *
 * const map = await groupBy<string, IdName>(gen(), o => o.name);
 * console.log(map);
 * ```
 *
 * The above example will print the following:
 *
 * ~~~
 * Map {
 *  "foo" => [ { id: 1, name: "foo" }, { id: 4, name: "foo" } ],
 *  "bar" => [ { id: 2, name: "bar" }, { id: 3, name: "bar" } ]
 * }
 * ~~~
 *
 * @template K The type of the grouping keys.
 * @template E The type of the elements in the `source`.
 * @param source An async iterable to group elements from.  It has to be finite.
 * @param keySelector A function to to extract the key for each element.  It can
 *                    be either sync or async.
 * @returns A map of each group key to the elements in that group.
 */
export async function groupBy<K, E>(
  source: Iterable<E> | AsyncIterable<E>,
  keySelector: (element: E) => K | Promise<K>,
): Promise<Map<K, E[]>> {
  const groups = new Map<K, E[]>();
  for await (const el of source) {
    let key = keySelector(el);
    if (key instanceof Promise) key = await key;
    const group = groups.get(key);
    if (group == null) groups.set(key, [el]);
    else group.push(el);
  }
  return groups;
}
