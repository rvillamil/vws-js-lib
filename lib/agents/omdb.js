// Modules
const axios = require('axios').default
const Show = require('../model/show')

// Constants
const OMDB_API_KEY = 'b86a1661' // FREE! (1,000 daily limit)
const URL_BASE = 'http://www.omdbapi.com/'

 
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
  var omdbType = kind
  if (kind=='tv'){
    omdbType='series'
  }
  console.log(`Searching on OMDB '${omdbType}' show with title '${title}' for year '${year}'`)
  return axios.get(`${URL_BASE}`, { params: {    
    apikey: OMDB_API_KEY,
    t: title,
    type: omdbType,
    y: year
  }})
    .then((response) => {
      // handle success          
      if (debug) {        
        console.log(`Response from OMDB => ${JSON.stringify(response.data)}`)
      }      
      if (response.data.Response != 'False') {
        _mapToShow(show, response.data)
      }
    })
    .catch((error) => {      
      // handle error      
      console.log(`Error!!! => ${error}`)
    })
    .then(() => {
      // always executed
      //console.log(`*********************************************`)
      //console.log(`Response Show mapped from OMDB => ${JSON.stringify(show)}`)
      //console.log(``)      
      return show
    })
}

// ------------------ Private functions

/**
 * @param {Show} show
 * @param {Object} omdbShowData
 */
function _mapToShow( show, omdbShowData) {
  if (omdbShowData.Year) {
    show.year           = omdbShowData.Year
  }
  if (omdbShowData.Plot) {
    show.sinopsis       = omdbShowData.Plot
  }
  if (omdbShowData.Title) {
    show.originalTitle  = omdbShowData.Title
  }
  if (omdbShowData.imdbRating) {
    show.imdbRating     = omdbShowData.imdbRating
  }
  if (omdbShowData.Ratings[1]) {
    if (omdbShowData.Ratings[1].Value) {
      show.rottenTomatoes = omdbShowData.Ratings[1].Value
    }
  }
  if (omdbShowData.Poster) {
    show.urlwithCover = omdbShowData.Poster
  }
  if (omdbShowData.imdbID) {
    show.imdbID         = omdbShowData.imdbID
  }
  if (omdbShowData.Released) {
    show.releaseDate    = omdbShowData.Released
  }  
  if (omdbShowData.Poster) {
    show.description    = `Titulo Original ${omdbShowData.Title}. Duracion ${omdbShowData.Runtime}. Pais ${omdbShowData.Country} Director ${omdbShowData.Director}. Escritor ${omdbShowData.Writer} Actores ${omdbShowData.Actors} Genero ${omdbShowData.Genre}`
  }
  show.error          = 0         
  //console.log(`omdb - _mapToShow: The Show => ${JSON.stringify(show)}`)
}


// Export
module.exports = {
  searchShow  
}