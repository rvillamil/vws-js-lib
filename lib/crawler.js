//
// NPM modules
//
const show = require('./show');
const omdb = require('./omdb');
const tmdb = require('./tmdb');
const tumejortorrent = require('./tumejortorrent');

//
// Export my NPM functions 
//
exports.crawlBillboardFilms = function (onShowFound) {
    return tumejortorrent.crawlBillboardFilms(onShowFound).then(
        showListResutl => {
            console.log("billboardfilms length: " + showListResutl.length);
        }
    ).catch(function (err) {
        console.log('Error on crawlBillboardFilms: ' + err);
    })
}

exports.crawlVideoPremieres = function (onShowFound) {
    return tumejortorrent.crawlVideoPremieres(onShowFound).then(
        showListResutl => {
            console.log("VideoPremieres length: " + showListResutl.length);
        }
    ).catch(function (err) {
        console.log('Error on crawlVideoPremieres: ' + err);
    })
}

/**
 * Callback function
 * @param {*} show Object found on search in tumejortorrent
 */
function onShowFound(show) {

    tmdb.searchShow(show.title, show.year)
        .then(tmdbShow => {
            show.tmdbRating = mdbShow.tmdbRating;

            console.log('******* ShowTMDB: ', tmdbShow);
        })
        .catch(err => {
            console.log('Error on tmdb search:' + err);
        });

    omdb.searchShow(show.title, show.year)
        .then(omdbShow => {
            show.sinopsis = omdbShow.sinopsis;
            show.imdbRating = omdbShow.imdbRating;
            show.rottenTomatoes = omdbShow.rottenTomatoes;

            console.log('******* ShowOMDB: ', omdbShow);
        })
        .catch(err => {
            console.log('Error on omdb search:' + err);
        });
}