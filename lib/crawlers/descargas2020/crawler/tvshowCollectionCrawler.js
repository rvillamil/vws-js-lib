//
// NPM modules
//
const ShowCollection = require('../../../model/showCollection')
const tvshowCollectionParser = require('../parser/tvshowCollectionParser')
const showLinksCrawler = require('./showLinksCrawler')
const tvshowCrawler = require('./tvshowCrawler.js')

//
// Constants
//
const Constants = require('../constants')


/**
 * Scraping for TVShow Collection data
 *
 * @param {*} urlWithShowCollection URL where the collection is located
 *  e.g: The TVShow, https://descargas2020.org/series-hd/watchmen/5258
 *
 * @returns Promise with 'ShowCollection' data scraped
 */
exports.crawlDataShowCollection = function (urlWithShowCollection, limit) {

    console.log(`${Constants.DOMAIN} - crawlDataShowCollection on url '${urlWithShowCollection}'`)

    const showCollectionName = tvshowCollectionParser.parseUrlWithShowCollectionName(urlWithShowCollection + '')

    return showLinksCrawler.crawlLinksFrom(
        (`${Constants.URL_BASE_TVSHOWS_HD}${showCollectionName}`),
        limit,
        '.buscar-list .info a'
    ).then(linkChainedToEpisodeList => {
        console.log(`${Constants.DOMAIN} - crawlDataShowCollection - ${linkChainedToEpisodeList.length} episodes found on '${urlWithShowCollection}'`)
        //console.log(`linkChainedList --> ${JSON.stringify(linkChainedList)}`)
        return _doCrawlChainlinks(showCollectionName, linkChainedToEpisodeList)
    }).catch(err => {
        console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShowCollection: '${err}'`)
    })
}


// ----------------------------------------------------------------------------
//
// Private functions
//
function _doCrawlChainlinks(collectionName, linkChainedToEpisodeList) {

    var actions = linkChainedToEpisodeList.map(linkChained => {
        return tvshowCrawler.crawlDataTVShow(linkChained.from)
    })

    // eslint-disable-next-line no-undef
    return Promise.all(actions).then(shows => {
        var showCollection = new ShowCollection()
        showCollection.name = collectionName
        showCollection.url = Constants.URL_BASE_TVSHOWS_HD + collectionName
        showCollection.domain = Constants.DOMAIN
        shows.forEach(show => {
            show.collectionName = collectionName
            show.domain = Constants.DOMAIN
            show.urlCollection = showCollection.url
            showCollection.shows.push(show)
        })
        return showCollection
    })
}
