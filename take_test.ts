import { count } from "./infinite.ts";
import { take, takeWhile } from "./take.ts";
import { assertStreams } from "./testing.ts";

Deno.test("take()", async () => {
  await assertStreams(take(count(0), 0), []);
  await assertStreams(take(count(0), 3), [0, 1, 2]);
  await assertStreams(take(count(0, 2), 5), [0, 2, 4, 6, 8]);
  await assertStreams(take(take(count(0), 5), 3), [0, 1, 2]);
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
