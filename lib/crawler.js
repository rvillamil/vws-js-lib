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
exports.crawlBillboardFilms = function (onShowFound, limit) {
    return tumejortorrent.crawlBillboardFilms(onShowFound, limit).then(
        showList => {
            console.log("crawler - Billboard films length: " + showList.length);
            return showList;
        }
    ).catch(function (err) {
        console.log('Error on crawlBillboardFilms: ' + err);
    })
}

exports.crawlVideoPremieres = function (onShowFound, limit) {
    return tumejortorrent.crawlVideoPremieres(onShowFound, limit).then(
        showList => {
            console.log("crawler - VideoPremieres length: " + showList.length);
            return showList;
        }
    ).catch(function (err) {
        console.log('Error on crawlVideoPremieres: ' + err);
    })
}

/**
 * Callback function
 * @param {*} show Object found on search in tumejortorrent
 */
function searchInIMDB(show) {
    console.log("Entrando ..");
    tmdb.searchShow(show.title, show.year)
        .then(tmdbShow => {
            show.tmdbRating = mdbShow.tmdbRating;
            console.log('******* ShowTMDB: ', tmdbShow);
            return show;
        })
        .catch(err => {
            console.log('Error on tmdb search:' + err);
        });

    rertuomdb.searchShow(show.title, show.year)
        .then(omdbShow => {
            show.sinopsis = omdbShow.sinopsis;
            show.imdbRating = omdbShow.imdbRating;
            show.rottenTomatoes = omdbShow.rottenTomatoes;

            console.log('******* ShowOMDB: ', omdbShow);
            return show;
        })
        .catch(err => {
            console.log('Error on omdb search:' + err);
        });
}