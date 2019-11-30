//
// NPM modules
//
const LinkChained = require('../../../model/linkChained')
const ShowCollection = require('../../../model/showCollection')
const tvshowCollectionParser = require('../parser/tvshowCollectionParser')
const showLinksCrawler = require('./showLinksCrawler')
const tvshowCrawler = require('./tvshowCrawler.js')

//
// Constants
//
const Constants = require('../constants')


/**
 * Scraping for TVShow Collection data
 *
 * @param {*} urlWithShowCollection URL where the collection is located
 *  e.g: The TVShow, https://descargas2020.org/series-hd/watchmen/5258
 *
 * @returns Promise with 'ShowCollection' data scraped
 */
exports.crawlDataShowCollection = function (urlWithShowCollection, limit) {

    console.log(`${Constants.DOMAIN} - crawlDataShowCollection on url '${urlWithShowCollection}'`)
    const showCollectionName = tvshowCollectionParser.parseUrlWithShowCollectionName(urlWithShowCollection)

    return showLinksCrawler.crawlLinksFrom(
        new LinkChained(`${Constants.URL_BASE_TVSHOWS_HD}${showCollectionName}`),
        limit,
        '.buscar-list .info a'
    ).then(linkChainedList => {
        console.log(`${Constants.DOMAIN} - crawlDataShowColldection - ${linkChainedList.length} episodes found`)
        //console.log(`linkChainedList --> ${JSON.stringify(linkChainedList)}`)
        return _doCrawlChainlinks(showCollectionName, linkChainedList)
    }).catch(err => {
        console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShowCollection: '${err}'`)
    })
}


// ----------------------------------------------------------------------------
//
// Private functions
//
function _doCrawlChainlinks(collectionName, linkChainedToEpisodeList) {

    var actions = linkChainedToEpisodeList.map(linkChained => {
        return tvshowCrawler.crawlDataTVShow(linkChained.current)
    })

    // eslint-disable-next-line no-undef
    return Promise.all(actions).then(shows => {
        var showCollection = new ShowCollection()
        showCollection.name = collectionName
        showCollection.url = Constants.URL_BASE_TVSHOWS_HD + collectionName
        shows.forEach(show => {
            show.collectionName = collectionName
            showCollection.shows.push(show)
        })
        return showCollection
    })
}


/**
 * Crawl URLs with the collection episodes from  https://descargas2020.org/series-hd/${collectionName} link
 *
 * @param {*} collectionName path in the url https://descargas2020.org/series-hd/${collectionName}, where de tvshow is located
 *      e.g: /siren/3797
 *
 * @param {*} limit episodes list limit to return
 * @returns Promise with linkChained list whith episode list
 *
linkChainedToShowDataList: -- > [{
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-05/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-04/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-03/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-02/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}]
*/
/*
exports.crawlLinkToURLsWithEpisodes = function (limit, collectionName) {
    return _crawlLinksFrom(
        new LinkChained(`${Constants.URL_BASE_TVSHOWS_HD}${collectionName}`),
        limit,
        '.buscar-list .info a'
    )
}
*/


/**
 * Crawl 'ShowCollection' data, from url https://descargas2020.org/series-hd/${collectionName} link, with a torrent video/film/TVShow file
 *
 * @param {*} collectionName path in the url https://descargas2020.org/series-hd/${collectionName}, where de tvshow is located
 *      e.g: /siren/3797
 * @param {*} linkChainedToEpisodeList LinkChained list, with links to TVShow episodes in the collection for crawl
 * @returns Promise with 'ShowCollection' data scraped
 */
/*
TODO: ESTA ES LA FORMA ANTIGUA....ESTOY REFACTORIZANDO
exports._doProcessChainlinks = function (collectionName, linkChainedToEpisodeList) {

    var actions = linkChainedToEpisodeList.map(linkChained => {
        return _crawlDataShow(linkChained.current, linkChained.from)
    })

    return Promise.all(actions).then(shows => {
        var showCollection = new ShowCollection()
        showCollection.url = Constants.URL_BASE_TVSHOWS_HD + collectionName
        shows.forEach(show => {
            showCollection.name = collectionName
            show.collectionName = collectionName
            showCollection.shows.push(show)
        })
        return showCollection
    })
}
*/

/*
function _doProcessChainlinks(linkChainedList) {

    var actions = linkChainedList.map(
        linkChained => {
            return _doCrawlDataTVShow(linkChained)
        }
    )

    // eslint-disable-next-line no-undef
    return Promise.all(actions)
        .then(
            shows => {
                // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
                //shows.map(onShowDataCrawled)
                //showCollection.shows = shows

                console.log('Fin - _doProcessChainlinks')
                return shows
            })
        .catch(
            console.error(`ERROR! - ${Constants.DOMAIN} - _doProcessChainlinks: '${err}'`)
        )
}
*/
/**
 * Crawl 'Show' data, from domain 'tumejortorrent.com', with a torrent video/film/TVShow file
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The Film, https://descargas2020.org/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
 *  e.g: The TVShow episode, https://descargas2020.org/descargar/serie-en-hd/erase-una-vez/temporada-7/capitulo-14/
 * @param {*} urlWithCollection URL where a 'Showcollection' is located. Optional
 *
 * @returns Promise with 'Show' data scraped
//FORMA ANTIGUA....TRATAR DE MODIFICAR

function _crawlDataShow(urlWithShow, urlWithCollection) {

    var strURLWithShow = urlWithShow + ''
    var strURLWithCollection = urlWithCollection + ''
    var show = new Show()
    const options = {
        uri: strURLWithShow,
        transform: function (body) {
            var strBody = body + ''
            return cheerio.load(strBody)
        }
    }

    return rp(options)
        .then(function ($) {
            // URL base
            show.urlBase = strURLWithShow
            console.log(`${Constants.DOMAIN} - crawlDataShow on url '${show.urlBase}'`)

            // Collection Name
            var urlSplittedStr = strURLWithCollection.split('/')
            if (urlSplittedStr.length > 1) {
                show.collectionName = `${urlSplittedStr[urlSplittedStr.length - 2]}/${
                    urlSplittedStr[urlSplittedStr.length - 1]}`
            }

            // Title
            show.title = ShowParser.parseTitle($.html())

            // Session
            const fullTitle = $('.page-box h1')
                .text()
                .trim()
            show.currentSession = ShowParser.parseSession(fullTitle)
            // Episode
            if (show.currentSession) {
                show.currentEpisode = ShowParser.parseEpisode(fullTitle, show.currentSession)
            }

            show.description = ShowParser.parseDescription($)
            show.originalTitle = ShowParser.parseOriginalTitle(show.description)
            show.sinopsis = ShowParser.parseSinopsis(show.description)
            // Description
            if (show.sinopsis) {
                // Si la sinopsis esta dentro de la descripcion..
                show.description = $('.descripcion_top')
                    .text()
                    .split('Sinopsis')[0] // Quitamos la sinopsis a la descripcion
            } else {
                show.sinopsis = $('.sinopsis').text() // Establecemos el valor de sinopsis que nos venga...
            }

            show.quality = ShowParser.parseQuality($)
            show.urlwithCover = ShowParser.parseURLWithCover($.html())
            show.releaseDate = ShowParser.parseReleaseDate($)
            show.fileSize = ShowParser.parseFileSize($)
            show.year = ShowParser.parseYearByShowDescription(show.description)
            if (!show.year) {
                if (show.releaseDate) {
                    show.year = ShowParser.parseYearByReleaseDate(show.releaseDate)
                }
            }
            show.urltodownload = ShowParser.parseURLToDownload($.html())
            // console.log(`SHOW - crawlDataShow:  --> ${JSON.stringify(show)}\n\n`);
            show.error = 0
            return show

        }).catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShow: '${err}'`)
            show.error = err
        })
}
 */
