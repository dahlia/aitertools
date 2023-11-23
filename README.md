<!-- deno-fmt-ignore-file -->

aitertools
==========

[![Latest version][Tag badge]][Deno module]
[![Published on nest.land][nest.land badge]][nest.land]
[![LGPL 3.0][License badge]](./LICENSE)
[![Deno Doc (API references)][Deno Doc badge]][Deno Doc]
[![GitHub Actions][GitHub Actions status badge]][GitHub Actions]
[![Codecov][Codecov badge]][Codecov]

This library provides a [well-tested][Codecov] collection of small utility
functions dealing with [async iterables].  You can think of it as .NET LINQ or
Python aitertools for [Deno].

[Tag badge]: https://img.shields.io/github/v/tag/dahlia/aitertools
[Deno module]: https://deno.land/x/aitertools
[nest.land badge]: https://nest.land/badge.svg
[nest.land]: https://nest.land/package/aitertools
[License badge]: https://img.shields.io/github/license/dahlia/aitertools
[Deno Doc]: https://doc.deno.land/https://deno.land/x/aitertools/mod.ts
[Deno Doc badge]: https://img.shields.io/badge/api-deno%20doc-blue
[GitHub Actions]: https://github.com/dahlia/aitertools/actions/workflows/build.yaml
[GitHub Actions status badge]: https://github.com/dahlia/aitertools/actions/workflows/build.yaml/badge.svg
[Codecov badge]: https://codecov.io/gh/dahlia/aitertools/branch/main/graph/badge.svg?token=UBDX4Inrz6
[Codecov]: https://codecov.io/gh/dahlia/aitertools
[async iterables]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
[Deno]: https://deno.land/


Functions
---------

For the complete list of functions, see the [complete API reference][Deno Doc].

 -  `concat(...sources)`: Concatenate multiple async iterables into one.
 -  `take(source, count)`: Take the first `count` items from the `source`.
 -  `drop(source, count)`: Drop the first `count` items from the `source`.
 -  `takeWhile(source, predicate)`: Take items from the `source` while the
    `predicate` returns `true`.
 -  `dropWhile(source, predicate)`: Drop items from the `source` while the
    `predicate` returns `true`.
 -  `map(mapper, ...sources)`: Apply the `mapper` to each item in the `sources`.
 -  `filter(predicate, ...sources)`: Filter items in the `sources` by the
    `predicate`.
 -  `reduce(reducer, source, initial?)`: Reduce the `source` to a single value
    by the `reducer`, optionally with the `initial` value.
 -  `tee(source, numbeer)`: Effectively duplicate the `source` into `number`
    of async iterables.
 -  `groupBy(source, keySelector)`: Group items in the `source` by the
    `keySelector`.
 -  `unique(source, keySelector?)`: Eliminate duplicate items in the `source`,
    optionally by the `keySelector`.
 -  `range(start?, stop, step?)`: Generate a sequence of numbers from `start`
    to `stop` by `step`.
 -  `count(start?, step?)`: Generate a sequence of numbers from `start` by
    `step` infinitely.
 -  `cycle(source)`: Cycle the `source` infinitely.
 -  `repeat(value, times?)`: Repeat the `value` for `times` times, or
    infinitely if `times` is not specified.
 -  `fromIterable(source)`: Convert an iterable to an async iterable.
 -  `toArray(source)`: Convert an async iterable to an array.
 -  `toSet(source)`: Convert an async iterable to a `Set`.
 -  `toMap(source, keySelector, valueSelector?)`: Convert an async iterable to
    a `Map`.
 -  `assertStreams(actual, expected, msg?)`: Asset that an async iterable
    `actual` is equal to an array `expected`.
 -  `assertStreamStartsWith(actual, expected, msg?)`: Asset that an async
    iterable `actual` (which is possibly infinite) starts with an array
    `expected`.


Usage
-----

In Deno:

~~~ typescript
import * as aitertools from "https://deno.land/x/aitertools/mod.ts";
~~~



Changelog
---------

See *[CHANGES.md](CHANGES.md)* file.  Note that unreleased versions are also
available on [nest.land]:

~~~ typescript
import * as aitertools
  from "https://x.nest.land/aitertools@0.4.0-dev.15+3f191d7/mod.ts";
~~~
