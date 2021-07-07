//
// NPM modules
//
const showLinksCrawlerPCTMIX = require('request-promise')
const cheerio = require('cheerio')
const LinkChained = require('../../../model/linkChained')

//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping links list
 * 
 * @param {*} url from 'pctmix' domain with links
 * @param {*} limit If not null, limit the number of links to parse
 * @param {*} htmlSelector html selector in the html document crawled
 *          .e.g. '.pelilist li a'
 *
 * @returns Promise with linkChained array, with the torrent video links
 */
exports.crawlLinksFrom = function (url, limit, htmlSelector) {
    var linkChainedList = []

    const options = {
        uri: url,
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    return showLinksCrawlerPCTMIX(options)
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

                    var linkChained = new LinkChained()
                    linkChained.domain = Constants.DOMAIN
                    linkChained.from = currentHREF
                    linkChainedList.push(linkChained)
                    if (limit != null && limit == counter) {
                        return false // break each bucle
                    }
                }
            })

            return linkChainedList
        })

        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlLinksFrom: '${err}'`)
        })
}