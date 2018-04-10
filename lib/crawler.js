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

/**
 * Crawl billboard films in the websites:
 * - www.tumejortorrent.com
 * 
 * @param {*} Max number of films to crawl
 * @param {*} onShowURLCrawled function to apply when Show is crawled
 * @returns Promise with 'Show' Object array crawled
 */
exports.crawlBillboardFilms = function (limit, onShowURLCrawled) {
    // Obtiene una promesa con las URLs con las peliculas de cartelera y cuando se resuelve
    // encadenamos otra promesa para que lance el 'crawl' por cada URL anteriomente obtenida
    return tumejortorrent.crawlURLsWithBillboardFilms(limit)
        .then(showURLs => {
            return _doCrawl(showURLs, onShowURLCrawled);
        }).catch(err => {
            console.error(`ERROR! - crawlBillboardFilms: '${err}'`)
        });
}

/**
 * Crawl video premieres in the websites:
 * - www.tumejortorrent.com
 * 
 * @param {*} Max number of video premieres to crawl
 * @param {*} onShowURLCrawled function to apply when Show is crawled
 * @returns Promise with Show array crawled
 */
exports.crawlVideoPremieres = function (limit, onShowURLCrawled) {
    return tumejortorrent.crawlURLsWithVideoPremieres(limit)
        .then(showURLs => {
            return _doCrawl(showURLs, onShowURLCrawled);
        }).catch(err => {
            console.error(`ERROR! - crawlVideoPremieres: '${err}'`)
        });
}

/**
 * Crawl TVShows in the websites:
 * - www.tumejortorrent.com
 * 
 * @param {*} Max number of TVShows to crawl
 * @param {*} onShowURLCrawled function to apply when 'Show' is crawled
 * @returns Promise with 'Show' Object array crawled
 */
exports.crawlTVShows = function (limit, onShowURLCrawled) {

    return tumejortorrent.crawlURLsWithLatestTVShows(limit)
        .then(showURLs => {
            return _doCrawl(showURLs, onShowURLCrawled);
        }).catch(err => {
            console.error(`ERROR! - crawlTVShows: '${err}'`)
        });
}

/**
 * TODO
 * 
 * @returns Promise with ShowCollection object with data scraped
 */
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

//
// TODO ..antes ver si necesito esta funcion..completar el fvorites.js lo primero
//
// e.g.: favoritesList = ['erase-una-vez/1490'], where 'erase-una-vez/1490' is the tvShowName
// crawlEpisodesURL
//
/*
exports.crawlMyFavoritesTVShows = function (limit, favoritesList, onShowURLCrawled) {
    // Para cada favorito, obtenemos los shows y componentmoes 
    // un show de shows .. o algo asi..
    var fnParseShow = function (show) {
        return tumejortorrent.crawlEpisodesURL(tvShowName, limit);
    }
    var actions = favoritesList.map(fnParseShow);
    // Cuando se resuelve la promesa, tenemos un array de urls    
    return Promise.all(actions)
        .then(urls => {

            console.log("array de urls: " + urls);
            //shows[0].addPreviousTVShowLinks(shows);
            //return urlList;
            //return shows[0];
            return urls
        })
}
*/

// ----------------------------------------------------------------------------
// 
// Private functions
//
/**
 * Crawl show urls
 * 
 * @param {*} showURLs array with the Show URLs to crawl
 * @param {*} onShowURLCrawled function to apply when Show is crawled
 * @returns Promise with Show array
 */
function _doCrawl(showURLs, onShowURLCrawled) {

    var fnParseShow = function (urlWithShow) {
        return _doCrawlAndSearchFrom(urlWithShow);
    }
    var actions = showURLs.map(fnParseShow);

    return Promise.all(actions)
        .then(
            shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
                shows.map(onShowURLCrawled);
                return shows;
            }
        )
}

function _doCrawlAndSearchFrom(url) {
    return tumejortorrent.crawlDataShow(url).then(show => {
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
            console.error('ERROR! - doSearchInTMDB - Error on tmdb search:' + err);
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
            console.error('ERROR! - doSearchInOMDB - Error on omdb search:' + err);
        })
}