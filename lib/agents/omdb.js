// Modules
const axios = require('axios').default
const Show = require('../model/show')

// Constants
const OMDB_API_KEY = 'b86a1661' // FREE! (1,000 daily limit)
const URL_BASE = 'http://www.omdbapi.com/'

 
// ------------------ Public API
const searchShow = (
  /** @type {String} */ title,   
  /** @type {Boolean} */ debug = false) => {
  
  var show    = new Show()
  show.title  = title  
  show.error  = 1
  return axios.get(`${URL_BASE}`, { params: {    
    apikey: OMDB_API_KEY,
    t: title
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
      return show
    })
}

// ------------------ Private functions

/**
 * @param {Show} show
 * @param {Object} omdbShowData
 */
function _mapToShow( show, omdbShowData) {

  show.year           = omdbShowData.Year
  show.sinopsis       = omdbShowData.Plot
  show.originalTitle  = omdbShowData.Title
  show.imdbRating     = omdbShowData.imdbRating
  if (omdbShowData.Ratings[1]) {
    show.rottenTomatoes = omdbShowData.Ratings[1].Value
  }
  if (omdbShowData.Poster) {
    show.urlwithCover = omdbShowData.Poster
  }
  show.imdbID         = omdbShowData.imdbID
  show.releaseDate    = omdbShowData.Released
  show.description    = `Titulo Original ${omdbShowData.Title}. Duracion ${omdbShowData.Runtime}. Pais ${omdbShowData.Country} Director ${omdbShowData.Director}. Escritor ${omdbShowData.Writer} Actores ${omdbShowData.Actors} Genero ${omdbShowData.Genre}`
  show.error          = 0         
  //console.log(`omdb - _mapToShow: The Show => ${JSON.stringify(show)}`)
}


// Export
module.exports = {
  searchShow  
}