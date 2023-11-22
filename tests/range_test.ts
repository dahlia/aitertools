import {
  assert,
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertThrows,
} from "https://deno.land/std@0.207.0/assert/mod.ts";
import * as fc from "npm:fast-check@3.14.0";
import { assertStreams } from "../testing.ts";
import { Range, range } from "../range.ts";

function validNumber(): fc.Arbitrary<number> {
  return fc.oneof(
    fc.integer(),
    fc.float({ noDefaultInfinity: true, noNaN: true }),
  );
}

function invalidNumber(): fc.Arbitrary<number> {
  return fc.constantFrom(Infinity, -Infinity, NaN);
}

function validNonZeroNumber(): fc.Arbitrary<number> {
  return fc.oneof(
    fc.integer({ min: 1 }),
    fc.integer({ max: -1 }),
    fc.float({
      min: 0,
      minExcluded: true,
      noDefaultInfinity: true,
      noNaN: true,
    }),
    fc.float({
      max: -0,
      maxExcluded: true,
      noDefaultInfinity: true,
      noNaN: true,
    }),
  );
}

function feasibleNumber(): fc.Arbitrary<number> {
  return fc.oneof(
    fc.integer({ min: -1000, max: 1000 }),
    fc.tuple(
      fc.integer({ min: -100, max: 100 }),
      fc.integer({ min: -100, max: 100 }),
    ).map(([base, prec]) => base * (prec / 100)),
  );
}

function feasibleNonZeroNumber(): fc.Arbitrary<number> {
  return fc.oneof(
    fc.integer({ min: 1, max: 1000 }),
    fc.integer({ min: -1000, max: -1 }),
    fc.tuple(
      fc.integer({ min: -100, max: 100 }),
      fc.integer({ min: 1, max: 100 }),
    ).map(([base, prec]) => {
      const v = base + (prec / 100);
      return v == 0 ? 0.1 : v;
    }),
    fc.tuple(
      fc.integer({ min: -100, max: 100 }),
      fc.integer({ min: -100, max: -1 }),
    ).map(([base, prec]) => {
      const v = base + (prec / 100);
      return v == 0 ? -0.1 : v;
    }),
  );
}

function validNonZeroBigInt(): fc.Arbitrary<bigint> {
  return fc.oneof(
    fc.bigInt({ min: 1n }),
    fc.bigInt({ max: -1n }),
  );
}

function feasibleBigInt(): fc.Arbitrary<bigint> {
  return fc.bigInt({ min: -1000n, max: 1000n });
}

function feasibleNonZeroBigInt(): fc.Arbitrary<bigint> {
  return fc.oneof(
    fc.bigInt({ min: 1n, max: 1000n }),
    fc.bigInt({ min: -1000n, max: -1n }),
  );
}

function feasibleNumberRange(): fc.Arbitrary<Range<number>> {
  return fc.tuple(
    feasibleNumber(),
    feasibleNumber(),
    feasibleNonZeroNumber(),
  ).map(([start, stop, step]) => new Range(start, stop, step));
}

function feasibleBigIntRange(): fc.Arbitrary<Range<bigint>> {
  return fc.tuple(
    feasibleBigInt(),
    feasibleBigInt(),
    feasibleNonZeroBigInt(),
  ).map(([start, stop, step]) => new Range(start, stop, step));
}

Deno.test("range(number) [fc]", () => {
  fc.assert(
    fc.property(validNumber(), (stop: number) => {
      const r = range(stop);
      assertEquals(r.start, 0);
      assertEquals(r.stop, stop);
      assertEquals(r.step, 1);
    }),
  );
  fc.assert(
    fc.property(invalidNumber(), (stop: number) => {
      assertThrows(() => range(stop), RangeError);
    }),
  );
});

Deno.test("range(bigint) [fc]", () => {
  fc.assert(
    fc.property(fc.bigInt(), (stop: bigint) => {
      const r = range(stop);
      assertEquals(r.start, 0n);
      assertEquals(r.stop, stop);
      assertEquals(r.step, 1n);
    }),
  );
});

Deno.test("range(number, number) [fc]", () => {
  fc.assert(
    fc.property(validNumber(), validNumber(), (start: number, stop: number) => {
      const r = range(start, stop);
      assertEquals(r.start, start);
      assertEquals(r.stop, stop);
      assertEquals(r.step, 1);
    }),
  );
  fc.assert(
    fc.property(
      invalidNumber(),
      validNumber(),
      (start: number, stop: number) => {
        assertThrows(() => range(start, stop), RangeError);
      },
    ),
  );
});

Deno.test("range(bigint, bigint) [fc]", () => {
  fc.assert(
    fc.property(fc.bigInt(), fc.bigInt(), (start: bigint, stop: bigint) => {
      const r = range(start, stop);
      assertEquals(r.start, start);
      assertEquals(r.stop, stop);
      assertEquals(r.step, 1n);
    }),
  );
});

Deno.test("range(number, number, number) [fc]", () => {
  fc.assert(
    fc.property(
      validNumber(),
      validNumber(),
      validNonZeroNumber(),
      (start: number, stop: number, step: number) => {
        const r = range(start, stop, step);
        assertEquals(r.start, start);
        assertEquals(r.stop, stop);
        assertEquals(r.step, step);
      },
    ),
  );
  fc.assert(
    fc.property(
      validNumber(),
      validNumber(),
      fc.oneof(fc.constant(0), invalidNumber()),
      (start: number, stop: number, step: number) => {
        assertThrows(() => range(start, stop, step), RangeError);
      },
    ),
  );
});

Deno.test("range(bigint, bigint, bigint) [fc]", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      validNonZeroBigInt(),
      (start: bigint, stop: bigint, step: bigint) => {
        const r = range(start, stop, step);
        assertEquals(r.start, start);
        assertEquals(r.stop, stop);
        assertEquals(r.step, step);
      },
    ),
  );
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      (start: bigint, stop: bigint) => {
        assertThrows(() => range(start, stop, 0n), RangeError);
      },
    ),
  );
});

Deno.test("new Range(number|bigint, number|bigint, number|bigint)", () => {
  assertThrows(() => new Range<number | bigint>(0n, 10, 1), TypeError);
  assertThrows(() => new Range<number | bigint>(0, 10n, 1), TypeError);
  assertThrows(() => new Range<number | bigint>(0, 10, 1n), TypeError);
});

Deno.test("new Range(number, number, number) [fc]", () => {
  fc.assert(
    fc.property(
      validNumber(),
      validNumber(),
      validNonZeroNumber(),
      (start: number, stop: number, step: number) => {
        const r = new Range(start, stop, step);
        assertEquals(r.start, start);
        assertEquals(r.stop, stop);
        assertEquals(r.step, step);
      },
    ),
  );
  fc.assert(
    fc.property(
      validNumber(),
      validNumber(),
      fc.oneof(fc.constant(0), invalidNumber()),
      (start: number, stop: number, step: number) => {
        assertThrows(() => new Range(start, stop, step), RangeError);
      },
    ),
  );
});

Deno.test("new Range(bigint, bigint, bigint) [fc]", () => {
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      validNonZeroBigInt(),
      (start: bigint, stop: bigint, step: bigint) => {
        const r = new Range(start, stop, step);
        assertEquals(r.start, start);
        assertEquals(r.stop, stop);
        assertEquals(r.step, step);
      },
    ),
  );
  fc.assert(
    fc.property(
      fc.bigInt(),
      fc.bigInt(),
      (start: bigint, stop: bigint) => {
        assertThrows(() => new Range(start, stop, 0n), RangeError);
      },
    ),
  );
});

Deno.test("Range#length [fc]", () => {
  fc.assert(
    fc.property(feasibleNumberRange(), (r: Range<number>) => {
      const equivArray = [...r];
      assertEquals(r.length, equivArray.length);
      assertEquals(equivArray[r.length], undefined);
      if (r.length > 0) assertNotEquals(equivArray[r.length - 1], undefined);
    }),
  );
  fc.assert(
    fc.property(feasibleBigIntRange(), (r: Range<bigint>) => {
      const equivArray = [...r];
      assertEquals(r.length, equivArray.length);
      assertEquals(equivArray[r.length], undefined);
      if (r.length > 0) assertNotEquals(equivArray[r.length - 1], undefined);
    }),
  );
});

Deno.test("Range[Symbol.iterator]()", () => {
  assertStreams(range(5), [0, 1, 2, 3, 4]);
  assertStreams(range(1, 5), [1, 2, 3, 4]);
  assertStreams(range(1, 5, 2), [1, 3]);
  assertStreams(range(5, 1, -1), [5, 4, 3, 2]);
  assertStreams(range(5, 1, -2), [5, 3]);

  assertStreams(range(5n), [0n, 1n, 2n, 3n, 4n]);
  assertStreams(range(1n, 5n), [1n, 2n, 3n, 4n]);
  assertStreams(range(1n, 5n, 2n), [1n, 3n]);
  assertStreams(range(5n, 1n, -1n), [5n, 4n, 3n, 2n]);
  assertStreams(range(5n, 1n, -2n), [5n, 3n]);
});

Deno.test("Range[Symbol.asyncIterator]() [fc]", async () => {
  await fc.assert(
    fc.asyncProperty(feasibleNumberRange(), async (r: Range<number>) => {
      const it = r[Symbol.iterator]();
      for await (const v of r) {
        assertEquals(v, it.next().value);
      }
    }),
  );
  await fc.assert(
    fc.asyncProperty(feasibleBigIntRange(), async (r: Range<bigint>) => {
      const it = r[Symbol.iterator]();
      for await (const v of r) {
        assertEquals(v, it.next().value);
      }
    }),
  );
});

Deno.test("Range#at() [fc]", () => {
  fc.assert(
    fc.property(
      feasibleNumberRange(),
      fc.integer(),
      (r: Range<number>, idx: number) => {
        const actual = r.at(idx);
        const expected = [...r].at(idx);
        assertEquals(actual, expected);
      },
    ),
  );
  fc.assert(
    fc.property(
      feasibleBigIntRange(),
      fc.integer(),
      (r: Range<bigint>, idx: number) => {
        assertEquals(r.at(idx), [...r].at(idx));
      },
    ),
  );
  fc.assert(
    fc.property(
      feasibleNumberRange(),
      invalidNumber(),
      (r: Range<number>, invalidIdx: number) => {
        assertEquals(r.at(invalidIdx), undefined);
      },
    ),
  );
});

Deno.test("Range#toString()", () => {
  const pattern = /^\[object Range\(([^,]+), ([^,]+), ([^)]+)\)\]$/;
  fc.assert(
    fc.property(feasibleNumberRange(), (r: Range<number>) => {
      const str = r.toString();
      assertMatch(str, pattern);
      const match = pattern.exec(str);
      assert(match !== null);
      assertEquals(eval(match[1]), r.start);
      assertEquals(eval(match[2]), r.stop);
      assertEquals(eval(match[3]), r.step);
    }),
  );
  fc.assert(
    fc.property(feasibleBigIntRange(), (r: Range<bigint>) => {
      const str = r.toString();
      assertMatch(str, pattern);
      const match = pattern.exec(str);
      assert(match !== null);
      assertEquals(eval(match[1]), r.start);
      assertEquals(eval(match[2]), r.stop);
      assertEquals(eval(match[3]), r.step);
    }),
  );
});
