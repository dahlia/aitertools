import { assertRejects } from "https://deno.land/std@0.207.0/assert/mod.ts";
import { count, repeat } from "../src/infinite.ts";
import { map } from "../src/map.ts";
import { assertStreams, assertStreamStartsWith } from "../src/testing.ts";

Deno.test("map()", async () => {
  await assertStreams(
    map(
      (s: string) => Promise.resolve(s.toUpperCase()),
      ["foo", "bar", "baz", "qux"],
    ),
    ["FOO", "BAR", "BAZ", "QUX"],
  );
  await assertStreamStartsWith(
    map((v: number) => v + 1, count(5, 2)),
    [6, 8, 10, 12],
  );
  await assertStreams(
    map(
      (s: string, n: number) => `${s.toUpperCase()}-${n}`,
      ["foo", "bar", "baz", "qux"],
      count(),
    ),
    ["FOO-0", "BAR-1", "BAZ-2", "QUX-3"],
  );
  await assertStreams(
    map(
      (s, n, p) => Promise.resolve(`${s.toUpperCase()}-${n}${p}`),
      ["foo", "bar", "baz", "qux"],
      count(),
      repeat("."),
    ),
    ["FOO-0.", "BAR-1.", "BAZ-2.", "QUX-3."],
  );
  await assertStreams(
    map(
      (s, n, n2, p) => `${s.toUpperCase()}-${n}-${n2}${p}`,
      ["foo", "bar", "baz", "qux"],
      count(),
      count(5, 3),
      repeat("."),
    ),
    ["FOO-0-5.", "BAR-1-8.", "BAZ-2-11.", "QUX-3-14."],
  );
  await assertStreams(
    map(
      (s, n, n2, p, c) =>
        `${c ? s.toUpperCase() : s.toLowerCase()}-${n}-${n2}${p}`,
      ["Foo", "Bar", "Baz", "Qux"],
      count(),
      count(5, 3),
      repeat("."),
      [false, true, false, true],
    ),
    ["foo-0-5.", "BAR-1-8.", "baz-2-11.", "QUX-3-14."],
  );
  await assertRejects(
    async () => {
      // deno-lint-ignore no-explicit-any
      for await (const _ of (map as any)(() => 1));
    },
    TypeError,
    "map requires at least one source",
  );
});
