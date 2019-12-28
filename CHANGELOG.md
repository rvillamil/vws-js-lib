# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Bug fixed on films with title between '[]'

## [4.0.0] - 2019-12-13

- New dontorrent.com crawler!
- New dontorrent.com searcher!
- Renaming tool 'dbutils' to 'favorites-tool'

## [3.0.1] - 2019-11-23

### Changed

- Upgrading 3rdParty libraries
- Bug fixed on title parsing
- ESLint minor bugs fixed
- Minor bugs on test

## [3.0.0] - 2019-07-06

### Changed

- Change the portal to parse: Now is 'descargas2020.org'
- Refactor code

## [2.1.4] - 2019-02-24

### Changed

- minor bug fixed

## [2.1.3] - 2019-02-24

### Changed

- tumejortorrent site, has been replaced by newpct video web site

## [2.1.2] - 2019-02-15

### Changed

- Fix error. tumejortorrent has changed to 'https' url

## [2.1.1] - 2018-12-16

### Changed

- Fix error on load cover from tumejortorrent
- Fix error on parse tvshow title from tumejortorrent
- Fix test

## [2.1.0] - 2018-10-27

### Added

- Now persist all tvshows information about the showcollection in favorites database
- New favorites tool management console: `utils/dbutils`

## [2.0.2] - 2018-10-07

### Changed

- Fix problem on linux distributions

## [2.0.1] - 2018-10-07

### Added

- New node tool for search in OMDB and TMDB : `utils/xmdb.js`

### Changed

- Minor bug fixed

- OMDB and TMDB search enhacements and results

## [2.0.0] - 2018-04-21

### Added

- API enhacements: new objects. Incompatible changes with previous version
- New LinkChained object. Wrapper for URL Links
- New Showcollection object. e.g: TVShow sessions are show collection
- New Database support: nedb
- New FavoriteRepository object, with 'showCollection' persistence support
- Test enhacements

## [1.0.0] - 2018-03-30

### Added

- New API Facade 'crawler'
- New API for tumejortorrent crawler
- New TMDB support
- New OMDB API Support
- New data: Original title, year, tmdbRating, imdbRating, rottenTomatoes
- Other minor bug fixed

## [0.0.3] - 2018-03-16

### Changed

- Tests fixed

- Minor bugs fixed

## [0.0.2] - 2018-03-10

### Changed

- API enhanced

### Added

- Get all torrent shows on sync mode

## [0.0.1] - 2018-02-20

### Added

- First big commit
