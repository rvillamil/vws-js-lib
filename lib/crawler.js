//
// NPM modules
//
const omdb = require('./agents/omdb')
const tmdb = require('./agents/tmdb')

// www.pctmix
const showLinksCrawler        = require('./crawlers/pctmix/crawler/showLinksCrawler')
//const filmCrawlerDescargas2020 =   require('./crawlers/pctmix/crawler/filmCrawler')
//const tvshowCollectionCrawlerDescargas2020 = require('./crawlers/pctmix/crawler/tvshowCollectionCrawler')

//
// Constants
//
const constants = require('./crawlers/pctmix/constants')


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
      '.pelilist li a'
    )
    .then((linkChainedList) => {
      return crawler.crawlFilmsByLinkChainedList(
        linkChainedList,
        (sowDataCrawled) => {
          console.log(
            `Video premiere crawled: ${JSON.stringify(sowDataCrawled)}\n\n`
          )
        }
      )
    })
    .then((shows) => {
      console.log(`/videopremieres - videopremieres length: ${shows.length}`)
      return shows
    })
    .catch((err) => {
      console.error(`Error getting video premieres !!! ${err}`)
    })
}


/**
 * TODO: Comentar
 */
exports.crawlFilmsByLinkChainedList = function (linkChainedList, onShowDataCrawled) {
  console.log('crawler->crawlFilmsByLinkChainedList()')
  
  var actions = linkChainedList.map(
    linkToShowData => {
      return _doCrawlFilmAndSearchInXMDBfrom(linkToShowData)
    }
  )
  // eslint-disable-next-line no-undef
  return Promise.all(actions)
    .then(
      shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
        var showsFiltered = _removeDuplicatedShowsByName(shows)
        if (onShowDataCrawled) {
          showsFiltered.map(onShowDataCrawled)
        }
        return showsFiltered
      }
    )
}

function _removeDuplicatedShowsByName(shows) {
    /*
       console.log('ANTES: ')
       for (let i = 0; i < shows.length; i++) {
           console.log(`show.title: ${shows[i].title}`)
       }
       console.log('*********')
   */
    var uniq = {}
    var showsFiltered = shows.filter(obj => !uniq[obj.title] && (uniq[obj.title] = true)) // Filtramos repetidos
    /*
          console.log('DESPUES: ')
          for (let i = 0; i < showsFiltered.length; i++) {
              console.log(`show.title: ${showsFiltered[i].title}`)
          }
          console.log('*********')
      */
    return showsFiltered
  }
  