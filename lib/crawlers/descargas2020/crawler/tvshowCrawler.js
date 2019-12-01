//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../../../model/show')
const filmCrawler = require('./filmCrawler')
const tvshowParser = require('../parser/tvshowParser')

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

            return filmCrawler.crawlDataFilm(show.urlBase).then(
                film => {
                    film.collectionName = tvshowParser.parseCollectionName($)
                    film.currentSession = tvshowParser.parseSession($.text())
                    film.currentEpisode = tvshowParser.parseEpisode($.text(), film.currentSession)

                    return film
                })
        })
        .catch(err => {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataTVShow: '${err}'`)
            show.error = err
        })
}