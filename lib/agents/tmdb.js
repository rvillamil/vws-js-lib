// Modules
const axios = require('axios').default
const Show = require('../model/show')

// Constants
const TMDB_API_KEY  = 'f8f6fe20a118a8362fd4e17fa1313703' // Example: https://api.themoviedb.org/3/movie/550?api_key=f8f6fe20a118a8362fd4e17fa1313703
const URL_BASE      = 'http://api.themoviedb.org/3/'
 
// ------------------ Public API
const searchShow = (
  /** @type {String} */ title, 
  /** @type {String} */ year, 
  /** @type {String} */ kind = 'movie', 
  /** @type {Boolean} */ debug = false) => {
  
  var show    = new Show()
  show.title  = title
  show.year   = year
  show.error  = 1
  console.log(`Searching on TMDB '${kind}' show with title '${title}' for year ${year}`)
  return axios.get(`${URL_BASE}search/${kind}`, {params: {
    
    api_key: TMDB_API_KEY,
    query: title,
    year:year,
    include_adult:false,
    page:1,
    language:'es-ES'
  }})
    .then((arrayResults) => {
      // handle success                
      if (debug) {        
        console.log(`Response from TMDB => ${JSON.stringify(arrayResults.data)}`)
      }      
      // Retorna una lista de resultados cuyo nombre comienza por 'title'. Solo queremos uno
      if (arrayResults.total_results != 0) {
        // Obtenemos la mas proxima en el tiempo
        const tmdbShowData = _getTMDBShowDataWithTitle (title, arrayResults.data, kind)
        if (tmdbShowData) {
          _mapToShow (show, tmdbShowData)
        }
      }                 
    })
    .catch((error) => {      
      // handle error      
      console.log(`Error!!! => ${error}`)
    })
    .then(() => {
      // always executed
      //console.log(`*********************************************`)
      //console.log(`Response Show mapped from TMDB => ${JSON.stringify(show)}`)
      //console.log(``)      
      return show
    })
}

// ------------------ Private functions
/**
 * Obtiene el resultado para el que coincide el titulo exactamente
 * @param {string} title
 * @param {*} response
 * @param kind 'movie' or 'tv'
 */
function _getTMDBShowDataWithTitle (title, response, kind) {
  //console.log(`tmdbShow => ${JSON.stringify(response)}`)  
  var tmdbShow = response.results[0]
  var tmdbTitle
  //console.log(`_getTMDBShowDataWithTitle tmdbShow => ${JSON.stringify(response)}`)  
  //console.log ("TMDB _getTMDBShowDataWithTitle => " +title)    

  for (var i = 0; i < response.total_results; ++i) {
    
    if (kind=='movie') {
      tmdbTitle=response.results[i].title
    } else if (kind='tv') {
      tmdbTitle=response.results[i].name
    }

    if (tmdbTitle) {
      if ( tmdbTitle.toUpperCase() === title.toUpperCase() ){
        tmdbShow = response.results[i]
        return tmdbShow
      }
    }
  }
  //console.log ("TMDB  show => " +tmdbShow)    
  return tmdbShow
}


/**
 * @param {Show} show
 * @param {Object} tmdbShowData
 */
function _mapToShow( show, tmdbShowData) {
  
  if (tmdbShowData.overview) {
    show.sinopsis       = tmdbShowData.overview
  }  
  if (tmdbShowData.original_title) {
    show.originalTitle  = tmdbShowData.original_title
  }  
  if (tmdbShowData.release_date) {
    show.releaseDate    = tmdbShowData.release_date
    show.year           = tmdbShowData.release_date.split('-')[0] // Sobreescribimos que podria haber variado ya que la busqueda es aproximada
  }
  if (tmdbShowData.vote_average > 0) {
    show.tmdbRating = tmdbShowData.vote_average
  }
  if (tmdbShowData.poster_path) {
    show.urlwithCover = `http://image.tmdb.org/t/p/w185/${tmdbShowData.poster_path}`
  }
  show.error = 0
  //console.log(`tmdb - _mapToShow: The Show => ${JSON.stringify(show)}`)
}


// Export
module.exports = {
  searchShow  
}