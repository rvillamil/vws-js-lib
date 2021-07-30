/* eslint-disable no-console */
const xmdbSearcher = require('../lib/xmdbSearcher')
const Show = require('../lib/model/show')
const tmdb = require('../lib/agents/tmdb')
const omdb = require('../lib/agents/omdb')

let filmOrTvShow
let titleToSearch
let yearToSearch

function processParamTitle() {
  if (process.argv.length < 5) {
    console.log('ERROR! Argument list error')
    help()
    process.exit(1)
  }
  filmOrTvShow = process.argv[2]
  if (!filmOrTvShow) {
    console.log('ERROR! Param requiere')
    help()
    process.exit(1)
  }

  titleToSearch = process.argv[3]
  if (!titleToSearch) {
    console.log('ERROR! Param requiere')
    help()
    process.exit(1)
  }

  yearToSearch = process.argv[4]
  if (!yearToSearch) {
    console.log('ERROR! Param requiere')
    help()
    process.exit(1)
  }
}

function help() {
  console.log('Search a Film or TVShow in TMDB and OMDB databases')
  console.log(`   Usage: ${process.argv[1]} -f|-t 'title' 'year'`)
  console.log('   -f : For search Film')
  console.log('   -t : For search TVShows')
}

function searchFilmOnTMDB(isFilmOrTvShow, title, year) {
  console.log('#############################################')
  console.log('TMDB => Searching only on TMDB')
  console.log('')
  if (isFilmOrTvShow === '-f') {
    return tmdb.searchShow(title, year, 'movie', false).then((showData) => {
      console.log(`Film: ${JSON.stringify(showData)}`)
      console.log('')
    })
  }

  if (isFilmOrTvShow === '-t') {
    return tmdb.searchShow(title, year, 'tv', false).then((showData) => {
      console.log(`TV Show: ${JSON.stringify(showData)}`)
      console.log('')
    })
  }
}

function searchFilmOnOMDB(isFilmOrTvShow, title, year) {
  console.log('#############################################')
  console.log('OMDB => Searching only on OMDB')
  console.log('')
  if (isFilmOrTvShow == '-f') {
    return omdb.searchShow(title, year, 'movie', false).then((showData) => {
      console.log(`Film: ${JSON.stringify(showData)}`)
      console.log('')
    })
  }

  if (isFilmOrTvShow === '-t') {
    return omdb.searchShow(title, year, 'tv', false).then((showData) => {
      console.log(`TV Show: ${JSON.stringify(showData)}`)
      console.log('')
    })
  }
}

function searchFilmByTitle(isFilmOrTvShow, title, year) {
  console.log('#############################################')
  console.log('XMDB => Searching and mixed results from TMDB o OMDB')
  console.log('')

  const show = new Show()
  show.title = title
  show.year = year

  if (isFilmOrTvShow === '-f') {
    return xmdbSearcher.searchShowInXMDB(show, 'movie', false).then((showData) => {
      console.log(`Film: ${JSON.stringify(showData)}`)
      console.log('')
    })
  }
  if (isFilmOrTvShow === '-t') {
    return xmdbSearcher.searchShowInXMDB(show, 'tv', false).then((showData) => {
      console.log(`TV Show: ${JSON.stringify(showData)}`)
      console.log('')
    })
  }
}

processParamTitle()

searchFilmOnTMDB(filmOrTvShow, titleToSearch, yearToSearch)
  .then(() => {
    searchFilmOnOMDB(filmOrTvShow, titleToSearch, yearToSearch).then(
      () => { searchFilmByTitle(filmOrTvShow, titleToSearch, yearToSearch) },
    )
  })
