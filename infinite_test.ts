import { count } from "./infinite.ts";
import { assertStreamStartsWith } from "./testing.ts";

Deno.test("count()", async () => {
  await assertStreamStartsWith(count(0), [0, 1, 2, 3, 4, 5]);
  await assertStreamStartsWith(count(5), [5, 6, 7, 8, 9, 10]);
  await assertStreamStartsWith(count(1, 3), [1, 4, 7, 10, 13, 16]);
  await assertStreamStartsWith(count(5, 1.5), [5, 6.5, 8, 9.5, 11, 12.5]);
  await assertStreamStartsWith(count(100, -1), [100, 99, 98, 97, 96, 95]);
});
