//
// NPM modules
//

/// www.dontorrent.org
//const torrentLinksCrawlerDonTorrent = require('./crawlers/dontorrent/crawler/torrentLinksCrawler')
const showSearchDonTorrent = require('./crawlers/dontorrent/searcher/showSearch')
//
// Constants
//
const constantsDonTorrent = require('./crawlers/dontorrent/constants')

/**
 * Search shows for all torrent sites
 *
 * @param {*} limit max number of results
 * @param {*} onShowFound function to apply when Show is found
 * @returns Promise with 'Show' array
 */
exports.searchShows = function (text, limit, onShowFound) {
    console.log('searcher->searchShows()')

    return showSearchDonTorrent.search(text, limit).then(searchResults => {
        return _doCrawlFilm(linkChainedToShowDataList, onShowDataCrawled) .....etc
    })
    /*
    return showLinksCrawlerDescargas2020.crawlLinksFrom(
        constantsDescargas2020.URL_BASE_BILLBOARDFILMS,
        limit,
        '.pelilist li a'
    ).then(linkChainedToShowDataList => {
        return _doCrawlFilm(linkChainedToShowDataList, onShowDataCrawled)
    }).catch(err => {
        console.error(`ERROR! - crawler->crawlVideoPremieres(): '${err}'`)
    })
    */
}


// ----------------------------------------------------------------------------
//
// Private functions
//

function _doCrawlFilm(linkToShowDataList, onShowDataCrawled) {

    var actions = linkToShowDataList.map(
        linkToShowData => {
            return _doCrawlDataFilmAndSearchFrom(linkToShowData)
        }
    )
    // eslint-disable-next-line no-undef
    return Promise.all(actions)
        .then(
            shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
                var showsFiltered = _removeDuplicatedShowsByName(shows)
                showsFiltered.map(onShowDataCrawled)
                return shows
            }
        )
}

/*
function _doCrawlDataFilmAndSearchFrom(linkToShowData) {

    if (linkToShowData.domain == constantsDescargas2020.DOMAIN) {
        return filmCrawlerDescargas2020.crawlDataFilm(linkToShowData.from)
            .then(show => {
                return _doSearchShowInXMDB(show, 'movie')
            })
            .catch(err => {
                console.error(`ERROR! - _doCrawlAndSearchFrom on domain ${constantsDescargas2020.DOMAIN}: ${err}`)
            })
    }
    if (linkToShowData.domain == constantsDonTorrent.DOMAIN) {
        return filmCrawlerDonTorrent.crawlDataFilm(linkToShowData.from)
            .then(show => {
                //console.log(`crawler : _doCrawlAndSearchFrom():  --> ${JSON.stringify(show)}\n\n`);
                return _doSearchShowInXMDB(show, 'movie')
            })
            .catch(err => {
                console.error(`ERROR! - _doCrawlAndSearchFrom on domain ${constantsDonTorrent.DOMAIN}: ${err}`)
            })
    }
}
*/
