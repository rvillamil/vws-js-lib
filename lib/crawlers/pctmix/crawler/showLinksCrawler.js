//
// NPM modules
//
const showLinksCrawlerPCTMIX = require('request-promise')
const cheerio = require('cheerio')
const LinkChained = require('../../../model/linkChained')

//
// Constants
//
const Constants = require('../constants')

/**
 * Scraping links list
 *
 * <div class="info">
 *   <a href="https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-9/capitulo-07-al-09/"
 *       title="Serie en HD The Office Temp. 9 Capitulo 7">
 *       <h2 style="padding:0;">Serie <strong style="color:red;background:none;">The Office - Temp. 9 Capitulos 7 al 9</strong> - <span style="color:red;background:none;padding:0px;">Espa�ol</span> Calidad <span style="color:red;background:none;">[ HDTV 720p AC3 5.1 ]</span></h2>
 *     </a> <span>23-07-2021</span> <span>6.8 GB</span> <span class="color">
 *   <a href="https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-9/capitulo-07-al-09/"
 *      title="Serie en HD The Office Temp. 9 Capitulo 7"><i class="icon-cloud-download"></i> Descargar
 *     </a>
 *   </div>
 *
 * @param {*} url from 'pctmix' domain with links
 * @param {*} limit If not null, limit the number of links to parse
 * @param {*} htmlSelector html selector in the html document crawled
 *          .e.g. '.pelilist li a'
 *
 * @returns Promise with linkChained array, with the torrent video links
 */
exports.crawlTVShowLinksFrom = function (url, limit, htmlSelector) {
  const linkChainedList = []

  const options = {
    uri: url,
    transform(body) {
      return cheerio.load(body)
    },
  }

  return showLinksCrawlerPCTMIX(options)
    .then(($) => {
      let currentHREF = ''
      let currentText = ''
      let previousHREF = ''
      let counter = 0

      $(`${htmlSelector}`).each(function (index, element) {
        // console.log(`*********************`)
        // console.log(`element - ${$(element).html()}`)
        currentText = $(element).text()
        currentHREF = $(this).find('a').attr('href')

        if (currentText.includes('720p')) {
          // console.log(`currentText --> ${currentText}`)
          // console.log(`currentHREF --> ${currentHREF}`)

          if (currentHREF.trim() != previousHREF.trim()) {
            counter++

            previousHREF = currentHREF
            currentHREF = $(this).find('a').attr('href')
            currentHREF = currentHREF.replace('descargar', 'descargar/torrent')

            const linkChained = new LinkChained()
            linkChained.domain = Constants.DOMAIN
            linkChained.from = currentHREF
            linkChainedList.push(linkChained)
            if (limit != null && limit == counter) {
              return false // break each bucle
            }
          }
        }
      })

      return linkChainedList
    })

    .catch((err) => {
      console.error(`ERROR! - ${Constants.DOMAIN} - crawlTVShowLinksFrom: '${err}'`)
    })
}

/**
 * Scraping links list
 *
 * @param {*} url from 'pctmix' domain with links
 * @param {*} limit If not null, limit the number of links to parse
 * @param {*} htmlSelector html selector in the html document crawled
 *          .e.g. '.pelilist li a'
 *
 * @returns Promise with linkChained array, with the torrent video links
 */
exports.crawlLinksFrom = function (url, limit, htmlSelector) {
  const linkChainedList = []

  const options = {
    uri: url,
    transform(body) {
      return cheerio.load(body)
    },
  }

  return showLinksCrawlerPCTMIX(options)
    .then(($) => {
      let currentHREF = ''
      let previousHREF = ''
      let counter = 0

      $(`${htmlSelector}`).each((index, element) => {
        currentHREF = $(element).attr('href')
        currentHREF = currentHREF.replace('descargar', 'descargar/torrent')
        // https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-7/capitulo-23-al-26/ --> https://pctmix1.com/descargar/torrent/serie-en-hd/the-office/temporada-7/capitulo-23-al-26/
        // console.log(`- linkCrawled =${currentHREF}`)
        if (currentHREF.trim() != previousHREF.trim()) {
          if (limit != null && limit == counter) {
            return false // break each bucle
          }
          counter++

          previousHREF = currentHREF
          currentHREF = $(element).attr('href')
          currentHREF = currentHREF.replace('descargar', 'descargar/torrent')

          const linkChained = new LinkChained()
          linkChained.domain = Constants.DOMAIN
          linkChained.from = currentHREF
          linkChainedList.push(linkChained)
        }
      })

      return linkChainedList
    })

    .catch((err) => {
      console.error(`ERROR! - ${Constants.DOMAIN} - crawlLinksFrom: '${err}'`)
    })
}
