import {
  assert,
  assertRejects,
} from "https://deno.land/std@0.207.0/assert/mod.ts";
import * as fc from "npm:fast-check@3.14.0";
import { fromIterable, toArray } from "../src/collections.ts";
import { drop, dropEnd, dropWhile } from "../src/drop.ts";
import { count } from "../src/infinite.ts";
import { range } from "../src/range.ts";
import { take } from "../src/take.ts";
import { assertStreams, assertStreamStartsWith } from "../src/testing.ts";

Deno.test("drop()", async () => {
  await assertStreamStartsWith(drop(count(0), 0), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  await assertStreamStartsWith(drop(count(0), 3), [3, 4, 5, 6, 7, 8, 9, 10]);
  await assertStreamStartsWith(drop(count(0, 2), 5), [10, 12, 14, 16, 18, 20]);
  await assertStreams(drop(take(count(0), 5), 3), [3, 4]);
});

Deno.test("drop() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb),
        fc.integer({ min: 0, max: 10 }),
        async (array, count) => {
          const iterable = fromIterable(array);
          await assertStreams(drop(iterable, count), array.slice(count));
        },
      ),
    );
  }
});

Deno.test("dropWhile()", async () => {
  await assertStreamStartsWith(
    dropWhile(count(0), (v) => v != 3),
    [3, 4, 5, 6, 7, 8, 9, 10, 11],
  );
  await assertStreamStartsWith(
    dropWhile(count(0, 2), (v) => v != 6),
    [6, 8, 10, 12, 14, 16, 18, 20],
  );
  await assertStreamStartsWith(
    dropWhile(count(5, 2), (v) => v != 9),
    [9, 11, 13, 15, 17, 19, 21, 23],
  );
  await assertStreamStartsWith(
    dropWhile(count(0), (v) => Promise.resolve(v != 3)),
    [3, 4, 5, 6, 7, 8, 9, 10, 11],
  );
  await assertStreamStartsWith(
    dropWhile(count(0, 2), (v) => Promise.resolve(v != 6)),
    [6, 8, 10, 12, 14, 16, 18, 20],
  );
  await assertStreamStartsWith(
    dropWhile(count(5, 2), (v) => Promise.resolve(v != 9)),
    [9, 11, 13, 15, 17, 19, 21, 23],
  );
  await assertStreams(
    dropWhile(["foo", "bar", "baz", "qux", "quux"], (v) => v != "baz"),
    ["baz", "qux", "quux"],
  );
});

Deno.test("dropWhile() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb),
        arb,
        fc.compareBooleanFunc(),
        async (array, fixedOperand, cmp) => {
          const pred = (o: unknown) => cmp(o, fixedOperand);
          const iterable = dropWhile(fromIterable(array), pred);
          let remain = 0;
          for await (const v of iterable) {
            if (remain < 1) assert(!pred(v));
            remain++;
          }
          for (let i = 0; i < array.length - remain; i++) {
            assert(
              pred(array[i]),
              `array[${i}] (${
                array[i]
              }) should be dropped; remained ${remain} out of ${array.length}`,
            );
          }
        },
      ),
    );
  }
});

Deno.test("dropEnd()", async () => {
  await assertStreams(dropEnd(range(5), 0), [0, 1, 2, 3, 4]);
  await assertStreams(dropEnd(range(5), 1), [0, 1, 2, 3]);
  await assertStreams(dropEnd(range(5), 2), [0, 1, 2]);
});

Deno.test("dropEnd() [fc]", async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.oneof(fc.array(fc.integer()), fc.array(fc.string())),
      fc.integer(),
      async (source: unknown[], count: number) => {
        await assertStreams(
          dropEnd(source, count),
          count > 0 ? source.slice(0, -count) : source,
        );
        await assertStreams(
          dropEnd(fromIterable(source), count),
          count > 0 ? source.slice(0, -count) : source,
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
          () => toArray(dropEnd(source, count)),
          RangeError,
        );
        await assertRejects(
          () => toArray(dropEnd(fromIterable(source), count)),
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
          () => toArray(dropEnd(source, count)),
          RangeError,
        );
        await assertRejects(
          () => toArray(dropEnd(fromIterable(source), count)),
          RangeError,
        );
      },
    ),
  );
});
