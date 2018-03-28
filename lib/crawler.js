//
// NPM modules
//
//const rp = require('request-promise');
//const cheerio = require('cheerio');
const show = require('./show');
const omdb = require('./omdb');
const tmdb = require('./tmdb');
const tumejortorrent = require('./tumejortorrent');

//
// Export my NPM functions 
//


/*
TMDB info

show.sinopsis = first.overview;
show.originalTitle = first.original_title;                
show.releaseDate = first.release_date;
show.tmdbRating = first.vote_average;
*/

/*
OMDB info

show.sinopsis = response.Plot;
show.originalTitle = response.Title;
show.imdbRating = response.imdbRating;
show.rottenTomatoes = response.Ratings[1].Value;
show.imdbID = response.imdbID;
show.releaseDate = response.Released;
*/

exports.crawlBillboardFilms = function (onShowFound) {

    tumejortorrent.crawlBillboardFilms(
            show => {

                tmdb.searchShow(show.title, show.year)
                    .then(tmdbShow => {
                        show.tmdbRating = mdbShow.tmdbRating;

                        console.log('ShowTMDB: ', tmdbShow);
                    })
                    .catch(err => {
                        console.log('Error on tmdb search:' + err);
                    });

                omdb.searchShow(show.title, show.year)
                    .then(omdbShow => {
                        show.sinopsis = omdbShow.sinopsis;
                        show.imdbRating = omdbShow.imdbRating;
                        show.rottenTomatoes = omdbShow.rottenTomatoes;

                        console.log('ShowOMDB: ', omdbShow);
                    })
                    .catch(err => {
                        console.log('Error on omdb search:' + err);
                    });

                console.log('Show with full data: ', show);
            })
        .then(
            showList => {
                console.log("billboardfilms length: " + showList.length);
            }
        ).catch(function (err) {
            console.log('Error on crawlBillboardFilms: ' + err);
        });
}

exports.crawlVideoPremieres = function (onShowFound) {
    return crawlShows(onShowFound);
}

exports.crawlShow = function (url, limit) {
    return parseShow(url, limit);
}