# VWS JS library

Node module for web-scraping on torrent video websites and search in some internet film databases

Mainly uses a module called [cheerio](https://github.com/cheeriojs/cheerio) by Matthew Mueller which implements a subset of jQuery specifically designed for server use.

Other module is [request-promise](https://github.com/request/request-promise), "the simplified HTTP request client 'request' with Promise support. Powered by Bluebird"

Currently websites scraped list:

- [TuMejorTorrent](http://tumejortorrent.com/)

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

#### Node module for crawl 2 video premieres in 'tumejortorrent' portal

```js
var onShowFoundEvent = function onShowFoundEvent(show) {
    console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
}

crawler.crawlVideoPremieres(2, onShowFoundEvent)
    .then(urlList => {
        console.log("crawler - crawlVideoPremieres length: " + urlList.length);
    }).catch(function (err) {
        console.log('ERROR! crawlVideoPremieres: ' + err);
    });
```

#### Node module for search in OMDB

```js
const omdb = require('../lib/omdb');

omdb.searchShow('Star wars', '1977')
    .then(show => {
        console.log('Show Star wars: ', show);
    })
    .catch(err => {
        console.log('Error: ' + err);
    });
```

#### Node module for earch in TMDB 

```js
const tmdb = require('../lib/tmdb');

tmdb.searchShow('Star wars', '1977')
    .then(show => {
        console.log('Show Star wars: ', show);
    })
    .catch(err => {
        console.log('Error: ' + err);
    });
```

## Running the tests

 For running the automated tests for this system, with [Mocha](https://mochajs.org) Javascript test framework

```sh
$npm test
```

or indiviual test by description

```sh
$npm test -- --grep "show object"
$npm test -- --grep "crawler"

```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/rvillamil/vws-js-lib/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.