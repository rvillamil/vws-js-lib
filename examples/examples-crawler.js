const crawler = require('../lib/crawler');
const Show = require('../lib/show');

//
// Example use
//

var onShowURLCrawled = function onShowURLCrawled(show) {
    console.log(`onShowURLCrawled - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
}

/*
crawler.crawlVideoPremieres(2, onShowURLCrawled)
    .then(shows => {
        console.log("crawler - crawlVideoPremieres length: " + shows.length);
    }).catch(function (err) {
        console.log('ERROR! crawlVideoPremieres: ' + err);
    });


crawler.crawlTVShows(2, onShowURLCrawled)
    .then(shows => {
        console.log("crawler - crawlTVShows length: " + shows.length);
    }).catch(function (err) {
        console.log('ERROR! crawlTVShows: ' + err);
    });

    */
favoritesList = ['erase-una-vez/1490']
crawler.crawlMyFavoritesTVShows(4, favoritesList, onShowURLCrawled)
    .then(shows => {
        console.log("crawler - crawlMyFavoritesTVShows length: " + shows.length);
    }).catch(function (err) {
        console.log('ERROR! crawlMyFavoritesTVShows: ' + err);
    });