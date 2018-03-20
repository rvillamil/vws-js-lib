//
// See API: http://www.omdbapi.com
//

//
// NPM modules
//
const rp = require('request-promise');
const OMDB_API_KEY = "b86a1661"; // FREE! (1,000 daily limit)
const URL_BASE = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY;


//
// Export my NPM functions 
//
exports.searchShow = function (title, year) {
    return search(title, year);
}

// ------------------------------------
/**
 * Search show in OMDB database
 * @param {*} title Show title
 * @param {*} year Show year
 */
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

// ------------------------------------
//
// Example use:
//
/*
search('Star wars', '1977')
    .then(function (response) {
        console.log('Response: ', response);
    })
    .catch(function (err) {
        console.log('Error: ' + err);
    });

search('No existe', '1977')
    .then(function (response) {
        console.log('Response: ', response);
    })
    .catch(function (err) {
        console.log('Error: ' + err);
    });
    */