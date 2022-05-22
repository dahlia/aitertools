import { assertEquals } from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { toArray } from "./collections.ts";
import { getAsyncIterable } from "./testing_testing.ts";

Deno.test("toArray()", async () => {
  assertEquals(await toArray(getAsyncIterable(1, 2, 3)), [1, 2, 3]);
  assertEquals(await toArray(getAsyncIterable("foo", "bar", "baz")), [
    "foo",
    "bar",
    "baz",
  ]);
});
