const rp = require('request-promise')
const cheerio = require('cheerio')

/**
* Crawling links from 'dontorrent' portal, searching urls whith torrent video files
*
* @param {*} url URL from 'dontorrent' domain
* @param {*} limit If not null, limit the number of links to parse
* @param {*} filter html selector in the html document crawled
*
* @returns Promise with array, with the torrent video links
*/
exports.crawlLinksFrom = function (url, limit, filter) {

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

