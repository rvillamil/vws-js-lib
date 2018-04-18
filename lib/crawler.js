//
// NPM modules
//
const Show = require('./show');
const ShowCollection = require('./showcollection');
const LinkChained = require('./linkChained');
const omdb = require('./omdb');
const tmdb = require('./tmdb');
const tumejortorrent = require('./tumejortorrent');

//
// Export my NPM functions 
//

/**
 * Crawl video premieres in the following websites:
 * - http://tumejortorrent.com/peliculas-x264-mkv/
 * 
 * @param {*} limit max number of video premieres to crawl
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
 * - http://tumejortorrent.com/estrenos-de-cine/
 * 
 * @param {*} limit max number of films to crawl
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
 * - http://tumejortorrent.com/series-hd/
 * 
 * @param {*} limit max number of TVShows to crawl
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
 * Crawl TVShows in 'showCollection' array. Data are scraped from:
 *  - http://tumejortorrent.com/series-hd/
 * 
 * @param {*} limit max number of the collection TVShows to crawl
 * @param {*} showCollectionList showCollection list for updating
 * @returns Promise with new 'ShowCollection' array with al TVShows information
 */
exports.crawlTVShowCollections = function (limit, showCollectionList) {

    var actions = showCollectionList.map(showCollection => {
        //console.log("showCollection---->: " + JSON.stringify(showCollection))
        return _doCrawlTVShowCollectionByName(limit, showCollection.name)
    });

    return Promise.all(actions)
        .then(
            showCollectionsList => {
                return showCollectionsList
            });
}

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
    return tumejortorrent.crawlDataShow(linkToShowData.current, linkToShowData.from)
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

function _doCrawlTVShowCollectionByName(limit, collectionName) {
    return tumejortorrent.crawlLinkToURLsWithEpisodes(limit, collectionName)
        .then(linkChainedToEpisodeList => {
            return tumejortorrent.crawlDataShowCollection(collectionName, linkChainedToEpisodeList);

        }).catch(err => {
            console.error(`ERROR! - _doCrawlTVShowCollectionByName: '${err}'`)
        });
}