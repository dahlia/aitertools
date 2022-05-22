import { count } from "./infinite.ts";
import { take } from "./take.ts";
import { assertStreams } from "./testing.ts";

Deno.test("take()", async () => {
  await assertStreams(take(count(0), 3), [0, 1, 2]);
  await assertStreams(take(count(0, 2), 5), [0, 2, 4, 6, 8]);
  await assertStreams(take(take(count(0), 5), 3), [0, 1, 2]);
});
