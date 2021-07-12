//
// NPM modules
//
const cheerio = require('cheerio')
const axios = require('axios').default
const Show = require('../../../model/show')
const ShowParser = require('../parser/showParser')
const TVShowParser = require('../parser/tvshowParser')
//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping for TVShow data as the name, url with torrent file...etc
 *
 * @param {*} urlWithTVShow URL where 'Show' data is located
 *  e.g: The TVShow, e.g: https://pctmix1.com/descargar/torrent/serie-en-hd/black-lightning/temporada-4/capitulo-09-al-13/2021-07-06/
 *
 * @returns Promise with 'Show' data scraped
 */
const crawlDataTVShow = (
  /** @type {String} */ urlWithTVShow) => {
    
  console.log(`${Constants.DOMAIN} - crawlDataTVShow on url '${urlWithTVShow}'`)
  
  var show     = new Show()  
  show.urlBase = urlWithTVShow
  show.domain  = Constants.DOMAIN
  show.error   = 0

  return axios.get(urlWithTVShow)
    .then((htmlPageWithTVShow) => {
      // handle success                  
      //console.log ('HTML ====>' + htmlPageWithTVShow.data)       
      _parseCrawledTVShowPage(
        show, 
        htmlPageWithTVShow.data)

    })
    .catch((error) => {      
      // handle error      
      console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataTVShow: '${error}'`)      
      show.error = error      
    })
    .then(() => {
      // always executed      
      return show      
    })
}

// ------------------ Private functions
function _parseCrawledTVShowPage(show, htmlRawPageWithShow) {
  //console.log(`${Constants.DOMAIN} - _parseScrapingData from URI '${show.urlBase}'`)
  const $               = cheerio.load(htmlRawPageWithShow)
  show.title            = ShowParser.parseTitle($)
  show.description      = ShowParser.parseDescription($)
  show.originalTitle    = ShowParser.parseOriginalTitle(show.description)
  show.sinopsis         = ShowParser.parseSinopsis(show.description)

  show.collectionName   = TVShowParser.parseCollectionName($)
  show.currentSession   = TVShowParser.parseSession($)
  show.currentEpisode   = TVShowParser.parseEpisode($, show.currentSession)

  // Description
  if (show.sinopsis) {
    // Si la sinopsis esta dentro de la descripcion..
    show.description = $('.descripcion_top').text()
    if (show.description) {
      show.description = show.description.split('Sinopsis')[0] // Quitamos la sinopsis a la descripcion
    }
  } else {
    show.sinopsis = $('.sinopsis').text() // Establecemos el valor de sinopsis que nos venga...
  }

  show.quality = ShowParser.parseQuality($)
  show.urlwithCover = ShowParser.parseURLWithCover($)
  show.releaseDate = ShowParser.parseReleaseDate($)
  show.fileSize = ShowParser.parseFileSize($)
  show.year = ShowParser.parseYearByTitle($)
  if (!show.year) {
    if (show.description) {
      show.year = ShowParser.parseYearByShowDescription(show.description)
    }
    if (show.year == null) {
      show.year = ShowParser.parseYearByReleaseDate(show.releaseDate)
    }
  }
  show.urltodownload = ShowParser.parseURLToDownload($)    
  console.log ('URL To Download: ' + show.urltodownload)
  show.error = 0
}


// Export
module.exports = {
  crawlDataTVShow  
}

crawlDataTVShow (
  'https://pctmix1.com/descargar/torrent/serie-en-hd/black-lightning/temporada-4/capitulo-09-al-13/2021-07-06/')
