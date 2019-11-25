// @ts-nocheck
//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../../model/show')
const LinkChained = require('../../model/linkChained')
const ShowCollection = require('../../model/showCollection')
const ShowCrawler = require('./showCrawler')

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
    return _crawlLinksFrom(Constants.URL_BASE_VIDEOPREMIERES_HD, limit, 'pelicula')
}

/**
 * Crawl URLs from 'https://dontorrent.org/ultimos/' link, with torrent billboard films
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith array of links
*/
exports.crawlLinkToURLsWithBillboardFilms = function (limit) {
    console.log(`${Constants.DOMAIN}: crawlLinkToURLsWithBillboardFilms data from URL '${Constants.URL_BASE_BILLBOARDFILMS}'`)
    return _crawlLinksFrom(Constants.URL_BASE_BILLBOARDFILMS, limit, 'NO_HAY_EN_ESTA_WEB_ESTRENOS_DE_CINE')
}

/**
 * Crawl URLs from 'https://dontorrent.org/ultimos/' link, with torrent series
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith array of links
*/
exports.crawlLinkToURLsWithLatestTVShows = function (limit) {
    // TODO : Implementar
    console.log(`${Constants.DOMAIN}: crawlLinkToURLsWithLatestTVShows data from URL '${Constants.URL_BASE_TVSHOWS_HD}'`)
}

/**
 * Crawl ...
 */
exports.crawlLinkToURLsWithEpisodes = function (limit, collectionName) {
    // TODO : Implementar
}


/**
 * Crawl 'ShowCollection' data,
 */
exports.crawlDataShowCollection = function (collectionName, linkChainedToEpisodeList) {
    // TODO: Implementar
}

// ----------------------------------------------------------------------------
//
// Private functions
//
/**
* Crawling links from 'dontorrent' portal, searching urls whith torrent video files
*
* @param {*} url URL from 'dontorrent' domain
* @param {*} limit If not null, limit the number of links to parse
* @param {*} filter html selector in the html document crawled
*
* @returns Promise with array, with the torrent video links
*/
function _crawlLinksFrom(url, limit, filter) {
    var links = []
    const options = {
        uri: url,
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    return rp(options).then(function ($) {
        var counter = 0
        //console.log(`- All---> ${$.html()}`)
        //const texto = $('.text-primary')
        $('.text-primary').each(function () {
            var link = $(this).attr('href')
            // console.log(`_crawlLinksFrom: ${link}`)
            if (link.includes(filter)) {
                links.push(link)
                counter++
                if (limit != null && limit == counter) {
                    return false // break each bucle
                }
            }
        })
        //console.log(`Links: ${links}`)
        return links

    }).catch(function (err) {
        console.error(`ERROR! - _crawlLinksFrom: '${err}'`)
    })
}
