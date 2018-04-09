//
// See API: https://www.themoviedb.org/documentation/api
//   - Example: https://api.themoviedb.org/3/search/movie?api_key=f8f6fe20a118a8362fd4e17fa1313703&language=en-US&query=Ghost&page=1&include_adult=false&year=1990
//   - Request Limits: https://developers.themoviedb.org/3/getting-started/request-rate-limiting
//

// NPM modules
const rp = require('request-promise');
const Show = require('./show');

// Constants
const TMDB_API_KEY = "f8f6fe20a118a8362fd4e17fa1313703"; // Example: https://api.themoviedb.org/3/movie/550?api_key=f8f6fe20a118a8362fd4e17fa1313703
const URL_BASE = "http://api.themoviedb.org/3/";

//
// Export my NPM functions 
//
exports.searchShow = function (title, year) {
    return _doSearch(title, year);
}

// ------------------------------------
// Functions

// @see API: https://developers.themoviedb.org/3/search/search-movies
function _doSearch(title, year) {
    var requestOtions = {
        uri: URL_BASE + "search/movie",
        qs: {
            api_key: TMDB_API_KEY,
            query: title,
            year: year,
            include_adult: 'false',
            page: '1',
            language: 'es-ES',
        },
        json: true // Automatically parses the JSON string in the response
    };

    return rp(requestOtions)
        .then(function (response) {
            var show = new Show(title, year);
            if (response.total_results != 0) {
                first = response.results[0];

                show.sinopsis = first.overview;
                show.originalTitle = first.original_title;
                show.releaseDate = first.release_date;
                if (first.vote_average > 0) {
                    show.tmdbRating = first.vote_average
                }
                show.error = 0;
            } else {
                show.error = "TMDB title does not exist!"
            }
            //console.log("Response from TMDB: " + JSON.stringify(response));
            return show;
        })
        .catch(function (err) {
            return err;
        });
}

// JSON return from TMDB ...
/*
{   
    "page":1,
    "total_results":2,
    "total_pages":1,
    "results":[  
       {  
          "vote_count":8428,
          "id":11,
          "video":false,
          "vote_average":8.1,
          "title":"La guerra de las galaxias. Episodio IV: Una nueva esperanza",
          "popularity":45.430126,
          "poster_path":"/8ae71OAm6XwnvakAx6rYa1Lo5qD.jpg",
          "original_language":"en",
          "original_title":"Star Wars",
          "genre_ids":[  
             12,
             28,
             878
          ],
          "backdrop_path":"/4iJfYYoQzZcONB9hNzg0J0wWyPH.jpg",
          "adult":false,
          "overview":"La princesa Leia, líder del movimiento rebelde que desea reinstaurar la República en la galaxia en los tiempos ominosos del Imperio, es capturada por las malévolas Fuerzas Imperiales, capitaneadas por el implacable Darth Vader, el sirviente más fiel del emperador. El intrépido Luke Skywalker, ayudado por Han Solo, capitán de la nave espacial \"El Halcón Milenario\", y los androides, R2D2 y C3PO, serán los encargados de luchar contra el enemigo y rescatar a la princesa para volver a instaurar la justicia en el seno de la Galaxia.",
          "release_date":"1977-05-25"
       },
       {  
          "vote_count":15,
          "id":72694,
          "video":false,
          "vote_average":6.4,
          "title":"The Making of 'Star Wars'",
          "popularity":2.124669,
          "poster_path":"/WgsInarGqxj5a33H1oO1IJACDU.jpg",
          "original_language":"en",
          "original_title":"The Making of 'Star Wars'",
          "genre_ids":[  
             99
          ],
          "backdrop_path":"/eT9liR62vzdqrktB7wxiYyqeDHA.jpg",
          "adult":false,
          "overview":"",
          "release_date":"1977-09-16"
       }
    ]
 }
 */