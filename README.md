<!-- deno-fmt-ignore-file -->

aitertools
==========

[![Published on JSR][JSR badge]][JSR]
[![Published on npm][npm badge]][npm]
[![LGPL 3.0][License badge]](./LICENSE)
[![GitHub Actions][GitHub Actions status badge]][GitHub Actions]
[![Codecov][Codecov badge]][Codecov]

This library provides a [well-tested][Codecov] collection of small utility
functions dealing with [async iterables].  You can think of it as .NET LINQ or
Python aitertools for [Deno] & Node.js.

[JSR badge]: https://jsr.io/badges/@hongminhee/aitertools?
[JSR]: https://jsr.io/@hongminhee/aitertools
[npm badge]: https://img.shields.io/npm/v/aitertools
[npm]: https://www.npmjs.com/package/aitertools
[License badge]: https://img.shields.io/github/license/dahlia/aitertools
[Deno Doc badge]: https://img.shields.io/badge/api-deno%20doc-blue
[GitHub Actions]: https://github.com/dahlia/aitertools/actions/workflows/build.yaml
[GitHub Actions status badge]: https://github.com/dahlia/aitertools/actions/workflows/build.yaml/badge.svg
[Codecov badge]: https://codecov.io/gh/dahlia/aitertools/branch/main/graph/badge.svg?token=UBDX4Inrz6
[Codecov]: https://codecov.io/gh/dahlia/aitertools
[async iterables]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
[Deno]: https://deno.com/


Functions
---------

For the complete list of functions, see the [complete API reference][JSR].

 -  `concat(...sources)`: Concatenate multiple async iterables into one.
 -  `take(source, count)`: Take the first `count` items from the `source`.
 -  `drop(source, count)`: Drop the first `count` items from the `source`.
 -  `takeWhile(source, predicate)`: Take items from the `source` while the
    `predicate` returns `true`.
 -  `dropWhile(source, predicate)`: Drop items from the `source` while the
    `predicate` returns `true`.
 -  `takeEnd(source, count)`: Take the last `count` items from the `source`.
 -  `dropEnd(source, count)`: Drop the last `count` items from the `source`.
 -  `map(mapper, ...sources)`: Apply the `mapper` to each item in the `sources`.
 -  `filter(predicate, ...sources)`: Filter items in the `sources` by the
    `predicate`.
 -  `reduce(reducer, source, initial?)`: Reduce the `source` to a single value
    by the `reducer`, optionally with the `initial` value.
 -  `tee(source, number)`: Effectively duplicate the `source` into `number`
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

~~~ console
$ deno add @hongminhee/aitertools
~~~

~~~ typescript
import * as aitertools from "@hongminhee/aitertools";
~~~

In Node.js:

~~~ console
$ npm add aitertools
~~~

~~~ typescript
import * as aitertools from "aitertools";
~~~


Changelog
---------

See *[CHANGES.md](CHANGES.md)* file.  Note that unreleased versions are also
available on [JSR] for Deno:

~~~ typescript
deno add @hongminhee/aitertools@0.6.0-dev.36+9aa783c
~~~

… and on [npm] with `dev` tag for Node.js:

~~~ console
$ npm add aitertools@dev
~~~
