import { assertEquals } from "@std/assert";
import * as fc from "fast-check";
import { fromIterable, toArray, toMap, toSet } from "../src/collections.ts";
import { assertStreams } from "../src/testing.ts";
import { getAsyncIterable } from "./testing_test.ts";

function* toIterable<T>(...values: T[]): Iterable<T> {
  yield* values;
}

Deno.test("fromIterable()", async () => {
  await assertStreams(fromIterable([]), []);
  await assertStreams(fromIterable(toIterable()), []);
  await assertStreams(fromIterable([1, 2, 3]), [1, 2, 3]);
  await assertStreams(fromIterable(toIterable(1, 2, 3)), [1, 2, 3]);
  await assertStreams(fromIterable(["foo", "bar", "baz"]), [
    "foo",
    "bar",
    "baz",
  ]);
  await assertStreams(fromIterable(toIterable("foo", "bar", "baz")), [
    "foo",
    "bar",
    "baz",
  ]);
});

Deno.test("fromIterable() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb),
        async (array) => {
          await assertStreams(getAsyncIterable.apply(globalThis, array), array);
          await assertStreams(fromIterable(array), array);
          const iterable = toIterable.apply(globalThis, array);
          await assertStreams(fromIterable(iterable), array);
        },
      ),
    );
  }
});

Deno.test("toArray()", async () => {
  assertEquals(await toArray(getAsyncIterable(1, 2, 3)), [1, 2, 3]);
  assertEquals(await toArray(getAsyncIterable("foo", "bar", "baz")), [
    "foo",
    "bar",
    "baz",
  ]);
});

Deno.test("toArray() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb),
        async (array) => {
          const iterable = getAsyncIterable.apply(globalThis, array);
          assertEquals(await toArray(iterable), array);
        },
      ),
    );
  }
});

Deno.test("toSet()", async () => {
  assertEquals(await toSet(getAsyncIterable(1, 2, 3)), new Set([1, 2, 3]));
  assertEquals(
    await toSet(getAsyncIterable("foo", "bar", "baz", "qux")),
    new Set(["foo", "bar", "baz", "qux"]),
  );
  assertEquals(
    await toSet(getAsyncIterable("foo", "bar", "baz", "qux", "foo", "bar")),
    new Set(["foo", "bar", "baz", "qux"]),
  );
});

Deno.test("toSet() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb),
        async (array) => {
          const iterable = getAsyncIterable.apply(globalThis, array);
          assertEquals(await toSet(iterable), new Set(array));
          const dups = getAsyncIterable.apply(globalThis, [...array, ...array]);
          assertEquals(await toSet(dups), new Set(array));
        },
      ),
    );
  }
});

Deno.test("toMap()", async () => {
  assertEquals(
    await toMap(getAsyncIterable(["foo", 1], ["bar", 2], ["baz", 3])),
    new Map([["foo", 1], ["bar", 2], ["baz", 3]]),
  );
  assertEquals(
    await toMap(getAsyncIterable(["foo", 1], ["bar", 2], ["foo", 3])),
    new Map([["foo", 3], ["bar", 2]]),
  );
});

Deno.test("toMap() [fc]", async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.array(fc.tuple(fc.string(), fc.string())),
      async (tuples) => {
        const iterable = fromIterable(tuples);
        assertEquals(await toMap(iterable), new Map(tuples));
        if (tuples.length < 1) return;
        const dups = fromIterable(
          [...tuples, [tuples[0][0], "overwritten"]] as [string, string][],
        );
        const expected = new Map(tuples);
        expected.set(tuples[0][0], "overwritten");
        assertEquals(await toMap(dups), expected);
      },
    ),
  );
});
