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
 * Scraping for film data
 * 
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The Film, https://pctmix.org/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
 * 
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataFilm = function (urlWithShow) {
    var strURLWithShow = urlWithShow + ''
    console.log(`${Constants.DOMAIN} - crawlDataFilm on url '${urlWithShow}'`)

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
            show.urlBase = strURLWithShow
            show.domain = Constants.DOMAIN

            _parseScrapingData(show, $)
            //console.log(`filmCrawler - crawlDataFilm:  --> ${JSON.stringify(show)}\n\n`);
            //console.log(`filmCrawler - crawlDataFilm-domain:  --> ${JSON.stringify(show.domain)}\n\n`);
            return show
        })
        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataFilm: '${err}'`)
            show.error = err
        })
}

//
// Private functions 
//
function _parseScrapingData(show, $) {
    //console.log(`${Constants.DOMAIN} - _parseScrapingData from URI '${show.urlBase}'`)
    show.title = ShowParser.parseTitle($)
    show.description = ShowParser.parseDescription($)
    show.originalTitle = ShowParser.parseOriginalTitle(show.description)
    show.sinopsis = ShowParser.parseSinopsis(show.description)
    // Description
    if (show.sinopsis) {
        // Si la sinopsis esta dentro de la descripcion..
        show.description = $('.descripcion_top').text()
        if (show.description) {
            show.description = show.description.split('Sinopsis')[0] // Quitamos la sinopsis a la descripcion
        }
    } else {
        show.sinopsis = $('.sinopsis').text() // Establecemos el valor de sinopsis que nos venga...
    }

    show.quality = ShowParser.parseQuality($)
    show.urlwithCover = ShowParser.parseURLWithCover($)
    show.releaseDate = ShowParser.parseReleaseDate($)
    show.fileSize = ShowParser.parseFileSize($)
    show.year = ShowParser.parseYearByTitle($)
    if (!show.year) {
        if (show.description) {
            show.year = ShowParser.parseYearByShowDescription(show.description)
        }
        if (show.year == null) {
            show.year = ShowParser.parseYearByReleaseDate(show.releaseDate)
        }
    }
    show.urltodownload = ShowParser.parseURLToDownload($)
    show.error = 0
}