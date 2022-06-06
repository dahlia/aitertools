<!-- deno-fmt-ignore-file -->

aitertools
==========

[![Latest version][Tag badge]][Deno module]
[![LGPL 3.0][License badge]](./LICENSE)
[![Deno Doc (API references)][Deno Doc badge]][Deno Doc]
[![GitHub Actions][GitHub Actions status badge]][GitHub Actions]
[![Codecov][Codecov badge]][Codecov]

This library provides a [well-tested][Codecov] collection of small utility
functions dealing with [async iterables].  You can think of it as LINQ or aitertools for [Deno].

~~~ typescript
import * as aitertools from "https://deno.land/x/aitertools/mod.ts";
~~~

[Tag badge]: https://img.shields.io/github/v/tag/dahlia/aitertools
[Deno module]: https://deno.land/x/aitertools
[License badge]: https://img.shields.io/github/license/dahlia/aitertools
[Deno Doc]: https://doc.deno.land/https://deno.land/x/aitertools/mod.ts
[Deno Doc badge]: https://img.shields.io/badge/api-deno%20doc-blue
[GitHub Actions]: https://github.com/dahlia/aitertools/actions/workflows/test.yaml
[GitHub Actions status badge]: https://github.com/dahlia/aitertools/actions/workflows/test.yaml/badge.svg
[Codecov badge]: https://codecov.io/gh/dahlia/aitertools/branch/main/graph/badge.svg?token=UBDX4Inrz6
[Codecov]: https://codecov.io/gh/dahlia/aitertools
[async iterables]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
[Deno]: https://deno.land/


Functions
---------

| Module[^1]         | Function                     |
|--------------------|------------------------------|
| *[collections.ts]* | [`fromIterable()`]           |
| *[collections.ts]* | [`toArray()`]                |
| *[drop.ts]*        | [`drop()`]                   |
| *[drop.ts]*        | [`dropWhile()`]              |
| *[fold.ts]*        | [`reduce()`]                 |
| *[infinite.ts]*    | [`count()`]                  |
| *[infinite.ts]*    | [`cycle()`]                  |
| *[infinite.ts]*    | [`repeat()`]                 |
| *[map.ts]*         | [`map()`]                    |
| *[take.ts]*        | [`take()`]                   |
| *[take.ts]*        | [`takeWhile()`]              |
| *[tee.ts]*         | [`tee()`]                    |
| *[testing.ts]*     | [`assertStreams()`]          |
| *[testing.ts]*     | [`assertStreamStartsWith()`] |

It is going to have more functions later.

[^1]: All functions are re-exported by [*mod.ts*][Deno Doc] as well.

[collections.ts]: https://doc.deno.land/https://deno.land/x/aitertools/collections.ts
[drop.ts]: https://doc.deno.land/https://deno.land/x/aitertools/drop.ts
[fold.ts]: https://doc.deno.land/https://deno.land/x/aitertools/fold.ts
[infinite.ts]: https://doc.deno.land/https://deno.land/x/aitertools/infinite.ts
[map.ts]: https://doc.deno.land/https://deno.land/x/aitertools/map.ts
[take.ts]: https://doc.deno.land/https://deno.land/x/aitertools/take.ts
[tee.ts]: https://doc.deno.land/https://deno.land/x/aitertools/tee.ts
[testing.ts]: https://doc.deno.land/https://deno.land/x/aitertools/testing.ts
[`fromIterable()`]: https://doc.deno.land/https://deno.land/x/aitertools/collections.ts/~/fromIterable
[`toArray()`]: https://doc.deno.land/https://deno.land/x/aitertools/collections.ts/~/toArray
[`drop()`]: https://doc.deno.land/https://deno.land/x/aitertools/drop.ts/~/drop
[`dropWhile()`]: https://doc.deno.land/https://deno.land/x/aitertools/drop.ts/~/dropWhile
[`reduce()`]: https://doc.deno.land/https://deno.land/x/aitertools/fold.ts/~/reduce
[`count()`]: https://doc.deno.land/https://deno.land/x/aitertools/infinite.ts/~/count
[`cycle()`]: https://doc.deno.land/https://deno.land/x/aitertools/infinite.ts/~/cycle
[`repeat()`]: https://doc.deno.land/https://deno.land/x/aitertools/infinite.ts/~/repeat
[`map()`]: https://doc.deno.land/https://deno.land/x/aitertools/map.ts/~/map
[`take()`]: https://doc.deno.land/https://deno.land/x/aitertools/take.ts/~/take
[`takeWhile()`]: https://doc.deno.land/https://deno.land/x/aitertools/take.ts/~/takeWhile
[`tee()`]: https://doc.deno.land/https://deno.land/x/aitertools/tee.ts/~/tee
[`assertStreams()`]: https://doc.deno.land/https://deno.land/x/aitertools/testing.ts/~/assertStreams
[`assertStreamStartsWith()`]: https://doc.deno.land/https://deno.land/x/aitertools/testing.ts/~/assertStreamStartsWith
