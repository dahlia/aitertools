<!-- deno-fmt-ignore-file -->

Changelog
=========

Version 0.5.0
-------------

To be released.  Unreleased versions are available on [nest.land].


Version 0.4.0
-------------

Released on July 17, 2022.

 -  Added *unique.ts* module.
 -  Added `groupBy()` function.
 -  Added `unique()` function.


Version 0.3.1
-------------

Released on June 8, 2022.

 -  Added the following missing re-exports to *mod.ts* module:
     -  `toMap()` from *collections.ts*
     -  `toSet()` from *collections.ts*
     -  `concat()` from *concat.ts*
     -  `drop()` from *drop.ts*
     -  `dropWhile()` from *drop.ts*
     -  `filter()` from *filter.ts*
     -  `map()` from *map.ts*


Version 0.3.0
-------------

Released on June 8, 2022.

 -  Added `fromIterable()` function.
 -  Added `toMap()` function.
 -  Added `toSet()` function.
 -  Added *concat.ts* module.
 -  Added `concat()` function.
 -  Added *drop.ts* module.
 -  Added `drop()` function.
 -  Added `dropWhile()` function.
 -  Added *filter.ts* module.
 -  Added `filter()` function.
 -  Added *fold.ts* module.
 -  Added `reduce()` function.
 -  Added *map.ts* module.
 -  Added `map()` function.
 -  Added *tee.ts* module.
 -  Added `tee()` function.
 -  Added optional parameter `msg` to `assertStreams<T>()` function.
 -  Added optional parameter `msg` to `assertStreamStartsWith<T>()` function.


Version 0.2.1
-------------

Released on June 4, 2022.

 -  Fixed an off-by-one bug that `take()` had returned a non-empty async
    iterator when `count <= 0`.


Version 0.2.0
-------------

Released on May 24, 2022.

 -  Added *mod.ts* module which re-exports everything from other modules.
 -  Added `cycle()` function.
 -  Added `repeat()` function.


Version 0.1.1
-------------

Released on June 4, 2022.

 -  Fixed an off-by-one bug that `take()` had returned a non-empty async
    iterator when `count <= 0`.


Version 0.1.0
-------------

Initial release.  Released on May 23, 2022.


[nest.land]: https://nest.land/package/aitertools
