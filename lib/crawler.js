//
// NPM modules
//
const Show = require('./show');
const LinkChained = require('./linkChained');
const omdb = require('./omdb');
const tmdb = require('./tmdb');
const tumejortorrent = require('./tumejortorrent');

//
// Export my NPM functions 
//

/**
 * Crawl video premieres in the following websites:
 * - www.tumejortorrent.com
 * 
 * @param {*} limit number of video premieres to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'Show' array 
 */
exports.crawlVideoPremieres = function (limit, onShowDataCrawled) {

    return tumejortorrent.crawlLinkToURLsWithVideoPremieres(limit)
        .then(linkChainedToShowDataList => {
            return _doCrawl(linkChainedToShowDataList, onShowDataCrawled)
        }).catch(err => {
            console.error(`ERROR! - crawlVideoPremieres: '${err}'`)
        });
}

/**
 * Crawl billboard films in the following websites:
 * - www.tumejortorrent.com
 * 
 * @param {*} limit number of video premieres to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'Show' array 
 */
exports.crawlBillboardFilms = function (limit, onShowDataCrawled) {
    return tumejortorrent.crawlLinkToURLsWithBillboardFilms(limit)
        .then(linkChainedToShowDataList => {
            return _doCrawl(linkChainedToShowDataList, onShowDataCrawled);
        }).catch(err => {
            console.error(`ERROR! - crawlBillboardFilms: '${err}'`)
        });
}

/**
 * Crawl TVShow in the following websites:
 * - www.tumejortorrent.com
 * 
 * @param {*} limit number of video premieres to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'Show' array 
 */
exports.crawlTVShows = function (limit, onShowDataCrawled) {
    return tumejortorrent.crawlLinkToURLsWithLatestTVShows(limit)
        .then(linkChainedToShowDataList => {
            return _doCrawl(linkChainedToShowDataList, onShowDataCrawled);
        }).catch(err => {
            console.error(`ERROR! - crawlTVShows: '${err}'`)
        });
}


/**
 * TODO
 * 
 * @returns Promise with ShowCollection object with data scraped
 */
/*
exports.crawlTVShowCollection = function (limit, show) {

    return tumejortorrent.crawlURLsWithCollection(limit, show.collectionName)
        .then(urlsWithCollection => {

            return tumejortorrent.crawlDataShowCollection(
                show.collectionName,
                urlsWithCollection);

        }).catch(err => {
            console.error(`ERROR! - crawlTVShowCollection: '${err}'`)
        });
}
*/
// ----------------------------------------------------------------------------
// 
// Private functions
//

function _doCrawl(linkToShowDataList, onShowDataCrawled) {

    var actions = linkToShowDataList.map(
        linkToShowData => {
            return _doCrawlAndSearchFrom(linkToShowData)
        }
    )
    return Promise.all(actions)
        .then(
            shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
                shows.map(onShowDataCrawled);
                return shows;
            }
        )
}

function _doCrawlAndSearchFrom(linkToShowData) {
    return tumejortorrent.crawlDataShow(linkToShowData.current, linkToShowData.previous)
        .then(show => {
            return _doSearchInTMDB(show);
        })
        .then(showTMDB => {
            return _doSearchInOMDB(showTMDB);
        })
        .then(showOMDB => {
            return showOMDB;
        })
        .catch(err => {
            console.error('ERROR! - _doCrawlAndSearchFrom - Error on search:' + err);
        })
}

function _doSearchInTMDB(show) {
    return tmdb.searchShow(show.title, show.year)
        .then(tmdbShow => {

            if (tmdbShow.sinopsis != null) {
                show.sinopsis = tmdbShow.sinopsis
            }
            if (tmdbShow.originalTitle != null) {
                show.originalTitle = tmdbShow.originalTitle
            }
            show.tmdbRating = tmdbShow.tmdbRating

            return show;
        })
        .catch(err => {
            console.error('ERROR! - _doSearchInTMDB - Error on tmdb search:' + err);
        })
}

function _doSearchInOMDB(show) {
    return omdb.searchShow(show.title, show.year)
        .then(omdbShow => {
            show.imdbRating = omdbShow.imdbRating
            show.rottenTomatoes = omdbShow.rottenTomatoes
            if (omdbShow.description != null) {
                show.description = omdbShow.description
            }
            return show;
        })
        .catch(err => {
            console.error('ERROR! - _doSearchInOMDB - Error on omdb search:' + err);
        })
}