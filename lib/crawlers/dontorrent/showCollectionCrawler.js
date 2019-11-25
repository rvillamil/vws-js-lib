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
            console.log(`${Constants.DOMAIN} - crawlDataShowCollection on url '${strURLWithShow}'`)

            // ShowCollection Object
            showCollection.name = ShowParser.parseUrlWithShowCollectionName(strURLWithShow)
            //
            // ---- Datos comnunes de la pelicula o serie que solo estan en la web
            //
            //console.log(`ALL: ${($)}`)
            /*
            //show.urlBase = strURLWithShow

            show.title = ShowParser.parseTitle($)
            show.sinopsis = ShowParser.parseSinopsis($)
            show.description = ShowParser.parseDescription($)
            show.quality = ShowParser.parseQuality($)
            show.fileSize = ShowParser.parseFileSize($)
            show.urlwithCover = ShowParser.parseURLWithCover($)
            show.year = ShowParser.parseYear($)
            show.urltodownload = ShowParser.parseURLToDownload($)
            show.releaseDate = ShowParser.parseReleaseDate($)
            show.originalTitle = ShowParser.parseOriginalTitle($)
            */
            //
            // ---- ONLY TVSHOWS ----
            //
            // Collection Name
            // TODO: show.collectionName = _parseCollectionName($)
            // Session
            // TODO: show.currentSession = _parseSession($)
            // Episode
            // TODO: show.currentEpisode = _parseEpisode($)


            // console.log(`${Constants.DOMAIN} - crawlDataShowCollection:  --> ${JSON.stringify(show)}\n\n`);

            showCollection.error = 0
            return showCollection
        })
        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShowCollection: '${err}'`)
            showCollection.error = err
        })
}
