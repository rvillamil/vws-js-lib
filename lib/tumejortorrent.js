//
// NPM modules
//
const rp = require('request-promise');
const cheerio = require('cheerio');
const Show = require('./show');

//
// Export my NPM functions 
//
exports.crawlURLsWithBillboardFilms = function (limit) {
    return crawlShows('http://tumejortorrent.com/estrenos-de-cine/', limit, 'pelilist');
}

exports.crawlURLsWithVideoPremieres = function (limit) {
    return crawlShows('http://tumejortorrent.com/peliculas-x264-mkv/', limit, 'pelilist')
}

exports.crawlURLsFromTVShow = function (tvshowname, limit) {
    return crawlShows(`http://tumejortorrent.com/series-hd/${tvshowname}`, limit, 'buscar-list')
}

/**
 * Crawling data from 'tumejortorrent' url, with torrent video files
 * 
 * @param {*} urlWithShow URL whith show data
 * @returns Promise with Show object with data scraped
 */
exports.crawlShow = function (urlWithShow) {

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
                    show.fileSize = $(element).text().split('Size:')[1]
                    if (show.fileSize != null) {
                        show.fileSize = show.fileSize.trim();
                    }
                }
                if (index == 1) {
                    show.releaseDate = $(element).text().split('Fecha:')[1];
                    if (show.releaseDate != null) {
                        show.releaseDate = show.releaseDate.trim();
                    }
                }
            });

            // Year
            show.year = parseYear(show.description);
            if (!show.year) {
                if (show.releaseDate) {
                    var chunks = show.releaseDate.split('-');
                    if (chunks != null) {
                        show.year = chunks[2];
                    }
                }
            }

            // URLToDownload
            show.urltodownload = parseURLToDownload($.html());
            show.error = 0;
            return show;
        })
        .catch(function (err) {
            show.error = err;
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

/**
 * Crawling URL from 'tumejortorrent' portal to find url whith torrent video files
 * 
 * @param {*} url URL from 'tumejortorrent' domain whith shows
 * @param {*} limit If not null, limit the number of films to parse
 * @param {*} classListName html classname whith url list to process
 * 
 * @returns Promise with url list 
 */
function crawlShows(url, limit, classListName) {
    var urlList = [];
    const options = {
        uri: url,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return rp(options)
        .then(function ($) {
            $(`.${classListName} li a`).each(function (index, element) {
                urlList[index] = {};
                urlList[index] = $(element).attr('href');
                if ((limit != null) && (limit == (index + 1))) {
                    return false; // break each bucle
                }
            });
            return urlList;
        })

        .catch(function (err) {
            console.log(err);
        });
}