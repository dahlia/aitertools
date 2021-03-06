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
functions dealing with [async iterables].  You can think of it as LINQ or aitertools for [Deno].

~~~ typescript
import * as aitertools from "https://deno.land/x/aitertools/mod.ts";
~~~

See also the [complete API reference][Deno Doc].

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


Changelog
---------

See *[CHANGES.md](CHANGES.md)* file.  Note that unreleased versions are also
available on [nest.land]:

~~~ typescript
import * as aitertools
  from "https://x.nest.land/aitertools@0.4.0-dev.15+3f191d7/mod.ts";
~~~
