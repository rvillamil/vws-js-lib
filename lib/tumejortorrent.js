//
// NPM modules
//
const rp = require('request-promise');
const cheerio = require('cheerio');
const Show = require('./show');
const LinkChained = require('./linkChained');
const ShowCollection = require('./showcollection');

//
// Constants
//
const URL_BASE_VIDEOPREMIERES_HD = 'http://tumejortorrent.com/peliculas-x264-mkv/'
const URL_BASE_BILLBOARDFILMS = 'http://tumejortorrent.com/estrenos-de-cine/'
const URL_BASE_TVSHOWS_HD = 'http://tumejortorrent.com/series-hd/'

//
// Export my NPM functions 
//

/**
 * Crawling URLs from 'http://tumejortorrent.com/peliculas-x264-mkv/' url, with torrent video premieres
 * 
 * @param {*} limit film list limit to return
 * @returns Promise whith 'LinkChained' array, where 'current' is the show data link and 'from' is the url from
 * e.g. 

[{
    "current": "http://tumejortorrent.com/descargar/peliculas-x264-mkv/no-soy-un-hombre-facil-/bluray-microhd/",
    "from": "http://tumejortorrent.com/peliculas-x264-mkv/"
    }, {
    "current": "http://tumejortorrent.com/descargar/peliculas-x264-mkv/come-sunday-/bluray-microhd/",
    "from": "http://tumejortorrent.com/peliculas-x264-mkv/"
    }
]
*/
exports.crawlLinkToURLsWithVideoPremieres = function (limit) {
    return _crawlLinksFrom(new LinkChained(URL_BASE_VIDEOPREMIERES_HD), limit, 'pelilist')
}

/**
 * Crawling URLs from 'http://tumejortorrent.com/estrenos-de-cine/', with torrent billboard films
 * 
 * @param {*} limit video film list limit to return
 * @returns Promise whith 'LinkChained' array, where 'current' is the show data link and 'from' is the url from
 * e.g.
[{
    "current": "http://tumejortorrent.com/descargar/peliculas-castellano/estrenos-de-cine/cincuenta-sombras-liberadas-/bluray-screeener/",
    "from": "http://tumejortorrent.com/estrenos-de-cine/"
    }, {
    "current": "http://tumejortorrent.com/descargar/peliculas-castellano/estrenos-de-cine/todo-el-dinero-del-mundo-/bluray-screeener/"
    "from": "http://tumejortorrent.com/estrenos-de-cine/"
    }
]
*/
exports.crawlLinkToURLsWithBillboardFilms = function (limit) {
    return _crawlLinksFrom(new LinkChained(URL_BASE_BILLBOARDFILMS), limit, 'pelilist')
}

/**
 * Crawling URLs from 'http://tumejortorrent.com/series-hd/', with latest tvshows published
 * 
 * @param {*} limit film list limit to return
 * @returns Promise whith 'LinkChained' array , where 'current' is the tvshow data link and 'from' is the collection link
 * e.g.
[{
    "current": "http://tumejortorrent.com/descargar/serie-en-hd/siren/temporada-1/capitulo-04/",
    "from": "http://tumejortorrent.com/series-hd/siren/3797"
    }, {
    "current": "http://tumejortorrent.com/descargar/serie-en-hd/arrow/temporada-6/capitulo-17/",
    "from": "http://tumejortorrent.com/series-hd/arrow/1596"
    }
*/
exports.crawlLinkToURLsWithLatestTVShows = function (limit) {

    return _crawlLinksFrom(new LinkChained(URL_BASE_TVSHOWS_HD), limit, 'pelilist')
        .then(linkChainedToCollectionList => {
            return _crawlFirstLinkToURLWithShowFrom(linkChainedToCollectionList)
        })

        .catch(function (err) {
            console.error(`ERROR! - crawlLinkToURLsWithLatestTVShows: '${err}'`)
        });
}


/**
 * Crawl the URLs with the collection episodes, for a tvshow name
 * 
 * @param {*} collectionName path in the url http://tumejortorrent.com/series-hd/${collectionName}, where de tvshow is located 
 *      e.g: /erase-una-vez/1490
 * 
 * @param {*} limit episodes list limit to return
 * @returns Promise with url list
 */
/*
exports.crawlURLsWithCollection = function (limit, collectionName) {
    return _crawlURLsShows(`${URL_BASE_TVSHOWS_HD}${collectionName}`, limit, 'buscar-list')
}
*/

/**
 * Crawl 'Show object' data, from domain 'tumejortorrent.com', with a torrent video/film/TVShow file
 * 
 * @param {*} urlWithShow URL whith show data
 *  e.g: The Film, http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
 *  e.g: The TVShow episode, http://tumejortorrent.com/descargar/serie-en-hd/erase-una-vez/temporada-7/capitulo-14/
 * 
 * @returns Promise with Show object with data scraped
 */
exports.crawlDataShow = function (urlWithShow, urlWithCollection) {
    //console.log(`SHOW urlWithShow:  --> ${JSON.stringify(urlWithShow)}\n\n`)
    //console.log(`SHOW urlWithCollection:  --> ${JSON.stringify(urlWithCollection)}\n\n`)

    var strURLWithShow = urlWithShow + ""
    var strURLWithCollection = urlWithCollection + ""
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

            // Collection Name    
            var urlSplittedStr = strURLWithCollection.split("/")
            if (urlSplittedStr.length > 1) {
                show.collectionName = `${urlSplittedStr[urlSplittedStr.length-2]}/${urlSplittedStr[urlSplittedStr.length-1]}`
            }
            // Title
            show.title = $('.page-box h1 strong').text().trim();
            // Session 
            const fullTitle = $('.page-box h1').text().trim();
            show.currentSession = _parseSession(fullTitle)
            // Episode
            if (show.currentSession) {
                show.currentEpisode = _parseEpisode(fullTitle, show.currentSession)
            }
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
            // console.log(`SHOW - crawlDataShow:  --> ${JSON.stringify(show)}\n\n`)
            return show;
        })
        .catch(function (err) {
            console.error(`ERROR! - crawlDataShow: '${err}'`)
            show.error = err;
        });
}


/**
 * Crawl 'ShowCollection' data, from domain 'tumejortorrent.com', with a torrent video/film/TVShow file
 *
 * @param {*} collectionName name for the collection
 *              e.g: 'erase-una-vez/1490' 
 * @param {*} urlsWithCollection URLs with links to Show data to crawl
 * @returns Promise with ShowCollection object with data scraped
 */
/*
exports.crawlDataShowCollection = function (collectionName, urlsWithCollection) {

    //var strURLWithShow = urlWithShow + "";

    var fnCrawlDataShow = function (urlWithShow) {
        return crawlDataShow(urlWithShow)
    }
    var actions = urlsWithCollection.map(fnCrawlDataShow);
    return Promise.all(actions)
        .then(shows => {
            // Creamos la collecion            
            var showCollection = new ShowCollection();
            showCollection.name(collectionName);
            showCollection.urlBase = URL_BASE_TVSHOWS_HD
            shows.forEach(show => {
                showCollection.push(show)
            })
            return showCollection
        });
}
*/

// ----------------------------------------------------------------------------
// 
// Private functions
//

/**
 * Crawling URL from 'tumejortorrent' portal, searching urls whith torrent video files
 * 
 * @param {*} url URL from 'tumejortorrent' domain whith shows
 * @param {*} limit If not null, limit the number of films to parse
 * @param {*} classListName html classname whith url list to process
 * 
 * @returns Promise with showLinksList list with torrent video links
 */

function _crawlLinksFrom(linkChained, limit, classListName) {
    //console.log(`_crawlURLsShows: ${url} - ${limit} - ${classListName}`)
    var linkChainedList = []

    const options = {
        uri: linkChained.current,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return rp(options)
        .then(function ($) {
            $(`.${classListName} li a`).each(function (index, element) {

                linkChainedList[index] = {};
                linkChainedList[index].current = $(element).attr('href')
                linkChainedList[index].from = linkChained.current
                if ((limit != null) && (limit == (index + 1))) {
                    return false; // break each bucle
                }
            });
            return linkChainedList;
        })

        .catch(function (err) {
            console.error(`ERROR! - _crawlLinksFrom: '${err}'`)
        });
}


/**
 * Crawl the firts ShowLinks array, for urls with the tvshow collection
 * 
 * @param {*} urlsWithTVShowsCollection URL array with tvshow collection
 * 
 * e.g: urlsWithTVShowsCollection:
 * ["http://tumejortorrent.com/series-hd/barry/3774",
 * "http://tumejortorrent.com/series-hd/shadowhunters/2384",
 * "http://tumejortorrent.com/series-hd/the-good-doctor/3490"]
 * 
 * @return Promise with array with the latest url with show published for the tvshowcollection
 * 
 *  e.g:  
    [{
        "urlCollection": "http://tumejortorrent.com/series-hd/macgyver--2016-/2812",
        "urlDataShow": ["http://tumejortorrent.com/descargar/serie-en-hd/macgyver--2016-/temporada-2/capitulo-17/"]
        },
        {
        "urlCollection": "http://tumejortorrent.com/series-hd/anatomia-de-grey/2259",
        "urlDataShow": ["http://tumejortorrent.com/descargar/serie-en-hd/anatomia-de-grey/temporada-14/capitulo-16/"]
        }
    ]
 */
function _crawlFirstLinkToURLWithShowFrom(linkChainedToCollectionList) {
    //console.log(`_crawlFirstShowLinksFor - linkChainedToCollectionList: ${JSON.stringify(linkChainedToCollectionList)}`)

    var actions = linkChainedToCollectionList.map(linkChained => {
        return _crawlLinksFrom(linkChained, 1, 'buscar-list')
    });

    return Promise.all(actions)
        .then(linkChainedWithLatestEpisodeList => {
            var index;
            for (index = 0; index < linkChainedToCollectionList.length; index++) {
                linkChainedToCollectionList[index].from = linkChainedToCollectionList[index].current
                linkChainedToCollectionList[index].current = linkChainedWithLatestEpisodeList[index][0].current
            }
            return linkChainedToCollectionList
        });
}

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
 * Parse session 
 * 
 * @param {*} str the full title of the tvshow
 *   e.g "Modern Family  /  Modern Family - Temporada 8 [HDTV 720p][Cap.809][AC3 5.1 Español Castellano]"
 *       "Mom  /  Mom - Temporada 4 [HDTV][Cap.418][AC3 5.1 Español Castellano]"
 * @param {*} session  the session string. 
 *        e.g "4"
 */
function _parseSession(str) {
    //console.log("Sesion: " + str);
    const regex = /Temporada\s(\d+)\s/g;
    let m, session;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        session = m[1];
    }
    return session;
}

/**
 * Parse episode
 * 
 * @param {*} title the title of the tvshow
 *   e.g "Modern Family  /  Modern Family - Temporada 8 [HDTV 720p][Cap.809][AC3 5.1 Español Castellano]"
 *       "Mom  /  Mom - Temporada 4 [HDTV][Cap.418][AC3 5.1 Español Castellano]"
 * @param {*} session  the session string. 
 *        e.g "4"
 */
function _parseEpisode(str, session) {
    //console.log("Episodio: " + str + " and '" + session + "'");
    let m, episode;
    var matches = str.match("Cap\." + session + "(\\d+)");
    if (matches) {

        episode = matches[1];
    }
    return episode;
}