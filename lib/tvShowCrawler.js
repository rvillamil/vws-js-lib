/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
const tvShowCrawler = require('./crawlers/shared/crawler/utils')
const xmdbSearcher = require('./xmdbSearcher')

// www.pctmix
const constants = require('./crawlers/pctmix/constants')
const showLinksCrawler = require('./crawlers/pctmix/crawler/showLinksCrawler')
const tvshowCollectionCrawler = require('./crawlers/pctmix/crawler/tvshowCollectionCrawler')

/**
 * Crawl The TVShows page
 *
 * @param {*} limit max number of TVShows to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 *
 * @returns Promise with 'Show' array scrapped
 */
exports.crawlTVShows = async function (limit, onShowDataCrawled) {
  // eslint-disable-next-line no-console
  console.log(`tvShowCrawler - crawlTVShows with limit '${limit}'`)
  let shows
  try {
    const linksWithTVShowcollections = await showLinksCrawler.crawlLinksFrom(
      constants.URL_BASE_TVSHOWS_HD,
      limit,
      '.pelilist li a',
    )
    shows = _doCreateShowsFrom(
      linksWithTVShowcollections,
      onShowDataCrawled,
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error getting tvshows !!! ${err}`)
  }
  return shows
}

/**
 * Scraping for one TVShow Collection
 *
 * @param {*} urlWithShowCollection URL where the collection is located
 *  e.g: The TVShow, https://pctmix.org/series-hd/watchmen/5258
 *
 * @returns Promise with 'ShowCollection' data scraped
 */
exports.crawlTVShowBy = function (urlWithShowCollection, limit) {
  // eslint-disable-next-line no-console
  // console.log(`tvShowCrawler - crawlTVShowBy url '${urlWithShowCollection}'. Only scrapping ${limit} episodes`)
  return tvshowCollectionCrawler.crawlDataShowCollection(urlWithShowCollection, limit)
}

// ----------------------------------------------------------------------------
//
// Private functions
//

/**
 * Crea un array de shows, a partir de una la lista de urls encapsuladas
 * en un objeto 'linkChained'
 * La URL apunta a un TVShowCollection
 *
 * @param {*} linksWithTVShowcollections lista de objetos del tipo linkChained,
 *  ex: linkToTVShowCollection: {"domain":"pctmix1.com",
 *                               "from":"https://pctmix1.com/series-hd/ted-lasso/6156"}
 *
 * @returns Array de Shows donde se han filtrado aquellos que tienen el mismo titulo
 */
async function _doCreateShowsFrom(linksWithTVShowcollections, onShowDataCrawled) {
  // console.log('crawler->_doCrawlTVShowCollectionsBy()')
  const actions = linksWithTVShowcollections.map((linkWithTVShowCollection) => _doCreateFirstShowFrom(linkWithTVShowCollection))
  // eslint-disable-next-line no-undef
  const shows = await Promise.all(actions)
  // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
  const showsFiltered = tvShowCrawler.removeDuplicatedShowsByName(shows)
  if (onShowDataCrawled) {
    showsFiltered.map(onShowDataCrawled)
  }
  return showsFiltered
}

/**
 * Crea el primer TVShow de la lista de shows indicada.
 * En general,el primer show de la coleccion nos sirve para mostrar datos de la portada.
 *
 * ex: linkToTVShowCollection: {"domain":"pctmix1.com",
 *                              "from":"https://pctmix1.com/series-hd/ted-lasso/6156"}
 *
 * @return un Objecto Show
 */
async function _doCreateFirstShowFrom(linkToTVShowCollection) {
  // console.log(`_doGetFirstShowFrom - linkChained: ${JSON.stringify(linkToTVShowCollection)}`)
  let firstShow
  try {
    const showCollection = await tvshowCollectionCrawler.crawlDataShowCollection(linkToTVShowCollection.from, 1)
    firstShow = await xmdbSearcher.searchShowInXMDB(showCollection.shows[0], 'tv')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `ERROR! - _doCreateFirstShowFrom on domain ${constants.DOMAIN}: ${err}`,
    )
  }
  return firstShow
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
