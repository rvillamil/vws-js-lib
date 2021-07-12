//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const ShowCollection = require('../../../model/showCollection')
const ShowParser = require('../parser/showParser')

//
// Constants
//
const Constants = require('../constants')

/**
* Scraping for TVShow Collection data
*
* @param {*} urlWithShow URL where the collection is located
*  e.g: The TVShow, https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada
*
* @returns Promise with 'ShowCollection' data scraped
*/
exports.crawlDataShowCollection = function (urlWithShow, limit) {
  var strURLWithShow = urlWithShow + ''
  console.log(`${Constants.DOMAIN} - crawlDataShowCollection on url '${strURLWithShow}'`)
  var showCollection = new ShowCollection()
  const options = {
    uri: strURLWithShow,
    transform: function (body) {
      var strBody = body + ''
      return cheerio.load(strBody)
    }
  }

  return rp(options)
    .then(function ($) {
      //console.log(`ALL: ${($)}`)

      // ShowCollection Object
      var showCollection = ShowParser.parseTableWithTVShows($) // Aqui obtenemos la release date, session y episode
      showCollection.name = ShowParser.parseUrlWithShowCollectionName(strURLWithShow)
      showCollection.url = strURLWithShow
      showCollection.domain = Constants.DOMAIN
      // Parseamos el show 
      const title = ShowParser.parseTitle($)
      const sinopsis = ShowParser.parseSinopsis($)
      const description = ShowParser.parseDescription($)
      const quality = ShowParser.parseQuality($)
      const urlwithCover = ShowParser.parseURLWithCover($)
      const year = ShowParser.parseYearByRelaseDate(showCollection.shows[0].releaseDate)
      // Asginamos los mismos datos a todos los shows..
      for (let i = 0; i < showCollection.shows.length; i++) {
        var show = showCollection.shows[i]
        show.urlBase = strURLWithShow
        show.collectionName = showCollection.name
        show.urlCollection = showCollection.url
        show.domain = Constants.DOMAIN
        show.title = title
        show.sinopsis = sinopsis
        show.description = description
        show.quality = quality
        show.fileSize = 'N/A' // No está disponible
        show.urlwithCover = urlwithCover
        show.year = year
      }
      if (limit) {
        if (limit > showCollection.shows.length) {
          limit = showCollection.shows.length
        }
        showCollection.shows = showCollection.shows.slice(0, limit)
      }
      showCollection.error = 0
      //console.log(`${Constants.DOMAIN} - Showcollection - ${showCollection.toStringSimple()} `)

      return showCollection
    })
    .catch(function (err) {
      console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShowCollection: '${err}'`)
      showCollection.error = err
    })
}
