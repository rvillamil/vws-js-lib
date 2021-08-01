/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
const ShowCollection = require('../../../model/showCollection')
const tvshowCollectionParser = require('../parser/tvshowCollectionParser')
const showLinksCrawler = require('./showLinksCrawler')
const tvshowCrawler = require('./tvshowCrawler')

//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping for TVShow Collection data
 *
 * @param {*} urlWithShowCollection URL where the collection is located
 *  e.g: The TVShow, https://pctmix.org/series-hd/watchmen/5258
 *
 * @returns Promise with 'ShowCollection' data scraped
 */
exports.crawlDataShowCollection = function (urlWithShowCollection, limit) {
  // console.log(`${Constants.DOMAIN} - crawlDataShowCollection on url '${urlWithShowCollection}'`)

  const showCollectionLocation = tvshowCollectionParser.parseUrlWithShowCollectionName(`${urlWithShowCollection}`)

  return showLinksCrawler.crawlTVShowLinksFrom(
    (`${Constants.URL_BASE_TVSHOWS_HD}${showCollectionLocation}`),
    limit,
    '.buscar-list li',
  ).then((linkChainedToEpisodeList) =>
    _doCrawlChainlinks(
      showCollectionLocation,
      linkChainedToEpisodeList,
    ))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShowCollection: '${err}'`)
    })
}

// ----------------------------------------------------------------------------
//
// Private functions
//
function _doCrawlChainlinks(showCollectionLocatiion, linkChainedToEpisodeList) {
  const actions = linkChainedToEpisodeList.map(
    (linkChained) => tvshowCrawler.crawlDataTVShow(linkChained.from),
  )

  // eslint-disable-next-line no-undef
  return Promise.all(actions).then((shows) => {
    const showCollection = new ShowCollection()
    showCollection.location = showCollectionLocatiion
    shows.forEach((show) => {
      show.collectionName = showCollectionLocatiion
      show.domain = Constants.DOMAIN
      showCollection.shows.push(show)
    })
    return showCollection
  })
}
