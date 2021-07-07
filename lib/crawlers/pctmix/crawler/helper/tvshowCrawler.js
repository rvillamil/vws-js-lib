//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../../../../model/show')
const filmCrawler = require('../filmCrawler')
const tvshowParser = require('../../parser/tvshowParser')

//
// Constants
//
const Constants = require('../../constants')

/**
 * Scraping for TVShow data as the name, url with torrent file...etc
 *
 * @param {*} urlWithTVShow URL where 'Show' data is located
 *  e.g: The TVShow, e.g: https://pctmix.org/descargar/serie-en-hd/watchmen/temporada-1/capitulo-06/
 *
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataTVShow = function (urlWithTVShow) {

    var strURLWithTVShow = urlWithTVShow + ''
    console.log(`${Constants.DOMAIN} - crawlDataTVShow on url '${strURLWithTVShow}'`)

    var show = new Show()
    const options = {
        uri: strURLWithTVShow,
        transform: function (body) {
            //var strBody = body + ''
            return cheerio.load(body)
        }
    }

    return rp(options)
        .then(function ($) {
            show.urlBase = strURLWithTVShow
            show.domain = Constants.DOMAIN
            console.log(`tvShowCrawler - crawlDataTVShow:  --> ` + $.html())
            return filmCrawler.crawlDataFilm(show.urlBase).then(
                tvshow => {
                    tvshow.domain = Constants.DOMAIN
                    tvshow.collectionName = tvshowParser.parseCollectionName($)
                    tvshow.currentSession = tvshowParser.parseSession($.text())
                    tvshow.currentEpisode = tvshowParser.parseEpisode($.text(), tvshow.currentSession)

                    return tvshow
                })
        })
        .catch(err => {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataTVShow: '${err}'`)
            show.error = err
        })
}