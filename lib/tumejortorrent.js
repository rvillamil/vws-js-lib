//
// NPM modules
//
const rp = require('request-promise');
const cheerio = require('cheerio');
const Show = require('./show.js');

//
// Export my NPM functions 
//
exports.crawlBillboardFilms = function (onShowFound) {
    return crawlShows('http://tumejortorrent.com/estrenos-de-cine/', onShowFound);
}

exports.crawlVideoPremieres = function (onShowFound) {
    return crawlShows('http://tumejortorrent.com/peliculas-x264-mkv/', onShowFound)
}

exports.crawlShow = function (urlWithShow) {
    return parseShow(urlWithShow)
}

/**
 * Crawling URL from 'tumejortorrent' portal to find 'Show' objects (Films, TV shows...etc)
 * 
 * https://stackoverflow.com/questions/31413749/node-js-promise-all-and-foreach
 * 
 * @param {*} url URL from 'tumejortorrent' domain whith shows
 * @param {*} onShowFound This function is called when crawl a 'Show' object
 * @returns promise
  */
function crawlShows(url, onShowFound) {

    var fnParseShow = function (url) {
        return parseShow(url)
    }

    return parseFilms(url)
        .then(urlItems => {
            //console.log("ITEMS:" + items);
            var actions = urlItems.map(fnParseShow); // run the function 'parseShow' over all items
            // we now have a promises array and we want to wait for it
            return Promise.all(actions)
                .then(
                    shows => { // or just .then(console.log)
                        shows.map(myFunction);      
                        return shows;                  
                    }
                )
        });
}

// ------------------------------
/**
 * Parse films in tumejortorrent portal.
 * 
 * @param {*} urlPortal tumejortorrent url portal
 * @param {*} limit If not null, limit the number of films to parse
 */
function parseFilms(urlPortal, limit) {
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
                if ((limit != null) && (limit == index)) {
                    return false; // break each bucle
                }
            });
            return urlList;
        })

        .catch(function (err) {
            console.log(err);
        });
}


function parseShow(urlWithShow) {
    var show = new Show();

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
            // Original Title
            show.originalTitle = parseOriginalTitle(show.description);
            // console.log('show.originalTitle: ' + show.originalTitle);
            // Sinopsis
            show.sinopsis = parseSinopsis(show.description);
            if (show.sinopsis) { // Si la sinopsis esta dentro de la descripcion..
                show.description = $('.descripcion_top').text().split("Sinopsis")[0]; // Quitamos la sinopsis a la descripcion
            } else {
                show.sinopsis = $('.sinopsis').text(); // Establecemos el valor de sinopsis que nos venga...
            }
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

            // Year
            show.year = parseYear(show.description);
            if (!show.year) {
                show.year = show.releaseDate.split('-')[2];
            }

            // URLToDownload
            show.urltodownload = parseURLToDownload($.html());

            return show;
        })
        .catch(function (err) {
            console.log(err);
        });
}

function parseYear(str) {
    const regex = /((AÃ±o:)|(AÃ±o))\s+(\d\d\d\d)/g;
    let m, originalTitle;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        originalTitle = m[4].trim();
    }
    return originalTitle;
}

function parseOriginalTitle(str) {
    const regex = /((tulo original)|(tulo original:))\s+(.*)AÃ±o/g;
    let m, originalTitle;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        originalTitle = m[4].trim();
    }
    return originalTitle;
}

function parseSinopsis(str) {
    const regex = /Sinopsis\s+(.*)/g;
    let m, sinopsis;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        sinopsis = m[1];
    }
    return sinopsis;
}

function parseURLToDownload(str) {
    var matches = str.match("window\.location\.href.+=.+\"(.+)\"(;)");
    if (matches) {
        urltodownload = matches[1];
    }
    return urltodownload;
}

// ------------------------------------
//
// Example use:
//
crawlShows( 'http://tumejortorrent.com/peliculas-x264-mkv/',
            showObjectCrawled => console.log('showObject', showObjectCrawled)
).then (shows => console.log ('FIN: the show list is -->' + shows ));
