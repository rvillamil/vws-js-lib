/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
//
// NPM modules
//
const shared = require('./crawlers/shared/crawler/utils')
const xmdbSearcher = require('./xmdbSearcher')

// pctmix
const constants = require('./crawlers/pctmix/constants')
const showLinksCrawler = require('./crawlers/pctmix/crawler/showLinksCrawler')
const filmCrawler = require('./crawlers/pctmix/crawler/filmCrawler')

/**
 * Crawl video premieres for all torrent sites
 *
 * @param {*} limit max number of video premieres to crawl
 * @returns Promise with 'Show' array
 */
exports.crawlVideoPremieres = function (limit) {
  return showLinksCrawler
    .crawlLinksFrom(
      constants.URL_BASE_VIDEOPREMIERES_HD,
      limit,
      '.pelilist li a',
    )
    .then((linkChainedList) => _crawlFilmsByLinkChainedList(
      linkChainedList,
      (/** @type {any} */ showDataCrawled) => {
        // eslint-disable-next-line no-console
        console.log(
          `Video premiere crawled: ${JSON.stringify(showDataCrawled)}\n\n`,
        )
      },
    ))
    .then((shows) => {
      // eslint-disable-next-line no-console
      console.log(`/videopremieres - videopremieres length: ${shows.length}`)
      return shows
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`Error getting video premieres !!! ${err}`)
    })
}

// ----------------------------------------------------------------------------
//
// Private functions
//

/**
 * Crawl video premieres url list from linkChainedList object
 * @param {void | any[]} linkChainedList
 * @param {(showDataCrawled: any) => void} onShowDataCrawled
 */
function _crawlFilmsByLinkChainedList(linkChainedList, onShowDataCrawled) {
  // console.log('crawler->crawlFilmsByLinkChainedList()')

  const actions = linkChainedList.map((/** @type {any} */ linkToShowData) => _doCrawlFilmAndSearchInXMDBfrom(linkToShowData))

  // eslint-disable-next-line no-undef
  return Promise.all(actions).then((shows) => {
    const showsFiltered = shared.removeDuplicatedShowsByName(shows)
    if (onShowDataCrawled) {
      showsFiltered.map(onShowDataCrawled)
    }
    return showsFiltered
  })
}

/**
 * @param {{ from: any; }} linkChained
 */
function _doCrawlFilmAndSearchInXMDBfrom(linkChained) {
  // console.log(`crawler : _doCrawlAndSearchFrom() ${linkToShowData.from}`)

  return filmCrawler
    .crawlDataFilm(linkChained.from)
    .then((show) => xmdbSearcher.searchShowInXMDB(show, 'movie'))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(
        `ERROR! - _doCrawlFilmAndSearchInXMDBfrom on domain ${constants.DOMAIN}: ${err}`,
      )
    })
}
