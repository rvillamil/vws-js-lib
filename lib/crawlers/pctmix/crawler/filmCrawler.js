/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
const cheerio = require('cheerio')
const axios = require('axios').default
const Show = require('../../../model/show')
const ShowParser = require('../parser/showParser')

//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping for film pages
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The Film, https://pctmix.org/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
 *
 * @returns Promise with 'Show' data scraped
 */
const crawlDataFilm = (urlWithShow) => {
  // console.log(`${Constants.DOMAIN} - crawlDataFilm on url '${urlWithShow}'`)
  const show = new Show()
  show.urlBase = urlWithShow
  show.domain = Constants.DOMAIN
  show.error = 0

  return axios.get(urlWithShow, { responseType: 'text' })
    .then((htmlRawPageWithShow) => {
      // handle success
      // console.log ('HTML ====>' + htmlRawPageWithShow.data)
      _parseCrawledFilmPage(
        show,
        htmlRawPageWithShow.data,
      )
    })
    .catch((error) => {
      // handle error
      // eslint-disable-next-line no-console
      console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataFilm: '${error}'`)
      show.error = error
    })
    .then(() => show)
}
// ------------------ Private functions
function _parseCrawledFilmPage(show, htmlRawPageWithShow) {
  // console.log(`${Constants.DOMAIN} - _parseScrapingData from URI '${show.urlBase}'`)
  const $ = cheerio.load(htmlRawPageWithShow)
  show.title = ShowParser.parseTitle($)
  show.description = ShowParser.parseDescription($)
  show.originalTitle = ShowParser.parseOriginalTitle(show.description)
  show.sinopsis = ShowParser.parseSinopsis(show.description)
  // Description
  if (show.sinopsis) {
    // Si la sinopsis esta dentro de la descripcion..
    show.description = $('.descripcion_top').text()
    if (show.description) {
      // eslint-disable-next-line prefer-destructuring
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

  show.urltodownload = ShowParser.parseURLToDownloadByURLWithCover(show.urlwithCover)

  // console.log ('URL To Download: ' + show.urltodownload)
  show.error = 0
}

// Export
module.exports = {
  crawlDataFilm,
}
