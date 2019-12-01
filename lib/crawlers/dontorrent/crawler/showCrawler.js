//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../../../model/show')
const ShowParser = require('../parser/showParser')

//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping for 'Show' data: Film or TVShow
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 * 
 *  e.g: The Film, https://dontorrent.org/pelicula/21442/Vengadores-Endgame-Open-Matte-Imax
 *  e.g: The TVShow, https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada
 *
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataShow = function (urlWithShow) {

    var strURLWithShow = urlWithShow + ''
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

            //
            // ---- Datos comnunes de la pelicula o serie que solo estan en la web
            //
            //console.log(`ALL: ${($)}`)
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

            // console.log(`${Constants.DOMAIN} - crawlDataShow:  --> ${JSON.stringify(show)}\n\n`);

            show.error = 0
            return show
        })
        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShow: '${err}'`)
            show.error = err
        })
}
