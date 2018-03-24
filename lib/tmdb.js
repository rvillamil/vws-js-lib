//
// See API: https://www.themoviedb.org/documentation/api
//   - Example: https://api.themoviedb.org/3/search/movie?api_key=f8f6fe20a118a8362fd4e17fa1313703&language=en-US&query=Ghost&page=1&include_adult=false&year=1990
//   - Request Limits: https://developers.themoviedb.org/3/getting-started/request-rate-limiting
//

// NPM modules
const rp = require('request-promise');
// Constants
const TMDB_API_KEY = "f8f6fe20a118a8362fd4e17fa1313703"; // Example: https://api.themoviedb.org/3/movie/550?api_key=f8f6fe20a118a8362fd4e17fa1313703
const URL_BASE = "http://api.themoviedb.org/3/";

//
// Export my NPM functions 
//
exports.searchShow = function (title, year) {
    return search(title, year);
}

// ------------------------------------
// Functions

// @see API: https://developers.themoviedb.org/3/search/search-movies
function search(title, year) {
    var requestOtions = {
        uri: URL_BASE + "search/movie?api_key=" + TMDB_API_KEY + "&language=es-ES&page=1&include_adult=false",
        qs: {
            query: title, // -> uri + '?t=title',
            year: year
        },
        json: true // Automatically parses the JSON string in the response
    };

    return rp(requestOtions)
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            return err;
        });

}