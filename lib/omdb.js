//
// See API: http://www.omdbapi.com
//

// NPM modules
const rp = require('request-promise');
const Show = require('./show');

// Constants
const OMDB_API_KEY = "b86a1661"; // FREE! (1,000 daily limit)
const URL_BASE = "http://www.omdbapi.com/";

//
// Export my NPM functions 
//
exports.searchShow = function (title, year) {
    return search(title, year);
}

// ------------------------------------
/**
 * Search show in OMDB database
 * 
 * @param {*} title Show title
 * @param {*} year Show year
 * 
 * @returns RequestPromise object with the 'Show'
 */
function search(title, year) {
    var requestOtions = {
        uri: URL_BASE,
        qs: {
            apikey: OMDB_API_KEY,
            t: title, // -> uri + '?t=title',
            y: year
        },
        json: true // Automatically parses the JSON string in the response
    };

    return rp(requestOtions)
        .then(function (response) {
            var show = new Show(title, year);
            if (response.Response != 'False') {
                show.sinopsis = response.Plot;
                show.originalTitle = response.Title;
                show.imdbRating = response.imdbRating;
                show.rottenTomatoes = response.Ratings[1].Value;
                show.imdbID = response.imdbID;
                show.releaseDate = response.Released;
                show.error = 0;
            } else {
                show.error = response.Error;
            }
            // console.log ("Response from OMDB: " + JSON.stringify (response));            
            return show;
        })
        .catch(function (err) {
            return err;
        });
}

// JSON return from OMDB ...
/*
Response: {
    "Title":"Star Wars: Episode IV - A New Hope",
    "Year":"1977",
    "Rated":"PG",
    "Released":"25 May 1977",
    "Runtime":"121 min",
    "Genre":"Action, Adventure, Fantasy",
    "Director":"George Lucas",
    "Writer":"George Lucas",
    "Actors":"Mark Hamill, Harrison Ford, Carrie Fisher, Peter Cushing",
    "Plot":"Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle-station while also attempting to rescue Princess Leia from the evil Darth Vader.",
    "Language":"English",
    "Country":"USA",
    "Awards":"Won 6 Oscars. Another 50 wins & 28 nominations.",
    "Poster":"https://images-na.ssl-images-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    "Ratings":[
            {"Source":"Internet Movie Database","Value":"8.6/10"},
            {"Source":"Rotten Tomatoes","Value":"93%"},
            {"Source":"Metacritic","Value":"90/100"}],
    "Metascore":"90",
    "imdbRating":"8.6",
    "imdbVotes":"1,035,722",
    "imdbID":"tt0076759",
    "Type":"movie",
    "DVD":"21 Sep 2004",
    "BoxOffice":"N/A",
    "Production":"20th Century Fox",
    "Website":"http://www.starwars.com/episode-iv/",
    "Response":"True"}
*/