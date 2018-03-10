//
// NPM modules
//
const rp = require('request-promise');
const cheerio = require('cheerio');

//
// Export my NPM functions 
//
exports.crawlBillboardFilms = function (myFunction, onCrawlFinish) {
    return crawlShows('http://tumejortorrent.com/estrenos-de-cine/', myFunction, onCrawlFinish);
}

exports.crawlVideoPremieres = function (myFunction, onCrawlFinish) {
    return crawlShows('http://tumejortorrent.com/peliculas-x264-mkv/', myFunction, onCrawlFinish)
}

/**
 * Parse URL from 'tumejortorrent' portal, scraping shows (Films, TVshows...etc)
 * 
 * https://stackoverflow.com/questions/31413749/node-js-promise-all-and-foreach
 * 
 * @param {*} urlPortal URL with shows
 * @param {*} myFunction Function to apply on every show scraped
 * @param {*} onCrawlFinish If not null, then run on finish process
 */
function crawlShows(urlPortal, myFunction, onCrawlFinish) {
    parseFilms(urlPortal)
        .then(urlItems => {
            //console.log("ITEMS:" + items);
            var actions = urlItems.map(fnParseShow); // run the function 'parseShow' over all items
            // we now have a promises array and we want to wait for it
            var results = Promise.all(actions); // pass array of promises
            results
                .then(data => { // or just .then(console.log)
                    data.map(myFunction);
                    if (onCrawlFinish != null) {
                        onCrawlFinish();
                    }
                });
        });
}

// ------------------------------
function parseFilms(urlPortal) {
    var urlList = [];

    const options = {
        uri: urlPortal,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return rp(options)
        .then(function ($) {
            $('.pelilist li a').each(function (index, element) {
                urlList[index] = {};
                urlList[index] = $(element).attr('href');
            });
            return urlList;
        })

        .catch(function (err) {
            console.log(err);
        });
}

var fnParseShow = function parseShow(urlWithShow) {
    var show = {}; // Init show Object

    const options = {
        uri: urlWithShow,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return rp(options)
        .then(function ($) {
            // URL base
            show.urlBase = urlWithShow;
            // Title
            show.title = $('.page-box h1 strong').text().trim();
            // TODO session 
            // TODO episode
            // Description
            show.description = $('.descripcion_top').text();
            // Sinopsis
            show.sinopsis = $('.sinopsis').text();
            //  Quality : Primera cadena entre [ ]
            var matches = $('.page-box h1').text().match(/\[(.*?)\]/);
            if (matches) {
                show.quality = matches[1];
            }
            // URLWithCover
            show.urlwithCover = $('.entry-left a img').attr("src");
            // releaseDate and filesize
            $('.entry-left .imp').each(function (index, element) {
                if (index == 0) {
                    show.fileSize = $(element).text().split('Size:')[1].trim();
                }
                if (index == 1) {
                    show.releaseDate = $(element).text().split('Fecha:')[1].trim();
                }
            });
            // URLToDownload
            show.urltodownload = parseURLToDownload($.html());

            return show;
        })
        .catch(function (err) {
            console.log(err);
        });
}

function parseURLToDownload(htmlText) {
    var matches = htmlText.match("window\.location\.href.+=.+\"(.+)\"(;)");
    if (matches) {
        urltodownload = matches[1];
    }
    return urltodownload;
}

// ------------------------------------
//
// Example use:
//
/*
crawlShows(
    'http://tumejortorrent.com/peliculas-x264-mkv/',
    function (showObject) {
        console.log('showObject', showObject);
    },
    function () {
        console.log("FIN");
    }
);
*/