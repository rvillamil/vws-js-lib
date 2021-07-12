//
// NPM modules
//

/// www.dontorrent.org
const showSearchDonTorrent = require('./crawlers/dontorrent/searcher/showSearcher')
const crawler = require('./crawler')
const LinkChained = require('./model/linkChained')
//
// Constants
//
const searchResultsConstants = require('./model/searchResultConstants')
const constantsDonTorrent = require('./crawlers/dontorrent/constants')

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
      var linkChainedList = []
      if (searchResult.type == searchResultsConstants.TVSHOWCOLLECTION) {

        var linkChainedTVshow = new LinkChained()
        linkChainedTVshow.domain = constantsDonTorrent.DOMAIN
        linkChainedTVshow.from = searchResult.urlWithShow
        linkChainedList.push(linkChainedTVshow)

        return crawler.crawlTVShowCollectionsByLinkChainedList(linkChainedList, null)
          .then(shows => {
            //console.log(`crawlTVShowCollectionsByLinkChainedList: ${JSON.stringify(shows[0])}`)
            searchResult.show = shows[0]
            return searchResult
          })
      }
      if (searchResult.type == searchResultsConstants.FILM) {
        var linkChainedFilm = new LinkChained()
        linkChainedFilm.domain = constantsDonTorrent.DOMAIN
        linkChainedFilm.from = searchResult.urlWithShow
        linkChainedList.push(linkChainedFilm)
        return crawler.crawlFilmsByLinkChainedList(linkChainedList, null)
          .then(shows => {
            //console.log(`crawlFilmsByLinkChainedList: ${JSON.stringify(shows[0])}`)
            searchResult.show = shows[0]
            return searchResult
          })
      }
    }
  )
  // eslint-disable-next-line no-undef
  return Promise.all(actions)
    .then(
      searchResults => { // Cuando se resuelve la promesa, tenemos un array de searchResults, al que aplicamos una funcion
        if (onSearchResultFound) {
          searchResults.map(onSearchResultFound)
        }
        return searchResults
      }
    )
}