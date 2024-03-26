import { assert, assertRejects } from "@std/assert";
import * as fc from "fast-check";
import { fromIterable, toArray } from "../src/collections.ts";
import { count } from "../src/infinite.ts";
import { range } from "../src/range.ts";
import { take, takeEnd, takeWhile } from "../src/take.ts";
import { assertStreams } from "../src/testing.ts";

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

Deno.test("takeEnd()", async () => {
  await assertStreams(takeEnd(range(5), 0), []);
  await assertStreams(takeEnd(range(5), 1), [4]);
  await assertStreams(takeEnd(range(5), 2), [3, 4]);
});

Deno.test("takeEnd() [fc]", async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.oneof(fc.array(fc.integer()), fc.array(fc.string())),
      fc.integer(),
      async (source: unknown[], count: number) => {
        await assertStreams(
          takeEnd(source, count),
          count > 0 ? source.slice(-count) : [],
        );
        await assertStreams(
          takeEnd(fromIterable(source), count),
          count > 0 ? source.slice(-count) : [],
        );
      },
    ),
  );

  await fc.assert(
    fc.asyncProperty(
      fc.oneof(fc.array(fc.integer()), fc.array(fc.string())),
      fc.constantFrom(Infinity, -Infinity, NaN),
      async (source: unknown[], count: number) => {
        await assertRejects(
          () => toArray(takeEnd(source, count)),
          RangeError,
        );
        await assertRejects(
          () => toArray(takeEnd(fromIterable(source), count)),
          RangeError,
        );
      },
    ),
  );

  await fc.assert(
    fc.asyncProperty(
      fc.oneof(fc.array(fc.integer()), fc.array(fc.string())),
      fc.double().filter((n) => !Number.isInteger(n)),
      async (source: unknown[], count: number) => {
        await assertRejects(
          () => toArray(takeEnd(source, count)),
          RangeError,
        );
        await assertRejects(
          () => toArray(takeEnd(fromIterable(source), count)),
          RangeError,
        );
      },
    ),
  );
});
