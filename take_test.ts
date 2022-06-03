import * as fc from "https://cdn.skypack.dev/fast-check@3.0.0?dts";
import { assert } from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { fromIterable } from "./collections.ts";
import { count } from "./infinite.ts";
import { take, takeWhile } from "./take.ts";
import { assertStreams } from "./testing.ts";

Deno.test("take()", async () => {
  await assertStreams(take(count(0), 0), []);
  await assertStreams(take(count(0), 3), [0, 1, 2]);
  await assertStreams(take(count(0, 2), 5), [0, 2, 4, 6, 8]);
  await assertStreams(take(take(count(0), 5), 3), [0, 1, 2]);
});

Deno.test("take() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb),
        fc.integer({ min: 0, max: 10 }),
        async (array, count) => {
          const iterable = fromIterable(array);
          await assertStreams(take(iterable, count), array.slice(0, count));
        },
      ),
    );
  }
});

Deno.test("takeWhile()", async () => {
  await assertStreams(takeWhile(count(0), (_) => false), []);
  await assertStreams(takeWhile(count(0), (v) => v < 3), [0, 1, 2]);
  await assertStreams(takeWhile(count(0, 2), (v) => v < 5), [0, 2, 4]);
  await assertStreams(takeWhile(count(5, 2), (_, i) => i < 3), [5, 7, 9]);
  await assertStreams(
    takeWhile(count(0), (v) => Promise.resolve(v < 3)),
    [0, 1, 2],
  );
  await assertStreams(
    takeWhile(count(0, 2), (v) => Promise.resolve(v < 5)),
    [0, 2, 4],
  );
  await assertStreams(
    takeWhile(count(5, 2), (_, i) => Promise.resolve(i < 3)),
    [5, 7, 9],
  );
});

Deno.test("takeWhile() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb),
        arb,
        fc.compareBooleanFunc(),
        async (array, fixedOperand, cmp) => {
          const pred = (o: unknown) => cmp(o, fixedOperand);
          const iterable = takeWhile(fromIterable(array), pred);
          let taken = 0;
          for await (const v of iterable) {
            assert(pred(v));
            taken++;
          }
          assert(
            taken === array.length || !pred(array[taken]),
            `array[${taken}] (${
              array[taken]
            }) should be taken; taken ${taken} out of ${array.length}`,
          );
        },
      ),
    );
  }
});
