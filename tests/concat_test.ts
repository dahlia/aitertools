import * as fc from "npm:fast-check@3.14.0";
import { fromIterable } from "../collections.ts";
import { concat } from "../concat.ts";
import { assertStreams } from "../testing.ts";
import { getAsyncIterable } from "./testing_test.ts";

Deno.test("concat()", async () => {
  await assertStreams(concat(), []);
  await assertStreams(concat(getAsyncIterable(1, 2, 3)), [1, 2, 3]);
  await assertStreams(
    concat(getAsyncIterable(1, 2, 3), getAsyncIterable(4, 5, 6)),
    [1, 2, 3, 4, 5, 6],
  );
  await assertStreams(
    concat(getAsyncIterable(1, 2, 3), getAsyncIterable(4, 5, 6), [7, 8]),
    [1, 2, 3, 4, 5, 6, 7, 8],
  );
});

Deno.test("concat() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb),
        fc.array(arb),
        fc.array(arb),
        async (a, b, c) => {
          await assertStreams(concat(), []);
          await assertStreams(concat(fromIterable(a)), a);
          await assertStreams(concat(fromIterable(b)), b);
          await assertStreams(
            concat(fromIterable(a), fromIterable(b)),
            [...a, ...b],
          );
          await assertStreams(
            concat(fromIterable(b), fromIterable(a)),
            [...b, ...a],
          );
          await assertStreams(
            concat(fromIterable(a), fromIterable(b), fromIterable(c)),
            [...a, ...b, ...c],
          );
          await assertStreams(
            concat(fromIterable(b), fromIterable(c), fromIterable(a)),
            [...b, ...c, ...a],
          );
        },
      ),
    );
  }
});
