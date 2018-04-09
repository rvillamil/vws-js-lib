const crawler = require('../lib/crawler');
const Show = require('../lib/show');

//
// Example use
//

var onShowFoundEvent = function onShowFoundEvent(show) {
    console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
}

/*
crawler.crawlVideoPremieres(2, onShowFoundEvent)
    .then(shows => {
        console.log("crawler - crawlVideoPremieres length: " + shows.length);
    }).catch(function (err) {
        console.log('ERROR! crawlVideoPremieres: ' + err);
    });


crawler.crawlTVShows(2, onShowFoundEvent)
    .then(shows => {
        console.log("crawler - crawlTVShows length: " + shows.length);
    }).catch(function (err) {
        console.log('ERROR! crawlTVShows: ' + err);
    });

    */
favoritesList = ['erase-una-vez/1490']
crawler.crawlMyFavoritesTVShows(4, favoritesList, onShowFoundEvent)
    .then(shows => {
        console.log("crawler - myFavoritesTVShows length: " + shows.length);
    }).catch(function (err) {
        console.log('ERROR! crawlMyFavoritesTVShows: ' + err);
    });