//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const LinkChained = require('../../../model/linkChained')

/**
 * Scraping links list
 * 
 * @param {*} linkChained URL from 'descargas2020' domain
 * @param {*} limit If not null, limit the number of links to parse
 * @param {*} htmlSelector html selector in the html document crawled
 *          .e.g. '.pelilist li a'
 *
 * @returns Promise with linkChained array, with the torrent video links
 */
exports.crawlLinksFrom = function (linkChained, limit, htmlSelector) {
    var linkChainedList = []

    const options = {
        uri: linkChained.current,
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    return rp(options)
        .then(function ($) {
            var currentHREF = ''
            var previousHREF = ''
            var counter = 0

            $(`${htmlSelector}`).each(function (index, element) {
                currentHREF = $(element).attr('href')
                //console.log(`- linkCrawled =${currentHREF}`)
                if (currentHREF.trim() != previousHREF.trim()) {
                    counter++

                    previousHREF = currentHREF
                    currentHREF = $(element).attr('href')

                    linkChained = new LinkChained()
                    linkChained.current = currentHREF
                    linkChained.from = linkChained.current
                    linkChainedList.push(linkChained)
                    if (limit != null && limit == counter) {
                        return false // break each bucle
                    }
                }
            })

            return linkChainedList
        })

        .catch(function (err) {
            console.error(`ERROR! - _crawlLinksFrom: '${err}'`)
        })
}
