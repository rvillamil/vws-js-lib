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
            var showCollection = ShowParser.parseTableWithTVShows($) // Aqui obtenemos la release date, session y episode
            showCollection.name = ShowParser.parseUrlWithShowCollectionName(strURLWithShow)
            showCollection.url = strURLWithShow
            // Parseamos el show 
            const title = ShowParser.parseTitle($)
            const sinopsis = ShowParser.parseSinopsis($)
            const description = ShowParser.parseDescription($)
            const quality = ShowParser.parseQuality($)
            const urlwithCover = ShowParser.parseURLWithCover($)
            const year = ShowParser.parseYearByRelaseDate(showCollection.shows[0].releaseDate)
            // Asginamos los mismos datos a todos los shows..
            showCollection.shows.forEach(show => {
                show.urlBase = strURLWithShow
                show.title = title
                show.sinopsis = sinopsis
                show.description = description
                show.quality = quality
                show.fileSize = 'N/A' // No está disponible
                show.urlwithCover = urlwithCover
                show.year = year
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
