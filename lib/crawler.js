//
// NPM modules
//
const omdb = require('./omdb')
const tmdb = require('./tmdb')

// www.descargas2020
const showLinksCrawlerDescargas2020 = require('./crawlers/descargas2020/crawler/showLinksCrawler')
const filmCrawlerDescargas2020 = require('./crawlers/descargas2020/crawler/filmCrawler')
const tvshowCollectionCrawlerDescargas2020 = require('./crawlers/descargas2020/crawler/tvshowCollectionCrawler')
/// www.dontorrent.org
const torrentLinksCrawlerDT = require('./crawlers/dontorrent/crawler/torrentLinksCrawler')
const showCrawlerDT = require('./crawlers/dontorrent/crawler/showCrawler')
const showCollectionCrawlerDT = require('./crawlers/dontorrent/crawler/showCollectionCrawler.js')

//
// Constants
//
const constantsDescargas2020 = require('./crawlers/descargas2020/constants')
const constantsDontorrent = require('./crawlers/dontorrent/constants')


/**
 * Crawl video premieres for all torrent sites
 *
 * @param {*} limit max number of video premieres to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'Show' array
 */
exports.crawlVideoPremieres = function (limit, onShowDataCrawled) {
    console.log('crawler->crawlVideoPremieres()')

    return showLinksCrawlerDescargas2020.crawlLinksFrom(
        constantsDescargas2020.URL_BASE_VIDEOPREMIERES_HD,
        limit,
        '.pelilist li a'
    ).then(linkChainedToShowDataList => {
        return torrentLinksCrawlerDT.crawlLinksFrom(constantsDontorrent.URL_BASE_BILLBOARDFILMS,
            limit,
            'pelicula')
            .then(linkChainedToTorrentLinkList => {
                // Concatemos los arrays
                var newFullLinkChainedList = _concatLists(linkChainedToShowDataList, linkChainedToTorrentLinkList, limit)
                //console.log(`newFullLinkChainedList - ${JSON.stringify(newFullLinkChainedList)}`)
                return _doCrawl(newFullLinkChainedList, onShowDataCrawled)
            }).catch(err => {
                console.error(`ERROR! - crawler->crawlVideoPremieres(): '${err}'`)
            })
    })
}

/**
 * Crawl billboard films for all torrent sites. 
 * - dontorrent site, doesn't has, billboard film
 *
 * @param {*} limit max number of films to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'Show' array
 */
exports.crawlBillboardFilms = function (limit, onShowDataCrawled) {
    console.log('crawler->crawlBillboardFilms()')

    return showLinksCrawlerDescargas2020.crawlLinksFrom(
        constantsDescargas2020.URL_BASE_BILLBOARDFILMS,
        limit,
        '.pelilist li a'
    ).then(linkChainedToShowDataList => {
        return _doCrawl(linkChainedToShowDataList, onShowDataCrawled)
    }).catch(err => {
        console.error(`ERROR! - crawler->crawlVideoPremieres(): '${err}'`)
    })
}

/**
 * Crawl TVShows for current site
 *
 * @param {*} limit max number of TVShows to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'Show' array
 */
exports.crawlTVShows = function (limit, onShowDataCrawled) {
    console.log('crawler->crawlTVShows()')

    return showLinksCrawlerDescargas2020.crawlLinksFrom(
        constantsDescargas2020.URL_BASE_TVSHOWS_HD,
        limit,
        '.pelilist li a'
    ).then(linkChainedToShowDataList => {
        return _doCrawlTVShow(linkChainedToShowDataList, onShowDataCrawled)
    }).catch(err => {
        console.error(`ERROR! - crawler->crawlTVShows(): '${err}'`)
    })
}

/**
 * Crawl TVShowscollection in 'showCollection' array
 *
 * @param {*} limit max number of the collection TVShows to crawl
 * @param {*} showCollectionList showCollection list for updating
 * @returns Promise with new 'ShowCollection' array with al TVShows information
 */
exports.crawlTVShowCollections = function (limit, showCollectionList) {
    // TODO: Cargar los TVShows para el dominio de dontorrent
    var actions = showCollectionList.map(showCollection => {
        //console.log("showCollection---->: " + JSON.stringify(showCollection))
        return tvshowCollectionCrawlerDescargas2020.crawlDataShowCollection(
            (`${constantsDescargas2020.URL_BASE_TVSHOWS_HD}${showCollection.name}`), limit)
    })

    // eslint-disable-next-line no-undef
    return Promise.all(actions)
        .then(
            showCollectionsList => {
                return showCollectionsList
            })
}

/**
 * Search show info from TMDB and OMDB database films
 *
 * @param {*} show Show object with the title to find
 * @param {*} kind movie or tv. If none, default ir tv
 */
exports.searchShowInXMDB = function (show, kind, debug = false) {
    return _doSearchShowInXMDB(show, kind, debug)
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
    // eslint-disable-next-line no-undef
    return Promise.all(actions)
        .then(
            shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
                shows.map(onShowDataCrawled)
                return shows
            }
        )
}


function _doCrawlAndSearchFrom(linkToShowData) {

    //console.log(`crawler : _doCrawlAndSearchFrom() ${linkToShowData.from}`)

    if (linkToShowData.domain == constantsDescargas2020.DOMAIN) {
        return filmCrawlerDescargas2020.crawlDataFilm(linkToShowData.from)
            .then(show => {
                return _doSearchShowInXMDB(show, 'movie')
            })
            .catch(err => {
                console.error('ERROR! - _doCrawlAndSearchFrom - Error on search:' + err)
            })
    }
    if (linkToShowData.domain == constantsDontorrent.DOMAIN) {
        return showCrawlerDT.crawlDataShow(linkToShowData.from)
            .then(show => {
                //console.log(`crawler : _doCrawlAndSearchFrom():  --> ${JSON.stringify(show)}\n\n`);
                return _doSearchShowInXMDB(show, 'movie')
            })
            .catch(err => {
                console.error('ERROR! - _doCrawlAndSearchFrom - Error on search:' + err)
            })
    }
}


function _doCrawlTVShow(linkToShowDataList, onShowDataCrawled) {

    var actions = linkToShowDataList.map(
        linkToShowData => {
            return _doCrawlTVShowAndSearchFrom(linkToShowData)
        }
    )
    // eslint-disable-next-line no-undef
    return Promise.all(actions)
        .then(
            shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
                shows.map(onShowDataCrawled)
                return shows
            }
        )
}

function _doCrawlTVShowAndSearchFrom(linkToShowData) {
    //console.log(`_doCrawlTVShowAndSearchFrom - linkToShowData: ${JSON.stringify(linkToShowData)}`)
    // Cargamos solo el primero de la coleccion pues nos sirve para mostrar datos
    return tvshowCollectionCrawlerDescargas2020.crawlDataShowCollection(linkToShowData.from, 1)
        .then(showCollection => {
            const show = showCollection.shows[0]
            //console.log(`_doCrawlTVShowAndSearchFrom - show '${show.title}'. Error code: '${show.error}' `)
            return _doSearchShowInXMDB(show, 'tv')
        }).catch(err => {
            console.error('ERROR! - _doCrawlTVShowAndSearchFrom - Error on search:' + err)
        })
}


function _doSearchShowInXMDB(showMixed, kind, debug = false) {
    // En TMDB por titulo en castellano que es muy fiable
    return tmdb.searchShow(showMixed.title, kind, debug)
        .then(tmdbShow => {
            //console.log("Response from TMDB: " + JSON.stringify(showMixed));
            console.log(`_doSearchShowInXMDB - Searching in TMDB by spanish title '${showMixed.title}'. Error code: '${tmdbShow.error}' `)
            if (tmdbShow.originalTitle != null) {
                showMixed.originalTitle = tmdbShow.originalTitle
                console.log(`           - Set original title to '${showMixed.originalTitle}' from TMDB`)

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
            // Intentamos buscar en OMDB por titulo origignal
            var searchTitle = showMixed.originalTitle
            if (searchTitle == null) {
                searchTitle = showMixed.title
            }
            return omdb.searchShow(searchTitle, debug)
        })
        .then(omdbShow => {
            //console.log("Response from OMDB: " + JSON.stringify(omdbShow))
            // Estos campos pueden venir nulos y los completamos
            console.log(`_doSearchShowInXMDB - Searching in OMDB for title '${omdbShow.title}'. Error code: '${omdbShow.error}'`)

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

            return showMixed

        })
        .catch(err => {
            console.error('ERROR! - doSearchInXMDB - Error on search:' + err)
        })
}


function _concatLists(linkListOne, linkListTwo, limit) {

    var linkListFinal = []
    var limitFirstList = Math.trunc(limit / 2)
    var limitSecondList = Math.trunc(limit / 2)

    // Si es impar ...
    const mod = limit % 2
    if (mod != 0) {
        if (limit == 1) {
            limitFirstList = limit
            limitSecondList = 0
        } else {
            limitFirstList = limitFirstList + 1
        }
    }
    //console.log(`limitFirstList: ${limitFirstList}`)
    //console.log(`limitSecondList: ${limitSecondList}`)

    for (let i = 0; i < limitFirstList; i++) {
        linkListFinal.push(linkListOne[i])
    }

    for (let i = 0; i < limitSecondList; i++) {
        linkListFinal.push(linkListTwo[i])
    }
    return linkListFinal
}
