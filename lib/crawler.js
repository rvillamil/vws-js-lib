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
 * Simplificar con _crawlTVShowCollection
 */
exports.crawlTVShowCollections = function (limit, showCollectionList) {

    var actions = showCollectionList.map(showCollection => {
        console.log("showCollection---->: " + JSON.stringify(showCollection))
        return _crawlTVShowCollection(limit, showCollection.name)
    });

    return Promise.all(actions)
        .then(
            showCollectionsList => {
                console.log(`showCollectionsList is: ${JSON.stringify(showCollectionsList)}\n`)
                return showCollectionsList
            });
}

/**
 * Crawl TVShowCollection in the following websites:
 * - www.tumejortorrent.com
 *
 * @param {*} limit number of episodes from collection to crawl
 * @param {*} collectionName collection name
 *  e.g.: modern-family/1679
 *
 * @returns Promise with 'ShowCollection' object
 */
function _crawlTVShowCollection(limit, collectionName) {
    console.log("_crawlTVShowCollection: " + collectionName)

    return tumejortorrent.crawlLinkToURLsWithEpisodes(limit, collectionName)
        .then(linkChainedToEpisodeList => {
            console.log(`linkChainedToEpisodeList:  --> ${JSON.stringify(linkChainedToEpisodeList)} - size: ${linkChainedToEpisodeList.length} `)
            return tumejortorrent.crawlDataShowCollection(linkChainedToEpisodeList);

        }).catch(err => {
            console.error(`ERROR! - _crawlTVShowCollection: '${err}'`)
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