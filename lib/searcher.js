//
// NPM modules
//

/// www.dontorrent.org
const showSearchDonTorrent = require('./crawlers/dontorrent/searcher/showSearcher')
const filmCrawlerDonTorrent = require('./crawlers/dontorrent/crawler/filmCrawler')
const tvshowCollectionCrawlerDonTorrent = require('./crawlers/dontorrent/crawler/tvshowCollectionCrawler')
//
// Constants
//
const searchResultsConstants = require('./model/searchResultConstants')

/**
 * Search shows for all torrent sites
 *
 * @param {*} limit max number of results
 * @param {*} onSearchResultFound function to apply when result is found on searching
 * @returns Promise with 'SearchResult' array
 */
exports.searchShows = function (text, limit, onSearchResultFound) {
    console.log('searcher->searchShows()')

    return showSearchDonTorrent.search(text, limit)
        .then(searchResults => {
            return _doCrawlShows(searchResults, onSearchResultFound)
        }).catch(err => {
            console.error(`ERROR! - searcher->searchShows(): '${err}'`)
        })
}


// ----------------------------------------------------------------------------
//
// Private functions
//

function _doCrawlShows(searchResults, onSearchResultFound) {

    var actions = searchResults.map(
        searchResult => {
            if (searchResult.type == searchResultsConstants.FILM) {
                return filmCrawlerDonTorrent.crawlDataFilm(searchResult.urlWithShow)
                    .then(show => {
                        searchResult.show = show
                        return searchResult
                    })
            }
            if (searchResult.type == searchResultsConstants.TVSHOWCOLLECTION) {
                return tvshowCollectionCrawlerDonTorrent.crawlDataShowCollection(searchResult.urlWithShow, 1)
                    .then(show => {
                        searchResult.show = show
                        return searchResult
                    })
            }
        }
    )
    // eslint-disable-next-line no-undef
    return Promise.all(actions)
        .then(
            searchResults => { // Cuando se resuelve la promesa, tenemos un array de searchResults, al que aplicamos una funcion
                searchResults.map(onSearchResultFound)
                return searchResults
            }
        )
}