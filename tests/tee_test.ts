import * as fc from "fast-check";
import { fromIterable } from "../src/collections.ts";
import { tee } from "../src/tee.ts";
import { assertStreams, assertStreamStartsWith } from "../src/testing.ts";

async function* getRandomNumbers(): AsyncIterableIterator<number> {
  while (true) yield Math.random();
}

Deno.test("tee()", async () => {
  const [a, b, c] = tee(getRandomNumbers(), 3);
  const values: number[] = [];
  for await (const v of a) {
    values.push(v);
    if (values.length >= 100) break;
  }
  await assertStreamStartsWith(b, values);
  await assertStreamStartsWith(c, values);
});

Deno.test("tee() [fc]", async () => {
  const arbs: fc.Arbitrary<unknown>[] = [fc.integer(), fc.string()];
  for (const arb of arbs) {
    await fc.assert(
      fc.asyncProperty(
        fc.array(arb, { size: "large" }),
        fc.integer({ min: 0, max: 10 }),
        async (array, num) => {
          const iterable = fromIterable(array);
          const streams = tee(iterable, num);
          await Promise.all(
            streams.map((stream) => assertStreams(stream, array)),
          );
        },
      ),
    );
  }
});
