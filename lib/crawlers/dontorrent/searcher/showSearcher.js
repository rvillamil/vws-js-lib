//
// Search shows in site
//

//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const searchParser = require('../parser/searchParser')

//
// Constants
//
const Constants = require('../constants')

/**
 * Search shows on dontorrent.org searcher
 *
 * @param {*} limit max number of shows to search
 * @returns 'searchResult' array object
 */
exports.search = function (text, limit) {

    const searchURL = encodeURI(`https://dontorrent.org/buscar/${text}`)
    console.log(`${Constants.DOMAIN} - showSearch->search(): ${searchURL}`)

    var searchResults = []
    const options = {
        uri: searchURL,
        transform: function (body) {
            var strBody = body + ''
            return cheerio.load(strBody)
        }
    }

    return rp(options)
        .then(function ($) {
            //console.log(`ALL: ${($)}`)
            searchResults = searchParser.parseTableWithTVShows($, limit)
            return searchResults
        })
        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - showSearcher - search: '${err}'`)
        })
}
