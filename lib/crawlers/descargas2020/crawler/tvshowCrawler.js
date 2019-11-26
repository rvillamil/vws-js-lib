//
// NPM modules
//
const rp = require('request-promise')
const fs = require('fs')
const cheerio = require('cheerio')
const Show = require('../../../model/show')
const filmCrawler = require('./filmCrawler')

//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping for TVShow data as the name, url with torrent file...etc
 *
 * @param {*} urlWithTVShow URL where 'Show' data is located
 *  e.g: The TVShow, e.g: https://descargas2020.org/descargar/serie-en-hd/watchmen/temporada-1/capitulo-06/
 *
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataTVShow = function (urlWithTVShow) {

    var strURLWithTVShow = urlWithTVShow + ''
    var show = new Show()
    const options = {
        uri: strURLWithTVShow,
        transform: function (body) {
            var strBody = body + ''
            return cheerio.load(strBody)
        }
    }

    return rp(options)
        .then(function ($) {
            show.urlBase = strURLWithTVShow
            _parseScrapingData(show, $, false)
            return show

            //console.log(`ALL: ${($)}`)       
            /*
            show.urlBase = strURLWithTVShow
            console.log(`${Constants.DOMAIN} - crawlDataTVShow on url '${show.urlBase}'`)

            show.title = ShowParser.parseTitle($)
            console.log(`title '${show.title}'`)

            show.sinopsis = ShowParser.parseSinopsis($)
            console.log(`sinopsis '${show.sinopsis}'`)

            show.description = ShowParser.parseDescription($)
            console.log(`description '${show.description}'`)

            show.quality = ShowParser.parseQuality($)
            console.log(`quality '${show.quality}'`)

            show.fileSize = ShowParser.parseFileSize($)
            console.log(`fileSize '${show.quality}'`)

            show.urlwithCover = ShowParser.parseURLWithCover($)
            console.log(`urlwithCover '${show.quality}'`)

            show.year = ShowParser.parseYearByRelaseDate(show.releaseDate)
            console.log(`year '${show.quality}'`)

            show.urltodownload = ShowParser.parseURLToDownload($)
            console.log(`URLToDownload '${show.urltodownload}'`)

            show.releaseDate = ShowParser.parseReleaseDate($)
            console.log(`Release dateo '${show.releaseDate}'`)

            show.originalTitle = ShowParser.parseOriginalTitle($)
            console.log(`Original Title '${show.originalTitle}'`)

            */

            // console.log(`SHOW - crawlDataTVShow:  --> ${JSON.stringify(show)}\n\n`);

        })

        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataTVShow: '${err}'`)
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
exports.crawlDataTVShowFromFile = function (pathFile) {
    var show = new Show()
    show.urlBase = pathFile
    var $ = cheerio.load(fs.readFileSync(pathFile))

    _parseScrapingData(show, $, true)

    return show
}

//
// Private functions 
//
function _parseScrapingData(show, $, fromFile) {
    console.log(`${Constants.DOMAIN} - crawlDataTVShow from URI '${show.urlBase}'`)

    if (fromFile) {
        // Tiene el mismo formato que un film y aniaimos el episodio y la sesion
        show = filmCrawler.crawlDataFilmFromFile(show.urlBase)
    } else {
        // Tiene el mismo formato que un film y aniaimos el episodio y la sesion
        filmCrawler.crawlDataFilm(show.urlBase).then(film => {
            //show = film
            show.currentSession = 'XX'
            show.currentEpisode = 'YY'
            show.collectionName = "ddd/AAA"
            show.title = film.title
        })
    }
}