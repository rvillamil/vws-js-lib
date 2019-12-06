//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')

//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping torrent links list
 *
 * @param {*} url URL with links
 * @param {*} limit If not null, limit the number of links to parse
 * @param {*} htmlSelector html selector in the html document crawled
 *         
 *
 * @returns Promise with links array, with the torrent video links
 */
exports.crawlLinksFrom = function (url, limit, htmlSelector) {

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
            if (link.includes(htmlSelector)) {
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
        console.error(`ERROR! - ${Constants.DOMAIN} - crawlLinksFrom: '${err}'`)
    })
}

