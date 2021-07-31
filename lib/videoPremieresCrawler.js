/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
//
// NPM modules
//
const utils = require('./crawlers/shared/crawler/utils')
const xmdbSearcher = require('./xmdbSearcher')

// pctmix
const constants = require('./crawlers/pctmix/constants')
const showLinksCrawler = require('./crawlers/pctmix/crawler/showLinksCrawler')
const filmCrawler = require('./crawlers/pctmix/crawler/filmCrawler')

/**
 * Crawl the video premieres page
 *
 * @param {*} limit max number of video premieres to crawl
 * @param {*} onShowDataCrawled function to apply when Show is scraped
 *
 * @returns Promise with 'Show' array scrapped
 */
exports.crawlVideoPremieres = async function (limit, onShowDataCrawled) {
  // eslint-disable-next-line no-console
  console.log(`videoPremieresCrawler - crawlVideoPremieres with limit '${limit}'`)
  let shows
  try {
    const linkChainedList = await showLinksCrawler.crawlLinksFrom(
      constants.URL_BASE_VIDEOPREMIERES_HD,
      limit,
      '.pelilist li a',
    )
    shows = _doCreateFilmsFrom(
      linkChainedList,
      onShowDataCrawled,
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error getting video premieres !!! ${err}`)
  }
  return shows
}

// ----------------------------------------------------------------------------
//
// Private functions
//

/**
 * Crea un array de shows, a partir de una la lista de urls encapsuladas
 * en un objeto 'linkChained'
 * La URL apunta a un Film
 *
 * @param {*} linksWithFilms lista de objetos del tipo linkChained,
 *  ex: linkToTVShowCollection: {"domain":"pctmix1.com",
 *                               "from":"https://pctmix1.com/descargar/torrent/peliculas-x264-mkv/atrapado-en-el-pasado-2020-/bluray-microhd/"}
 *
 * @returns Array de Shows donde se han filtrado aquellos que tienen el mismo titulo
 */
async function _doCreateFilmsFrom(linksWithFilms, onShowDataCrawled) {
  // console.log('crawler->crawlFilmsByLinkChainedList()')

  const actions = linksWithFilms.map((/** @type {any} */ linkToShowData) => _doCreateFilmFrom(linkToShowData))

  // eslint-disable-next-line no-undef
  const shows = await Promise.all(actions)
  const showsFiltered = utils.removeDuplicatedShowsByName(shows)
  if (onShowDataCrawled) {
    showsFiltered.map(onShowDataCrawled)
  }
  return showsFiltered
}

/**
 * Crea el show asociadao a la url indicado en el objeto 'linkChained'
 *
 * ex: linkChainedToFilm:  {"domain":"pctmix1.com",
 *                          "from":"https://pctmix1.com/descargar/torrent/peliculas-x264-mkv/atrapado-en-el-pasado-2020-/bluray-microhd/"}
 */
async function _doCreateFilmFrom(linkChainedToFilm) {
  // console.log(`crawler : _doCrawlFilmAndSearchInXMDBfrom() ${JSON.stringify(linkChained)}`)
  let show

  try {
    const film = await filmCrawler.crawlDataFilm(linkChainedToFilm.from)
    show = await xmdbSearcher.searchShowInXMDB(film, 'movie')
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `ERROR! - _doCreateFilmFrom on domain ${constants.DOMAIN}: ${err}`,
    )
  }
  return show
}
