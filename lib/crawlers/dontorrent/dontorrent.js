// @ts-nocheck
//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const showLinksCrawler = require('./showLinksCrawler')

//
// Constants
//
const Constants = require('./constants')

//
// Export my NPM functions
//
/**
 * Crawl URLs from 'https://dontorrent.org/ultimos/' link, with torrent video premieres
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith array of links
*/
exports.crawlLinkToURLsWithVideoPremieres = function (limit) {
    console.log(`${Constants.DOMAIN}: crawlLinkToURLsWithVideoPremieres data from URL '${Constants.URL_BASE_VIDEOPREMIERES_HD}'`)
    return showLinksCrawler.crawlLinksFrom(Constants.URL_BASE_VIDEOPREMIERES_HD, limit, 'pelicula')
}

/**
 * Crawl URLs from 'https://dontorrent.org/ultimos/' link, with torrent billboard films
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith array of links
*/
exports.crawlLinkToURLsWithBillboardFilms = function (limit) {
    console.log(`${Constants.DOMAIN}: crawlLinkToURLsWithBillboardFilms data from URL '${Constants.URL_BASE_BILLBOARDFILMS}'`)
    return showLinksCrawler.crawlLinksFrom(Constants.URL_BASE_BILLBOARDFILMS, limit, 'NO_HAY_EN_ESTA_WEB_ESTRENOS_DE_CINE')
}

/**
 * Crawl URLs from 'https://dontorrent.org/ultimos/' link, with torrent series
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith array of links
*/
exports.crawlLinkToURLsWithLatestTVShows = function (limit) {
    console.log(`${Constants.DOMAIN}: crawlLinkToURLsWithLatestTVShows data from URL '${Constants.URL_BASE_TVSHOWS_HD}'`)
    return showLinksCrawler.crawlLinksFrom(Constants.URL_BASE_VIDEOPREMIERES_HD, limit, 'serie')
}

/**
 * Crawl ...
 */
exports.crawlLinkToURLsWithEpisodes = function (limit, collectionName) {
    // TODO : Implementar ¿Esto es necesario?
}
