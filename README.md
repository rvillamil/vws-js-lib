# VWS JS library

Node module for web-scraping on torrent video websites and search in some internet film databases

Mainly uses a module called [cheerio](https://github.com/cheeriojs/cheerio) by Matthew Mueller which implements a subset of jQuery specifically designed for server use.

Currently websites scraped list:

- [descargas2020.org](https://descargas2020.org/)
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

### Example use

#### Node module for crawl 2 video premieres in 'dontorrent' portal

```js
var Show = require('vws-js-lib/lib/model/show');
var crawler = require('vws-js-lib/lib/dontorrent/crawler/showCrawler');

var onShowFoundEvent = function onShowDataCrawled(show) {
    console.log(`onShowDataCrawled - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
}

return crawler.crawlVideoPremieres(2, onShowDataCrawled)
    .then(showList => {
        console.log("crawler - crawlVideoPremieres length: " + showList.length);
    }).catch(function (err) {
        console.log('ERROR! crawlVideoPremieres: ' + err);
    });
```

#### Node module for search in OMDB

```js
var omdb = require('vws-js-lib/lib/omdb');

return omdb.searchShow('Star wars', '1977')
    .then(show => {
        console.log('Show Star wars: ', show);
    })
    .catch(err => {
        console.log('Error: ' + err);
    });
```

#### Node module for earch in TMDB

```js
var tmdb = require('vws-js-lib/lib/tmdb');

return tmdb.searchShow('Star wars', '1977')
    .then(show => {
        console.log('Show Star wars: ', show);
    })
    .catch(err => {
        console.log('Error: ' + err);
    });
```

- More examples in 'test' directory

## Running the tests

 For running the automated tests for this system, with [Mocha](https://mochajs.org) Javascript test framework

```sh
$npm test
```

or indiviual test by description

```sh
$npm test -- --grep "omdb"
$npm test -- --grep "crawler"
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/rvillamil/vws-js-lib/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
