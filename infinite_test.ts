import { assertThrows } from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { count, cycle, repeat } from "./infinite.ts";
import { assertStreams, assertStreamStartsWith } from "./testing.ts";

Deno.test("count()", async () => {
  await assertStreamStartsWith(count(0), [0, 1, 2, 3, 4, 5]);
  await assertStreamStartsWith(count(5), [5, 6, 7, 8, 9, 10]);
  await assertStreamStartsWith(count(1, 3), [1, 4, 7, 10, 13, 16]);
  await assertStreamStartsWith(count(5, 1.5), [5, 6.5, 8, 9.5, 11, 12.5]);
  await assertStreamStartsWith(count(100, -1), [100, 99, 98, 97, 96, 95]);
});

Deno.test("cycle()", async () => {
  await assertStreamStartsWith(
    cycle(["foo", "bar", "baz"]),
    ["foo", "bar", "baz", "foo", "bar", "baz", "foo", "bar", "baz", "foo"],
  );

  async function* gen() {
    yield 3;
    yield 6;
    yield 9;
  }

  await assertStreamStartsWith(
    cycle(gen()),
    [3, 6, 9, 3, 6, 9, 3, 6, 9, 3, 6, 9, 3, 6, 9, 3, 6, 9, 3, 6, 9, 3, 6, 9, 3],
  );
});

Deno.test("repeat()", async () => {
  await assertStreamStartsWith(repeat("v"), ["v", "v", "v", "v", "v", "v"]);
  await assertStreams(repeat("V", 3), ["V", "V", "V"]);
  await assertStreams(repeat("V", 5), ["V", "V", "V", "V", "V"]);
  await assertStreams(repeat("V", 0), []);
  assertThrows(() => repeat("V", 2.5), RangeError);
  assertThrows(() => repeat("V", -1), RangeError);
  assertThrows(() => repeat("V", -Infinity), RangeError);
});
