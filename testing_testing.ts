import {
  AssertionError,
  assertRejects,
} from "https://deno.land/std@0.140.0/testing/asserts.ts";
import { assertStreams } from "./testing.ts";

async function* getAsyncIterable<T>(
  ...args: T[]
): AsyncIterableIterator<T> {
  for (const arg of args) {
    yield arg;
  }
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
