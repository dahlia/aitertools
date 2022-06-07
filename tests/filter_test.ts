import { filter } from "../filter.ts";
import { count } from "../infinite.ts";
import { assertStreams, assertStreamStartsWith } from "../testing.ts";
import { getAsyncIterable } from "./testing_test.ts";

Deno.test("filter()", async () => {
  await assertStreams(
    filter((value: number) => value % 2 === 0, getAsyncIterable(1, 2, 3, 4)),
    [2, 4],
  );
  await assertStreamStartsWith(
    filter((value: number) => Promise.resolve(value % 2 === 0), count(0, 5)),
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  );
  await assertStreamStartsWith(
    filter(
      (v: number, i: number) => Promise.resolve(v % 2 === 0 && i % 3 === 0),
      count(0, 3),
    ),
    [0, 18, 36, 54, 72, 90],
  );
});
