// @ts-nocheck
//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const ShowCollection = require('../../model/showCollection')
const Show = require('../../model/show')
const ShowParser = require('./showParser')
const showLinksCrawler = require('./showLinksCrawler')
const LinkChained = require('../../model/linkChained')

//
// Constants
//
const Constants = require('./constants')

//
// TODO: Necesitamos las dos funciones aqui : crawlDataShowCollection, crawlDataTVShow
//


/**
 * Crawl 'Show' data, from domain 'descargas2020.com', with a torrent TVShow file
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The TVShow, https://descargas2020.org/series-hd/watchmen/5258
 *
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataShowCollection = function (urlWithShowCollection) {

    var strURLWithShowCollection = urlWithShowCollection + ''
    var showCollection = new ShowCollection()
    const options = {
        uri: strURLWithShowCollection,
        transform: function (body) {
            var strBody = body + ''
            return cheerio.load(strBody)
        }
    }

    return rp(options)
        .then(function ($) {
            //console.log(`ALL: ${($)}`)
            console.log(`${Constants.DOMAIN} - crawlDataShowCollection on url '${strURLWithShowCollection}'`)
            showCollection.name = ShowParser.parseUrlWithShowCollectionName(strURLWithShowCollection)
            showCollection.url = strURLWithShowCollection

            // Procesamos todos los links de la pagina: Nos debería de retornar una 
            // lista de urls en formato parseable para el 'crawlDataTVShow'
            showLinksCrawler.crawlLinksFrom(
                new LinkChained(`${Constants.URL_BASE_TVSHOWS_HD}${showCollection.name}`),
                10,
                '.buscar-list .info a'
            ).then(linkChainedList => {

                for (var index = 0; index < linkChainedList.length; index++) {

                    this.crawlDataTVShow(linkChainedList[index].current)
                        .then(show => {
                            showCollection.push(show)
                        })

                    /*
                    linkChainedToCollectionList[index].from =
                        linkChainedToCollectionList[index].current
                    linkChainedToCollectionList[index].current =
                        linkChainedWithLatestEpisodeList[index][0].current
                        */
                }

                console.log(`linkChainedList --> ${JSON.stringify(linkChainedList)}`)
            })

            //console.log(`Showcollection - ${showCollection.toStringSimple()} `)
            showCollection.error = 0
            return showCollection
        })
        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShowCollection: '${err}'`)
            showCollection.error = err
        })
}


// ----------------------------------------------------------------------------
//
// Private functions
//

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
exports.crawlDataShowCollection = function (collectionName, linkChainedToEpisodeList) {

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
