import { assertEquals, assertRejects } from "@std/assert";
import { reduce } from "../src/fold.ts";
import { getAsyncIterable } from "./testing_test.ts";

Deno.test("reduce()", async () => {
  assertEquals(
    await reduce<number, string>(
      (a, b) => `${a} ${b}`,
      getAsyncIterable(1, 2, 3, 4),
      ".",
    ),
    ". 1 2 3 4",
  );
  assertEquals(
    await reduce<number, string>(
      (a, b) => `${a} ${b}`,
      getAsyncIterable(),
      ".",
    ),
    ".",
  );
  assertEquals(
    await reduce<string, string>(
      (a, b) => `${a} ${b}`,
      getAsyncIterable("foo", "bar", "baz"),
    ),
    "foo bar baz",
  );
  assertEquals(
    await reduce<string, string>((a, b) => `${a} ${b}`, ["foo"]),
    "foo",
  );
  await assertRejects(
    () => reduce<number, number>((a, b) => a + b, getAsyncIterable()),
    TypeError,
    "without initialValue",
  );
});
