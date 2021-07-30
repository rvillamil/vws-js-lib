/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
//
// NPM modules
//
const omdb = require('./agents/omdb')
const tmdb = require('./agents/tmdb')

/**
 * Search show info from TMDB and OMDB database films
 *
 * @param {*} show Show object with the title to find
 * @param {*} kind movie or tv. If none, default is tv
 */
exports.searchShowInXMDB = function (show, kind, debug = false) {
  // eslint-disable-next-line no-console
  console.log(`searchShowInXMDB - Searching in XMDB on '${kind}' show by spanish title '${show.title}' and year '${show.year}' `)
  return _doSearchShowInXMDB(show, kind, debug)
}

// ----------------------------------------------------------------------------
//
// Private functions
//

/**
 * @param {import("./model/show")} show
 * @param {string} kind
 */
// eslint-disable-next-line no-underscore-dangle
function _doSearchShowInXMDB(show, kind, debug = false) {
  // console.log (`_doSearchShowInXMDB for '${show.title}' and year '${show.year}'`)
  // En TMDB por titulo en castellano que es muy fiable
  return tmdb.searchShow(show.title, show.year, kind, debug)
    .then((tmdbShow) => {
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
      let searchTitle = show.originalTitle
      if (searchTitle == null) {
        searchTitle = show.title
      }
      return omdb.searchShow(searchTitle, show.year, kind, debug)
    })
    .then((omdbShow) => {
      // Estos campos pueden venir nulos y los completamos
      // console.log(`_doSearchShowInXMDB - Searching in OMDB for title '${omdbShow.title}'. Error code: '${omdbShow.error}'`)
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
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`ERROR! - _doSearchShowInXMDB - Error on search:${err}`)
    })
}
