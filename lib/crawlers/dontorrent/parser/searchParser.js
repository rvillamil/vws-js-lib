//
// Utilities for parsing
//

//
// NPM modules
//
const cheerio = require('cheerio')
const SearchResult = require('../../../model/searchResult')
//
// Constants
//

const searchResultsConstants = require('../../../model/searchResultConstants')
const Constants = require('../constants')

exports.parseTableWithTVShows = function ($, limit) {
    var searchResults = []
    var counter = 0
    var tableElements = $('.card-body p')

    for (let i = 0; i < tableElements.length; i++) {
        var $2 = cheerio.load($(tableElements[i]).html())
        var urlPath = $2('a').attr('href')
        if (urlPath) {
            var typeOfShow = $2('.badge.badge-primary.float-right').text()

            if (typeOfShow == 'Serie') {
                var searchResultTVshow = new SearchResult()
                searchResultTVshow.urlWithShow = `https://${Constants.DOMAIN}${urlPath}`
                searchResultTVshow.type = searchResultsConstants.TVSHOWCOLLECTION
                searchResults.push(searchResultTVshow)
                counter++
            }
            if (typeOfShow == 'Película') {
                var searchResultFilm = new SearchResult()
                searchResultFilm.urlWithShow = `https://${Constants.DOMAIN}${urlPath}`
                searchResultFilm.type = searchResultsConstants.FILM
                searchResults.push(searchResultFilm)
                counter++
            }
        }
        if (counter == limit) {
            i = tableElements.length
        }
    }
    //console.log(`searchResults - ${JSON.stringify(searchResults)} `)
    return searchResults
}