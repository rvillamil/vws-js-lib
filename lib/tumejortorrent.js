//
// NPM modules
//
const rp = require('request-promise');
const cheerio = require('cheerio');
const Show = require('./show');

//
// Export my NPM functions 
//

/**
 * Crawling URLs from 'http://tumejortorrent.com/estrenos-de-cine/', with torrent billboard films
 * 
 * @param {*} limit video film list limit to return
 * @returns Promise whith url list
 */
exports.crawlURLsWithBillboardFilms = function (limit) {
    return _crawlShows('http://tumejortorrent.com/estrenos-de-cine/', limit, 'pelilist');
}

/**
 * Crawling URLs from 'http://tumejortorrent.com/peliculas-x264-mkv/' url, with torrent video premieres
 * 
 * @param {*} limit film list limit to return
 * @returns Promise whith url list
 */
exports.crawlURLsWithVideoPremieres = function (limit) {
    return _crawlShows('http://tumejortorrent.com/peliculas-x264-mkv/', limit, 'pelilist')
}

/**
 * Crawling URLs from 'http://tumejortorrent.com/series-hd/', with latest torrent tvshows published
 * 
 * @param {*} limit film list limit to return
 * @returns Promise with url list where every URL, is a link to the latest episode published
 */
exports.crawlURLsWithTVShows = function (limit) {

    return _crawlShows('http://tumejortorrent.com/series-hd/', limit, 'pelilist')
        .then(urlListWithTVShows => {
            return _crawlListWithFirstEpisodeURL(urlListWithTVShows)
        })

        .catch(function (err) {
            console.error(`ERROR! - crawlURLsWithTVShows: '${err}'`)
        });
}

/**
 * Crawl the URLs with the episode list, for a tvshow name
 * 
 * @param {*} tvshowname path in the url http://tumejortorrent.com/series-hd/${tvshowname}, where de tvshow is located 
 *      e.g: /erase-una-vez/1490
 * 
 * @param {*} limit episodes list limit to return
 * @returns Promise whith url list
 */
exports.crawlEpisodesURL = function (tvshowname, limit) {
    return _crawlShows(`http://tumejortorrent.com/series-hd/${tvshowname}`, limit, 'buscar-list')
}

/**
 * Crawl 'Show object' data, from domain 'tumejortorrent.com', with a torrent video/film/TVShow file
 * 
 * @param {*} urlWithShow URL whith show data
 *  e.g: The Film, http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
 *  e.g: The TVShow episode, http://tumejortorrent.com/descargar/serie-en-hd/erase-una-vez/temporada-7/capitulo-14/
 * 
 * @returns Promise with Show object with data scraped
 */
exports.crawlShow = function (urlWithShow) {

    var strURLWithShow = urlWithShow + "";
    var show = new Show();

    const options = {
        uri: strURLWithShow,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return rp(options)
        .then(function ($) {
            // URL base
            show.urlBase = strURLWithShow;
            // console.log(`SHOW::  --> ${JSON.stringify(show)}\n\n`)
            // Title
            show.title = $('.page-box h1 strong').text().trim();
            // Session 
            show.currentSession = _parseSession(show.title)
            // Episode
            show.currentEpisode = _parseEpisode(show.title, show.currentSession)
            // Description
            show.description = $('.descripcion_top').text();
            // Original Title
            show.originalTitle = _parseOriginalTitle(show.description);
            // Sinopsis
            show.sinopsis = _parseSinopsis(show.description);
            // Description
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
            show.urlwithCover = $('.entry-left a img').attr("src")
            // ReleaseDate and filesize
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
            show.year = _parseYear(show.description);
            if (!show.year) {
                if (show.releaseDate) {
                    var chunks = show.releaseDate.split('-');
                    if (chunks != null) {
                        show.year = chunks[2];
                    }
                }
            }
            // URLToDownload
            show.urltodownload = _parseURLToDownload($.html());
            show.error = 0;
            return show;
        })
        .catch(function (err) {
            console.error(`ERROR! - crawlShow: '${err}'`)
            show.error = err;
        });
}

// ----------------------------------------------------------------------------
// 
// Private functions
//
function _parseYear(str) {
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

function _parseOriginalTitle(str) {
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

function _parseSinopsis(str) {
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

function _parseURLToDownload(str) {
    var matches = str.match("window\.location\.href.+=.+\"(.+)\"(;)");
    if (matches) {
        urltodownload = matches[1];
    }
    return urltodownload;
}

/**
 * Parse sessin from title
 * 
 * @param {*} title the title of the tvshow
 *   e.g "Modern Family  /  Modern Family - Temporada 8 [HDTV 720p][Cap.809][AC3 5.1 Español Castellano]"
 *       "Mom  /  Mom - Temporada 4 [HDTV][Cap.418][AC3 5.1 Español Castellano]"
 * @param {*} session  the session string. 
 *        e.g "4"
 */
function _parseSession(title) {
    const regex = /Temporada\s(\d+)\s/g;
    let m, session;
    while ((m = regex.exec(title)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        session = m[1];
    }
    return session;
}


/**
 * Parse episode from title
 * 
 * @param {*} title the title of the tvshow
 *   e.g "Modern Family  /  Modern Family - Temporada 8 [HDTV 720p][Cap.809][AC3 5.1 Español Castellano]"
 *       "Mom  /  Mom - Temporada 4 [HDTV][Cap.418][AC3 5.1 Español Castellano]"
 * @param {*} session  the session string. 
 *        e.g "4"
 */
function _parseEpisode(title, session) {
    const regex = /Cap.+ session + (\d+)/g;
    let m, episode;
    while ((m = regex.exec(title)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        episode = m[1];
    }
    return episode;
}

/**
 * Crawling URL from 'tumejortorrent' portal, searching urls whith torrent video files
 * 
 * @param {*} url URL from 'tumejortorrent' domain whith shows
 * @param {*} limit If not null, limit the number of films to parse
 * @param {*} classListName html classname whith url list to process
 * 
 * @returns Promise with url list 
 */
function _crawlShows(url, limit, classListName) {
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
            console.error(`ERROR! - _crawlShows: '${err}'`)
        });
}

function _crawlListWithFirstEpisodeURL(urlListWithTVShows) {

    var fnParseShow = function (urlWithShow) {
        return _crawlShows(urlWithShow, 1, 'buscar-list')
    }
    var actions = urlListWithTVShows.map(fnParseShow);

    return Promise.all(actions).then(urlListWithLatestEpisode => {
        return urlListWithLatestEpisode
    })
}