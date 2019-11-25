// @ts-nocheck
//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../../model/show')
const ShowCollection = require('../../model/showCollection')
const ShowParser = require('./showParser')

//
// Constants
//
const Constants = require('./constants')

/**
 * Crawl 'Show' data, from domain 'dontorrent.com', with a torrent TVShow file
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The TVShow, https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada
 *
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataShowCollection = function (urlWithShow) {

    var strURLWithShow = urlWithShow + ''
    var showCollection = new ShowCollection()
    const options = {
        uri: strURLWithShow,
        transform: function (body) {
            var strBody = body + ''
            return cheerio.load(strBody)
        }
    }

    return rp(options)
        .then(function ($) {
            //console.log(`ALL: ${($)}`)
            console.log(`${Constants.DOMAIN} - crawlDataShowCollection on url '${strURLWithShow}'`)

            // ShowCollection Object
            var showCollection = ShowParser.parseTableWithTVShows($)
            showCollection.name = ShowParser.parseUrlWithShowCollectionName(strURLWithShow)
            showCollection.url = strURLWithShow

            /*
            var show = new Show()
            // Propiedas comunes a todos los Show
            show.urlBase = strURLWithShow
            show.title = ShowParser.parseTitle($)
            show.sinopsis = ShowParser.parseSinopsis($)
            show.description = ShowParser.parseDescription($)
            show.quality = ShowParser.parseQuality($)
            show.fileSize = 'N/A' // No está disponible
            show.urlwithCover = ShowParser.parseURLWithCover($)
            show.year = ShowParser.parseYear($)
            show.urltodownload = ShowParser.parseURLToDownload($)

            // Propiedades particulares de cada show
            show.originalTitle = '' // Lo buscaremos en IMDB o similar. Lo dejamos en blanco
            show.releaseDate = ShowParser.parseReleaseDate($)
            show.currentSession = ShowParser.parseSession($)
            show.currentEpisode = ShowParser.parseEpisode($)
    */


            console.log(`Showcollection - ${showCollection.toStringSimple()} `)

            showCollection.error = 0
            return showCollection
        })
        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShowCollection: '${err}'`)
            showCollection.error = err
        })
}
