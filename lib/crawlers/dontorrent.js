// @ts-nocheck
//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../model/show')
const LinkChained = require('../model/linkChained')
const ShowCollection = require('../model/showCollection')

//
// Constants
//
const URL_BASE_VIDEOPREMIERES_HD = 'https://dontorrent.org/ultimos'
//const URL_BASE_BILLBOARDFILMS = 'https://descargas2020.org/estrenos-de-cine/'
//const URL_BASE_TVSHOWS_HD = 'https://descargas2020.org/series-hd/'

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
    console.log(`Crawling data from URL '${URL_BASE_VIDEOPREMIERES_HD}'`);
    return _crawlLinksFrom(URL_BASE_VIDEOPREMIERES_HD, limit, 'pelicula')
}

/**
 * Crawling links from 'dontorrent' portal, searching urls whith torrent video files
 *
 * @param {*} url URL from 'dontorrent' domain
 * @param {*} limit If not null, limit the number of links to parse
 * @param {*} htmlSelector html selector in the html document crawled
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

        const texto = $('.text-primary')

        $('.text-primary').each(function () {
            var link = $(this).attr('href')
            console.log(`Link: ${link}`)
            links.push({ "link": link })
        })

        //console.log(`Links: ${links}`)
        return links

    }).catch(function (err) {
        console.error(`ERROR! - _crawlLinksFrom: '${err}'`)
    })
}

