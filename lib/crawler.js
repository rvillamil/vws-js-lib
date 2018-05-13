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
            return _doCrawlTVShow(linkChainedToShowDataList, onShowDataCrawled);
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

/**
 * Search show info from TMDB and OMDB database films
 * 
 * @param {*} show Show object with the title to find
 * @param {*} kind movie or tv. If none, default ir tv
 */
exports.searchShowInXMDB = function (show, kind) {
    return _doSearchShowInXMDB(show, kind)
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
            return _doSearchShowInXMDB(show, 'movie');
        })
        .catch(err => {
            console.error('ERROR! - _doCrawlAndSearchFrom - Error on search:' + err);
        })
}


function _doCrawlTVShow(linkToShowDataList, onShowDataCrawled) {

    var actions = linkToShowDataList.map(
        linkToShowData => {
            return _doCrawlTVShowAndSearchFrom(linkToShowData)
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

function _doCrawlTVShowAndSearchFrom(linkToShowData) {
    return tumejortorrent.crawlDataShow(linkToShowData.current, linkToShowData.from)

        .then(show => {
            return _doSearchShowInXMDB(show, 'tv');
        })
        .catch(err => {
            console.error('ERROR! - _doCrawlTVShowAndSearchFrom - Error on search:' + err);
        })
}


function _doSearchShowInXMDB(showMixed, kind) {

    var searchTitle = showMixed.originalTitle
    if (searchTitle == null) {
        searchTitle = showMixed.title
    }
    //console.log("_doSearchShowInXMDB - Title:", searchTitle)

    return tmdb.searchShow(searchTitle, kind)
        .then(tmdbShow => {
            //console.log("Response from TMDB: " + JSON.stringify(showMixed));
            if (showMixed.originalTitle == null) {
                showMixed.originalTitle = tmdbShow.originalTitle
            }
            if (showMixed.title == null) {
                showMixed.title = tmdbShow.title
            }
            // Sobreescribirmos con datos de TMDB mas fiables
            if (tmdbShow.year != null) {
                showMixed.year = tmdbShow.year
            }
            if (tmdbShow.description != null) {
                showMixed.description = tmdbShow.description
            }
            if (tmdbShow.sinopsis != null) {
                showMixed.sinopsis = tmdbShow.sinopsis
            }
            if (tmdbShow.releaseDate != null) {
                showMixed.releaseDate = tmdbShow.releaseDate
            }
            if (tmdbShow.tmdbRating != null) {
                showMixed.tmdbRating = tmdbShow.tmdbRating
            }
            return omdb.searchShow(searchTitle)
        })
        .then(omdbShow => {
            //console.log("Response from OMDB: " + JSON.stringify(omdbShow))
            // Estos campos pueden venir nulos y los completamos
            if (showMixed.year == null) {
                showMixed.year = omdbShow.year
            }
            if (showMixed.originalTitle == null) {
                showMixed.originalTitle = omdbShow.originalTitle
            }
            if (showMixed.description == null) {
                showMixed.description = omdbShow.description
            }
            if (showMixed.sinopsis == null) {
                showMixed.sinopsis = omdbShow.sinopsis
            }
            if (showMixed.releaseDate == null) {
                showMixed.releaseDate = omdbShow.releaseDate
            }
            if (showMixed.tmdbRating == null) {
                showMixed.tmdbRating = omdbShow.tmdbRating
            }
            showMixed.imdbRating = omdbShow.imdbRating
            showMixed.rottenTomatoes = omdbShow.rottenTomatoes

            return showMixed;
        })
        .catch(err => {
            console.error('ERROR! - doSearchInXMDB - Error on search:' + err);
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