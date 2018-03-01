# VWS JS library

Node module for web-scraping on torrent video websites.

Mainly uses a module called [cheerio](https://github.com/cheeriojs/cheerio) by Matthew Mueller which implements a subset of jQuery specifically designed for server use.

Other module is [request-promise](https://github.com/request/request-promise), "the simplified HTTP request client 'request' with Promise support. Powered by Bluebird"

Currently websites scraped list:

- [TuMejorTorrent](http://tumejortorrent.com/)

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

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/rvillamil/vws-js-lib/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.