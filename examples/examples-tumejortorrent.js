const crawler_tumejortorrent = require('../lib/tumejortorrent');

//
// Example use
//
crawler_tumejortorrent.crawlShows(
    'http://tumejortorrent.com/peliculas-x264-mkv/',
    showObjectCrawled => console.log('showObject', showObjectCrawled),
    showListCrawled => console.log("FIN --> showListCrawled size: " + showListCrawled.length)
);