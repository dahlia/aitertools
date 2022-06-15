import { assertEquals } from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { tee } from "../tee.ts";
import { assertStreams } from "../testing.ts";
import { groupBy, unique } from "../unique.ts";
import { getAsyncIterable } from "./testing_test.ts";

Deno.test("unqiue(source)", async () => {
  await assertStreams(
    unique(getAsyncIterable("foo", "bar", "baz")),
    ["foo", "bar", "baz"],
  );
  await assertStreams(
    unique(getAsyncIterable("foo", "bar", "baz", "baz", "foo")),
    ["foo", "bar", "baz"],
  );

  const a = {}, b = {}, c = {};
  await assertStreams(
    unique(getAsyncIterable(a, b, c)),
    [a, b, c],
  );
  await assertStreams(
    unique(getAsyncIterable(a, b, c, b, a)),
    [a, b, c],
  );
});

Deno.test("unique(source, key)", async () => {
  await assertStreams(
    unique(getAsyncIterable("foo", "bar", "baz"), (s) => s.length),
    ["foo"],
  );
  await assertStreams(
    unique(
      getAsyncIterable("foo", "bar", "baz", "qux", "quux"),
      (s) => s.length,
    ),
    ["foo", "quux"],
  );
});

Deno.test(`groupBy()`, async () => {
  const iterable = getAsyncIterable<{ id: number; name: string }>(
    { id: 1, name: "foo" },
    { id: 2, name: "bar" },
    { id: 3, name: "bar" },
    { id: 4, name: "foo" },
  );
  const [sourceA, sourceB] = tee(iterable, 2);
  const expected = new Map();
  expected.set("foo", [
    { id: 1, name: "foo" },
    { id: 4, name: "foo" },
  ]);
  expected.set("bar", [
    { id: 2, name: "bar" },
    { id: 3, name: "bar" },
  ]);
  let actual = await groupBy(sourceA, (o) => o.name);
  assertEquals(actual, expected);
  actual = await groupBy(sourceB, (o) => Promise.resolve(o.name));
  assertEquals(actual, expected);
});
