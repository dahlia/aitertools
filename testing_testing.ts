import {
  AssertionError,
  assertRejects,
} from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { assertStreams, assertStreamStartsWith } from "./testing.ts";

export async function* getAsyncIterable<T>(
  ...args: T[]
): AsyncIterableIterator<T> {
  for (const arg of args) {
    yield arg;
  }
}

async function* getInfiniteIterable(): AsyncIterableIterator<number> {
  for (let i = 0; true; i++) yield i;
}

Deno.test("assertStreams()", async () => {
  await assertStreams(getAsyncIterable<unknown>(), []);
  await assertStreams(getAsyncIterable(1, 9, 8, 4), [1, 9, 8, 4]);
  await assertStreams(getAsyncIterable("foo", "bar"), ["foo", "bar"]);
  await assertRejects(
    () => assertStreams(getAsyncIterable(1, 9, 8, 7), [1, 9, 8, 4]),
    AssertionError,
  );
});

Deno.test("assertStreamStartsWith()", async () => {
  await assertStreamStartsWith(getAsyncIterable<unknown>(), []);
  await assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), []);
  await assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), [1]);
  await assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), [1, 9]);
  await assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), [1, 9, 8]);
  await assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), [1, 9, 8, 4]);
  await assertStreamStartsWith(getAsyncIterable("foo", "bar"), []);
  await assertStreamStartsWith(getAsyncIterable("foo", "bar"), ["foo"]);
  await assertStreamStartsWith(getAsyncIterable("foo", "bar"), ["foo", "bar"]);
  await assertStreamStartsWith(getInfiniteIterable(), [0]);
  await assertStreamStartsWith(getInfiniteIterable(), [0, 1]);
  await assertStreamStartsWith(getInfiniteIterable(), [0, 1, 2]);
  await assertStreamStartsWith(getInfiniteIterable(), [0, 1, 2, 3]);
  await assertRejects(
    () => assertStreamStartsWith(getAsyncIterable(), [1]),
    AssertionError,
  );
  await assertRejects(
    () => assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), [9]),
    AssertionError,
  );
  await assertRejects(
    () => assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), [1, 9, 9]),
    AssertionError,
  );
  await assertRejects(
    () => assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), [1, 9, 8, 7]),
    AssertionError,
  );
  await assertRejects(
    () => assertStreamStartsWith(getAsyncIterable(1, 9, 8, 4), [1, 9, 8, 4, 0]),
    AssertionError,
  );
  await assertRejects(
    () => assertStreamStartsWith(getAsyncIterable("foo", "bar"), ["bar"]),
    AssertionError,
  );
  await assertRejects(
    () =>
      assertStreamStartsWith(getAsyncIterable("foo", "bar"), ["foo", "baz"]),
    AssertionError,
  );
  await assertRejects(
    () =>
      assertStreamStartsWith(getAsyncIterable("foo", "bar"), [
        "foo",
        "bar",
        "baz",
      ]),
    AssertionError,
  );
  await assertRejects(
    () => assertStreamStartsWith(getInfiniteIterable(), [1]),
    AssertionError,
  );
  await assertRejects(
    () => assertStreamStartsWith(getInfiniteIterable(), [0, 1, 2, 9]),
    AssertionError,
  );
});
