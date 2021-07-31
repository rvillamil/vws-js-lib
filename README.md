# VWS JS library

Node module for web-scraping on torrent video websites

Mainly uses a module called [cheerio](https://github.com/cheeriojs/cheerio) by Matthew Mueller which implements
 a subset of jQuery specifically designed for server use.

Currently websites scraped list:

- [pctmix.org](https://pctmix.org/)
- [dontorrent.org](https://dontorrent.org)

Implemented node modules for search on internet movie databases as:

- [omdb](http://www.omdbapi.com/)
- [tmdb](https://www.themoviedb.org/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You'll need [Node.js](https://nodejs.org/es/) installed on your computer in order to build this library

```sh
$git clone https://github.com/rvillamil/vws-js-lib
$cd vws-js-lib
$npm install
```

## Running the tests

 For running the automated tests for this system, with [Mocha](https://mochajs.org) Javascript test framework

```sh
$npm test
```

or indiviual test by description

```sh
$npm test -- --grep "crawler"
```

## Release version

I user Github actions + [semantic relases plugin](https://github.com/semantic-release/semantic-release) on push on master.

**Warning! Version on package.json is automatic. Don't change**

It Requieres commit message:

| Commit message                                                                                                                                                                                   | Release type               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| `fix(pencil): stop graphite breaking when too much pressure applied`                                                                                                                             | Patch Release              |
| `feat(pencil): add 'graphiteWidth' option`                                                                                                                                                       | ~~Minor~~ Feature Release  |
| `perf(pencil): remove graphiteWidth option`<br><br>`BREAKING CHANGE: The graphiteWidth option has been removed.`<br>`The default graphite width of 10mm is always used for performance reasons.` | ~~Major~~ Breaking Release |

Example (on master):

```sh
$git ci -a -m "feat(ci): Remove step in CI"
```

..then

```sh
$git push
```

When CI ends, then, there is a release version generated on:

- <https://www.npmjs.com/package/@vws-js-lib/crawler>
- <https://github.com/rvillamil/vws-js-lib/releases>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
