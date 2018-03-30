//
// NPM modules
//
const show = require('./show');
const omdb = require('./omdb');
const tmdb = require('./tmdb');
const tumejortorrent = require('./tumejortorrent');

//
// Export my NPM functions 
//
exports.crawlBillboardFilms = function (limit, onShowFoundEvent) {
    return tumejortorrent.crawlURLsWithBillboardFilms(limit)
        .then(urlList => {
            return _processURLList(urlList, onShowFoundEvent);
        }).catch(err => {
            console.error('ERROR! crawlBillboardFilms: ' + err);
        });

}

exports.crawlVideoPremieres = function (limit, onShowFoundEvent) {
    return tumejortorrent.crawlURLsWithVideoPremieres(limit)
        .then(urlList => {
            return _processURLList(urlList, onShowFoundEvent);
        }).catch(err => {
            console.error('ERROR! crawlVideoPremieres: ' + err);
        });
}

// ------------------------ functions ---------------------
function doCrawlAndSearchFrom(url) {

    return tumejortorrent.crawlShow(url).then(show => {
            //console.log("URL whith show -->" + url);
            //console.log(`Show crawled  --> ${JSON.stringify(show)}\n\n`)
            return doSearchInTMDB(show);
        })
        .then(showTMDB => {
            return doSearchInOMDB(showTMDB);
        })
        .then(showOMDB => {
            //console.log(`Show crawled  --> ${JSON.stringify(showOMDB)}\n\n`)
            return showOMDB;
        })
        .catch(err => {
            console.error('ERROR! - searchInAllInternetMovieDatabases - Error on search:' + err);
        })
}


function doSearchInTMDB(show) {
    //console.log("doSearchInTMDB - Searching in internet movie databases for show: " + JSON.stringify(show));
    return tmdb.searchShow(show.title, show.year)
        .then(tmdbShow => {
            show.tmdbRating = "10.4"
            return show;
        })
        .catch(err => {
            console.log('ERROR! - doSearchInTMDB - Error on tmdb search:' + err);
        })
}

function doSearchInOMDB(show) {
    // console.log("doSearchInOMDB - Searching in internet movie databases for show: " + JSON.stringify(show));
    return omdb.searchShow(show.title, show.year)
        .then(omdbShow => {
            //show.imdbRating = omdbShow.imdbRating;
            show.imdbRating = "3.5"
            show.rottenTomatoes = "9/10"
            return show;
        })
        .catch(err => {
            console.log('ERROR! - doSearchInOMDB - Error on omdb search:' + err);
        })
}

function _processURLList(urlList, onShowFoundEvent) {
    urlList.forEach(url => {
        return doCrawlAndSearchFrom(url).then(
            show => {
                onShowFoundEvent(show);
                //console.log(`Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
            }
        )
    })
    return urlList;
}