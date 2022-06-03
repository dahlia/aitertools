import { assertEquals } from "https://deno.land/std@0.140.0/testing/asserts.ts";
import * as fc from "https://cdn.skypack.dev/fast-check@3.0.0?dts";
import { fromIterable, toArray } from "./collections.ts";
import { assertStreams } from "./testing.ts";
import { getAsyncIterable } from "./testing_testing.ts";

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
