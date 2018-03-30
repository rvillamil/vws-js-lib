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
exports.crawlBillboardFilms = function (limit, onShowFoundEvent) {
    return tumejortorrent.crawlURLsWithBillboardFilms(limit)
        .then(urlList => {
            return _processURLList(urlList, onShowFoundEvent);
        }).catch(err => {
            console.error('ERROR! crawlBillboardFilms: ' + err);
        });
}

exports.crawlVideoPremieres = function (limit, onShowFoundEvent) {
    return tumejortorrent.crawlURLsWithVideoPremieres(limit)
        .then(urlList => {
            return _processURLList(urlList, onShowFoundEvent);
        }).catch(err => {
            console.error('ERROR! crawlVideoPremieres: ' + err);
        });
}

// ------------------------ functions ---------------------
function doCrawlAndSearchFrom(url) {

    return tumejortorrent.crawlShow(url).then(show => {
            return doSearchInTMDB(show);
        })
        .then(showTMDB => {
            return doSearchInOMDB(showTMDB);
        })
        .then(showOMDB => {
            return showOMDB;
        })
        .catch(err => {
            console.error('ERROR! - doCrawlAndSearchFrom - Error on search:' + err);
        })
}

function doSearchInTMDB(show) {
    return tmdb.searchShow(show.title, show.year)
        .then(tmdbShow => {

            if (tmdbShow.sinopsis != null) {
                show.sinopsis = tmdbShow.sinopsis
            }
            if (tmdbShow.originalTitle != null) {
                show.originalTitle = tmdbShow.originalTitle
            }
            show.tmdbRating = tmdbShow.tmdbRating

            return show;
        })
        .catch(err => {
            console.error('ERROR! - doSearchInTMDB - Error on tmdb search:' + err);
        })
}

function doSearchInOMDB(show) {
    return omdb.searchShow(show.title, show.year)
        .then(omdbShow => {
            show.imdbRating = omdbShow.imdbRating
            show.rottenTomatoes = omdbShow.rottenTomatoes
            if (omdbShow.description != null) {
                show.description = omdbShow.description
            }
            return show;
        })
        .catch(err => {
            console.error('ERROR! - doSearchInOMDB - Error on omdb search:' + err);
        })
}

function _processURLList(urlList, onShowFoundEvent) {

    var fnParseShow = function (urlWithShow) {
        return doCrawlAndSearchFrom(urlWithShow);
    }
    var actions = urlList.map(fnParseShow);

    return Promise.all(actions).then(
        showURL => { // or just .then(console.log)
            showURL.map(onShowFoundEvent);
            return urlList;
        }
    )
}