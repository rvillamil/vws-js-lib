//
// NPM modules
//
const fs = require('fs')
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../../../model/show')
const ShowParser = require('../parser/showParser')

//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping for film data as the name, url with torrent file...etc
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The Film, https://descargas2020.org/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
 * 
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataFilm = function (urlWithShow) {
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
            _parseScrapingData(show, $)
            return show
        })
        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataFilm: '${err}'`)
            show.error = err
        })
}

/**
 * Scraping for film data as the name, url with torrent file...etc
 *
 * @param {*} pathFile where 'Show' data is located
 *  e.g: The Film, https://descargas2020.org/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
 *
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataFilmFromFile = function (pathFile) {
    var show = new Show()
    show.urlBase = pathFile
    var $ = cheerio.load(fs.readFileSync(pathFile))

    _parseScrapingData(show, $)
    console.log(`${Constants.DOMAIN} - 3`)
    return show
}

//
// Private functions 
//
function _parseScrapingData(show, $) {

    console.log(`${Constants.DOMAIN} - crawlDataFilm from URI '${show.urlBase}'`)

    show.title = ShowParser.parseTitle($.html())
    console.log(`title: ${show.title}`)

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
    // console.log(`SHOW - crawlDataFilm:  --> ${JSON.stringify(show)}\n\n`);
    show.error = 0
    //return show
}