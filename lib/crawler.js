//
// NPM modules
//
const omdb = require('./omdb')
const tmdb = require('./agents/tmdb')

// www.pctmix
const showLinksCrawlerDescargas2020 = require('./crawlers/pctmix/crawler/showLinksCrawler')
const filmCrawlerDescargas2020 = require('./crawlers/pctmix/crawler/filmCrawler')
const tvshowCollectionCrawlerDescargas2020 = require('./crawlers/pctmix/crawler/tvshowCollectionCrawler')
/// www.dontorrent.org
const torrentLinksCrawlerDonTorrent = require('./crawlers/dontorrent/crawler/torrentLinksCrawler')
const filmCrawlerDonTorrent = require('./crawlers/dontorrent/crawler/filmCrawler')
const tvshowCollectionCrawlerDonTorrent = require('./crawlers/dontorrent/crawler/tvshowCollectionCrawler')

//
// Constants
//
const constantsDescargas2020 = require('./crawlers/pctmix/constants')
const constantsDonTorrent = require('./crawlers/dontorrent/constants')


/**
 * Crawl video premieres for all torrent sites
 *
 * @param {*} limit max number of video premieres to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'Show' array
 */
exports.crawlVideoPremieres = function (limit, onShowDataCrawled) {
    console.log('crawler->crawlVideoPremieres()')

    return showLinksCrawlerDescargas2020.crawlLinksFrom(constantsDescargas2020.URL_BASE_VIDEOPREMIERES_HD, limit, '.pelilist li a')
        .then(linkChainedToShowDataList => {
            return torrentLinksCrawlerDonTorrent.crawlLinksFrom(constantsDonTorrent.URL_BASE_BILLBOARDFILMS, limit, 'pelicula')
                .then(linkChainedToTorrentLinkList => {
                    // Concatemos los arrays
                    var newFullLinkChainedList = _concatLists(linkChainedToShowDataList, linkChainedToTorrentLinkList, limit)
                    //console.log(`newFullLinkChainedList - ${JSON.stringify(newFullLinkChainedList)}`)
                    return this.crawlFilmsByLinkChainedList(newFullLinkChainedList, onShowDataCrawled)
                })
        }).catch(err => {
            console.error(`ERROR! - crawler->crawlVideoPremieres(): '${err}'`)
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
        return this.crawlFilmsByLinkChainedList(linkChainedToShowDataList, onShowDataCrawled)
    }).catch(err => {
        console.error(`ERROR! - crawler->crawlVideoPremieres(): '${err}'`)
    })
}


/**
 * TODO: Comentar
 */
exports.crawlFilmsByLinkChainedList = function (linkChainedList, onShowDataCrawled) {
    console.log('crawler->crawlFilmsByLinkChainedList()')

    var actions = linkChainedList.map(
        linkToShowData => {
            return _doCrawlFilmAndSearchInXMDBfrom(linkToShowData)
        }
    )
    // eslint-disable-next-line no-undef
    return Promise.all(actions)
        .then(
            shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
                var showsFiltered = _removeDuplicatedShowsByName(shows)
                if (onShowDataCrawled) {
                    showsFiltered.map(onShowDataCrawled)
                }
                return showsFiltered
            }
        )
}

/**
 * Crawl TVShowsCollection for all torrent sites
 *
 * @param {*} limit max number of TVShows to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'ShowCollection' array
 */
exports.crawlTVShowCollections = function (limit, onShowDataCrawled) {
    console.log('crawler->crawlTVShowCollections()')

    return showLinksCrawlerDescargas2020.crawlLinksFrom(constantsDescargas2020.URL_BASE_TVSHOWS_HD, limit, '.pelilist li a')
        .then(linkChainedToShowDataList => {
            return torrentLinksCrawlerDonTorrent.crawlLinksFrom(constantsDonTorrent.URL_BASE_TVSHOWS_HD, limit, 'serie')
                .then(linkChainedToTorrentLinkList => {
                    // Concatemos los arrays
                    var newFullLinkChainedList = _concatLists(linkChainedToShowDataList, linkChainedToTorrentLinkList, limit)
                    //console.log(`newFullLinkChainedList - ${JSON.stringify(newFullLinkChainedList)}`)
                    return this.crawlTVShowCollectionsByLinkChainedList(newFullLinkChainedList, onShowDataCrawled)
                })
        }).catch(err => {
            console.error(`ERROR! - crawler->crawlTVShowCollections(): '${err}'`)
        })
}

/**
 * Crawl TVShowscollection from showCollectionList where every showCollection object, has minimal information:
 * .e.g:       
 *  showCollection1.name = 'modern-family/2261'
 *  showCollection1.domain = 'pctmix'
 *  showCollection1.url = 'https://pctmix/series-hd/modern-family/2261'
 * 
 *
 * @param {*} limit max number of the collection TVShows to crawl
 * @param {*} showCollectionList showCollection list for updating with the rest of values
 * @returns Promise with new 'ShowCollection' array with al TVShows information
 */
exports.crawlTVShowCollectionsBy = function (limit, showCollectionList) {
    console.log(`crawler->crawlTVShowCollections() from showCollectionList with '${showCollectionList.length}' elements'`)

    var actions = showCollectionList.map(showCollection => {
        //console.log("showCollection---->: " + JSON.stringify(showCollection))
        if (showCollection.domain == constantsDescargas2020.DOMAIN) {
            return tvshowCollectionCrawlerDescargas2020.crawlDataShowCollection(
                showCollection.url, limit)
        }
        if (showCollection.domain == constantsDonTorrent.DOMAIN) {
            return tvshowCollectionCrawlerDonTorrent.crawlDataShowCollection(
                showCollection.url, limit)
        }
    })

    // eslint-disable-next-line no-undef
    return Promise.all(actions).then(
        showCollectionsList => {
            return showCollectionsList
        })
}

/**
 * Crawl TVShowscollection from LinkChained array data
 *
 * @param {*} linkChainedList Linkchained list
 * @returns Promise with 'Show' array with al TVShows information, without duplications shows (by title)
 */
exports.crawlTVShowCollectionsByLinkChainedList = function (linkChainedList, onShowDataCrawled) {
    console.log('crawler->crawlTVShowCollectionsByLinkChainedList()')

    var actions = linkChainedList.map(
        linkToShowData => {
            return _doCrawlTVShowCollectionAndSearchFrom(linkToShowData)
        }
    )
    // eslint-disable-next-line no-undef
    return Promise.all(actions)
        .then(
            shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
                var showsFiltered = _removeDuplicatedShowsByName(shows)
                if (onShowDataCrawled) {
                    showsFiltered.map(onShowDataCrawled)
                }
                return showsFiltered
            }
        )
}


/**
 * Search show info from TMDB and OMDB database films
 *
 * @param {*} show Show object with the title to find
 * @param {*} kind movie or tv. If none, default is tv
 */
exports.searchShowInXMDB = function (show, kind, debug = false) {
    return _doSearchShowInXMDB(show, kind, debug)
}

// ----------------------------------------------------------------------------
//
// Private functions
//

function _doCrawlFilmAndSearchInXMDBfrom(linkChained) {

    //console.log(`crawler : _doCrawlAndSearchFrom() ${linkToShowData.from}`)

    if (linkChained.domain == constantsDescargas2020.DOMAIN) {
        return filmCrawlerDescargas2020.crawlDataFilm(linkChained.from)
            .then(show => {
                return _doSearchShowInXMDB(show, 'movie')
            })
            .catch(err => {
                console.error(`ERROR! - _doCrawlFilmAndSearchInXMDBfrom on domain ${constantsDescargas2020.DOMAIN}: ${err}`)
            })
    }
    if (linkChained.domain == constantsDonTorrent.DOMAIN) {
        return filmCrawlerDonTorrent.crawlDataFilm(linkChained.from)
            .then(show => {
                //console.log(`crawler : _doCrawlAndSearchFrom():  --> ${JSON.stringify(show)}\n\n`);
                return _doSearchShowInXMDB(show, 'movie')
            })
            .catch(err => {
                console.error(`ERROR! - _doCrawlFilmAndSearchInXMDBfrom on domain ${constantsDonTorrent.DOMAIN}: ${err}`)
            })
    }
}

// Cargamos solo el primer show de la coleccion pues nos sirve para mostrar datos de la portada
function _doCrawlTVShowCollectionAndSearchFrom(linkChained) {

    //console.log(`_doCrawlTVShowCollectionAndSearchFrom - linkToShowData: ${JSON.stringify(linkToShowData)}`)
    if (linkChained.domain == constantsDescargas2020.DOMAIN) {

        return tvshowCollectionCrawlerDescargas2020.crawlDataShowCollection(linkChained.from, 1)
            .then(showCollection => {
                const show = showCollection.shows[0]
                //console.log(`_doCrawlTVShowCollectionAndSearchFrom - show '${show.title}'. Error code: '${show.error}' `)
                return _doSearchShowInXMDB(show, 'tv')
            }).catch(err => {
                console.error(`ERROR! - _doCrawlTVShowCollectionAndSearchFrom on domain ${constantsDescargas2020.DOMAIN}: ${err}`)
            })
    } if (linkChained.domain == constantsDonTorrent.DOMAIN) {

        return tvshowCollectionCrawlerDonTorrent.crawlDataShowCollection(linkChained.from, 1)
            .then(showCollection => {
                const show = showCollection.shows[0]
                //console.log(`_doCrawlTVShowAndSearchFrom - show '${show.title}'. Error code: '${show.error}' `)
                return _doSearchShowInXMDB(show, 'tv')
            }).catch(err => {
                console.error(`ERROR! - _doCrawlTVShowCollectionAndSearchFrom on domain ${constantsDonTorrent.DOMAIN}: ${err}`)
            })
    }
}


function _doSearchShowInXMDB(showMixed, kind, debug = false) {
    // En TMDB por titulo en castellano que es muy fiable
    return tmdb.searchShow(showMixed.title, showMixed.year, kind, debug)
        .then(tmdbShow => {
            //console.log(`_doSearchShowInXMDB - Searching in TMDB by spanish title '${showMixed.title}'. Error code: '${tmdbShow.error}' `)
            if (tmdbShow.originalTitle != null) {
                showMixed.originalTitle = tmdbShow.originalTitle
                //console.log(`           - Set original title to '${showMixed.originalTitle}' from TMDB`)

            }
            // Sobreescribirmos con datos de TMDB mas fiables
            /*
            if (tmdbShow.year != null) {
                showMixed.year = tmdbShow.year
            }
            */
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
            if (tmdbShow.urlwithCover != null) {
                showMixed.urlwithCover = tmdbShow.urlwithCover
            }
            // Intentamos buscar en OMDB por titulo origignal
            var searchTitle = showMixed.originalTitle
            if (searchTitle == null) {
                searchTitle = showMixed.title
            }
            return omdb.searchShow(searchTitle, debug)
        })
        .then(omdbShow => {
            // Estos campos pueden venir nulos y los completamos
            //console.log(`_doSearchShowInXMDB - Searching in OMDB for title '${omdbShow.title}'. Error code: '${omdbShow.error}'`)

            /*
            if (showMixed.year == null) {
                showMixed.year = omdbShow.year
            }
            */
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

            if (showMixed.urlwithCover == null) {
                showMixed.urlwithCover = omdbShow.urlwithCover
            }

            return showMixed

        })
        .catch(err => {
            console.error('ERROR! - doSearchInXMDB - Error on search:' + err)
        })
}

function _removeDuplicatedShowsByName(shows) {
    /*
     console.log('ANTES: ')
     for (let i = 0; i < shows.length; i++) {
         console.log(`show.title: ${shows[i].title}`)
     }
     console.log('*********')
 */
    var uniq = {}
    var showsFiltered = shows.filter(obj => !uniq[obj.title] && (uniq[obj.title] = true)) // Filtramos repetidos
    /*
        console.log('DESPUES: ')
        for (let i = 0; i < showsFiltered.length; i++) {
            console.log(`show.title: ${showsFiltered[i].title}`)
        }
        console.log('*********')
    */
    return showsFiltered
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
        if (linkListOne[i]) {
            linkListFinal.push(linkListOne[i])
        }
    }

    for (let i = 0; i < limitSecondList; i++) {
        if (linkListTwo[i]) {
            linkListFinal.push(linkListTwo[i])
        }
    }
    //console.log(`linkListFinal: ${JSON.stringify(linkListFinal)}`)

    return linkListFinal
}
