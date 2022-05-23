<!-- deno-fmt-ignore-file -->

aitertools
==========

[![Latest version][Tag badge]][Deno module]
[![LGPL 3.0][License badge]](./LICENSE)
[![Deno Doc (API references)][Deno Doc badge]][Deno Doc]
[![GitHub Actions][GitHub Actions status badge]][GitHub Actions]
[![Codecov][Codecov badge]][Codecov]

This library provides a collection of small utility functions dealing
with async iterables.  You can think of it as LINQ or aitertools for [Deno].

Currently it provides (see also [Deno Doc]):

 -  `assertStreams()`
 -  `assertStreamStartsWith()`
 -  `count()`
 -  `take()`
 -  `takeWhile()`
 -  `toArray()`

It is going to have more functions later.

[Tag badge]: https://img.shields.io/github/v/tag/dahlia/aitertools
[Deno module]: https://deno.land/x/aitertools
[License badge]: https://img.shields.io/github/license/dahlia/aitertools
[Deno Doc]: https://doc.deno.land/https://deno.land/x/aitertools/mod.ts
[Deno Doc badge]: https://img.shields.io/badge/api-deno%20doc-blue
[GitHub Actions]: https://github.com/dahlia/aitertools/actions/workflows/test.yaml
[GitHub Actions status badge]: https://github.com/dahlia/aitertools/actions/workflows/test.yaml/badge.svg
[Codecov badge]: https://codecov.io/gh/dahlia/aitertools/branch/main/graph/badge.svg?token=UBDX4Inrz6
[Codecov]: https://codecov.io/gh/dahlia/aitertools
[Deno]: https://deno.land/
