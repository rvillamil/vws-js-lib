//
// See API: http://www.omdbapi.com
//

// NPM modules
const rp = require('request-promise');
// Constants
const OMDB_API_KEY = "b86a1661"; // FREE! (1,000 daily limit)
const URL_BASE = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY;

//
// Export my NPM functions 
//
exports.searchShow = function (title, year) {
    return search(title, year);
}

// ------------------------------------
// Functions
function search(title, year) {
    var requestOtions = {
        uri: URL_BASE,
        qs: {
            t: title, // -> uri + '?t=title',
            y: year
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