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
    .then(urlList => {
        console.log("crawler - crawlVideoPremieres length: " + urlList.length);
    }).catch(function (err) {
        console.log('ERROR! crawlVideoPremieres: ' + err);
    });


crawler.crawlTVShows(2, onShowFoundEvent)
    .then(urlList => {
        console.log("crawler - crawlTVShows length: " + urlList.length);
    }).catch(function (err) {
        console.log('ERROR! crawlTVShows: ' + err);
    });

    */
favoritesList = ['erase-una-vez/1490']
crawler.crawlMyFavoritesTVShows(4, favoritesList, onShowFoundEvent)
    .then(urlList => {
        console.log("crawler - myFavoritesTVShows length: " + urlList.length);
    }).catch(function (err) {
        console.log('ERROR! crawlMyFavoritesTVShows: ' + err);
    });