import { assertStreams } from "../testing.ts";
import { unique } from "../unique.ts";
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
