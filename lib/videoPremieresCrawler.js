//
// NPM modules
//
const omdb = require('./agents/omdb')
const tmdb = require('./agents/tmdb')
const shared = require('./crawlers/shared/crawler/utils')

// www.pctmix
const showLinksCrawler        = require('./crawlers/pctmix/crawler/showLinksCrawler')
const filmCrawler             = require('./crawlers/pctmix/crawler/filmCrawler')
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
      return _crawlFilmsByLinkChainedList(
        linkChainedList,
        (showDataCrawled) => {
          console.log(
            `Video premiere crawled: ${JSON.stringify(showDataCrawled)}\n\n`
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


// ----------------------------------------------------------------------------
//
// Private functions
//

/**
 * Crawl video premieres url list from linkChainedList object
 */
function _crawlFilmsByLinkChainedList (linkChainedList, onShowDataCrawled) {  

  //console.log('crawler->crawlFilmsByLinkChainedList()')
  
  var actions = linkChainedList.map(
    linkToShowData => {
      return _doCrawlFilmAndSearchInXMDBfrom(linkToShowData)
    }
  )

  // eslint-disable-next-line no-undef
  return Promise.all(actions)
    .then(
      shows => { // Cuando se resuelve la promesa, tenemos un array de shows, al que aplicamos una funcion
        var showsFiltered = shared.removeDuplicatedShowsByName(shows)
        if (onShowDataCrawled) {
          showsFiltered.map(onShowDataCrawled)
        }
        return showsFiltered
      }
    )
}


function _doCrawlFilmAndSearchInXMDBfrom(linkChained) {

  //console.log(`crawler : _doCrawlAndSearchFrom() ${linkToShowData.from}`)
 
  return filmCrawler.crawlDataFilm(linkChained.from)
    .then(show => {
      return _doSearchShowInXMDB(show, 'movie')
    })
    .catch(err => {
      console.error(`ERROR! - _doCrawlFilmAndSearchInXMDBfrom on domain ${constants.DOMAIN}: ${err}`)
    })
 
}

function _doSearchShowInXMDB(show, kind, debug = false) {
  //console.log (`_doSearchShowInXMDB for '${show.title}' and year '${show.year}'`)
  // En TMDB por titulo en castellano que es muy fiable
  return tmdb.searchShow(show.title, show.year, kind, debug)
    .then(tmdbShow => {
      if (tmdbShow.originalTitle != null) {
        show.originalTitle = tmdbShow.originalTitle        
      }      
      if (tmdbShow.description != null) {
        show.description = tmdbShow.description
      }
      if (tmdbShow.sinopsis != null) {
        show.sinopsis = tmdbShow.sinopsis
      }
      if (tmdbShow.releaseDate != null) {
        show.releaseDate = tmdbShow.releaseDate
      }
      if (tmdbShow.tmdbRating != null) {
        show.tmdbRating = tmdbShow.tmdbRating
      }
      if (tmdbShow.urlwithCover != null) {
        show.urlwithCover = tmdbShow.urlwithCover
      }
      // Intentamos buscar en OMDB por titulo original
      var searchTitle = show.originalTitle
      if (searchTitle == null) {
        searchTitle = show.title
      }
      return omdb.searchShow(searchTitle, show.year, kind, debug)
    })
    .then(omdbShow => {
      // Estos campos pueden venir nulos y los completamos
      //console.log(`_doSearchShowInXMDB - Searching in OMDB for title '${omdbShow.title}'. Error code: '${omdbShow.error}'`)      
      if (show.originalTitle == null) {
        show.originalTitle = omdbShow.originalTitle
      }
      if (show.description == null) {
        show.description = omdbShow.description
      }
      if (show.sinopsis == null) {
        show.sinopsis = omdbShow.sinopsis
      }
      if (show.releaseDate == null) {
        show.releaseDate = omdbShow.releaseDate
      }
      if (show.tmdbRating == null) {
        show.tmdbRating = omdbShow.tmdbRating
      }            
      if (show.urlwithCover == null) {
        show.urlwithCover = omdbShow.urlwithCover
      }
      if (omdbShow.imdbRating) {
        show.imdbRating = omdbShow.imdbRating
      }
      if (omdbShow.rottenTomatoes) {
        show.rottenTomatoes = omdbShow.rottenTomatoes
      }

      return show

    })
    .catch(err => {
      console.error('ERROR! - _doSearchShowInXMDB - Error on search:' + err)
    })
}
  