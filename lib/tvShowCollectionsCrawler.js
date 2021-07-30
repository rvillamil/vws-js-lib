/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
const shared = require('./crawlers/shared/crawler/utils')
const xmdbSearcher = require('./xmdbSearcher')

// www.pctmix
const constants = require('./crawlers/pctmix/constants')
const showLinksCrawlerPCTMIX = require('./crawlers/pctmix/crawler/showLinksCrawler')
const tvshowCollectionCrawler = require('./crawlers/pctmix/crawler/tvshowCollectionCrawler')
/**
 * Crawl TVShowsCollection for all torrent sites
 *
 * @param {*} limit max number of TVShows to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 * @returns Promise with 'ShowCollection' array
 */
exports.crawlTVShowCollections = function (limit, onShowDataCrawled) {
  // console.log('crawler->crawlTVShowCollections()')

  return showLinksCrawlerPCTMIX
    .crawlLinksFrom(constants.URL_BASE_TVSHOWS_HD, limit, '.pelilist li a')
    .then((linkChainedList) => _doCrawlTVShowCollectionsByLinkChainedList(
      linkChainedList,
      onShowDataCrawled,
    ))
    .then((shows) => {
      // eslint-disable-next-line no-console
      console.log(`/tvshows - TV shows length: ${shows.length}`)
      return shows
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`Error getting tvshows !!! ${err}`)
    })
}

/**
 * Crawl TVShowscollection from showCollectionList where every showCollection object, has minimal information:
 * .e.g:
 *  showCollection1.name = 'modern-family/2261'
 *  showCollection1.domain = 'pctmix'
 *  showCollection1.url = 'https://pctmix/series-hd/modern-family/2261'
 *
 *
 * @param {*} limit max number of the collection TVShows to crawl
 * @param {*} showCollectionList showCollection list for updating with the rest of values
 * @returns Promise with new 'ShowCollection' array with al TVShows information
 */
/*
exports.crawlTVShowCollectionsBy = function (limit, showCollectionList) {
  console.log(`crawler->crawlTVShowCollections() from showCollectionList with '${showCollectionList.length}' elements'`)

  const actions = showCollectionList.map((showCollection) => {
    // console.log("showCollection---->: " + JSON.stringify(showCollection))
    if (showCollection.domain == constantsDescargas2020.DOMAIN) {
      return tvshowCollectionCrawlerDescargas2020.crawlDataShowCollection(
        showCollection.url, limit,
      )
    }
    if (showCollection.domain == constantsDonTorrent.DOMAIN) {
      return tvshowCollectionCrawlerDonTorrent.crawlDataShowCollection(
        showCollection.url, limit,
      )
    }
  })

  // eslint-disable-next-line no-undef
  return Promise.all(actions).then(
    (showCollectionsList) => showCollectionsList,
  )
}
*/

/**
 * Crawl TVShowscollection from LinkChained array data
 *
 * @param {*} linkChainedList Linkchained list
 * @returns Promise with 'Show' array with al TVShows information,
 * without duplications shows (by title)
 */
function _doCrawlTVShowCollectionsByLinkChainedList(linkChainedList, onShowDataCrawled) {
  // console.log('crawler->_crawlTVShowCollectionsByLinkChainedList()')

  const actions = linkChainedList.map((linkToShowData) => _doCrawlTVShowCollectionAndSearchFrom(linkToShowData))
  // eslint-disable-next-line no-undef
  return Promise.all(actions).then((shows) => {
    // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
    const showsFiltered = shared.removeDuplicatedShowsByName(shows)
    if (onShowDataCrawled) {
      showsFiltered.map(onShowDataCrawled)
    }
    return showsFiltered
  })
}

// Cargamos solo el primer show de la coleccion pues nos sirve para mostrar datos de la portada
function _doCrawlTVShowCollectionAndSearchFrom(linkChained) {
  // console.log(`_doCrawlTVShowCollectionAndSearchFrom - linkToShowData: ${JSON.stringify(linkToShowData)}`)
  return tvshowCollectionCrawler
    .crawlDataShowCollection(linkChained.from, 1)
    .then((showCollection) => {
      const show = showCollection.shows[0]
      // console.log(`_doCrawlTVShowCollectionAndSearchFrom - show '${show.title}'. Error code: '${show.error}' `)
      return xmdbSearcher.searchShowInXMDB(show, 'tv')
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(
        `ERROR! - _doCrawlTVShowCollectionAndSearchFrom on domain ${constants.DOMAIN}: ${err}`,
      )
    })
}
