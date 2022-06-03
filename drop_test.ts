import { drop, dropWhile } from "./drop.ts";
import { count } from "./infinite.ts";
import { take } from "./take.ts";
import { assertStreams, assertStreamStartsWith } from "./testing.ts";

Deno.test("drop()", async () => {
  await assertStreamStartsWith(drop(count(0), 0), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  await assertStreamStartsWith(drop(count(0), 3), [3, 4, 5, 6, 7, 8, 9, 10]);
  await assertStreamStartsWith(drop(count(0, 2), 5), [10, 12, 14, 16, 18, 20]);
  await assertStreams(drop(take(count(0), 5), 3), [3, 4]);
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
