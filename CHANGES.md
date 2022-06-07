<!-- deno-fmt-ignore-file -->

Changelog
=========

Version 0.3.0
-------------

To be released.

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
 -  Added `fromIterable()` function.
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
