/* eslint-disable no-console */
//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../model/show')
const LinkChained = require('../model/linkChained')
const ShowCollection = require('../model/showCollection')

//
// Constants
//
const URL_BASE_VIDEOPREMIERES_HD =
    'https://descargas2020.org/peliculas-x264-mkv/'
const URL_BASE_BILLBOARDFILMS = 'https://descargas2020.org/estrenos-de-cine/'
const URL_BASE_TVSHOWS_HD = 'https://descargas2020.org/series-hd/'

//
// Export my NPM functions
//

/**
 * Crawl URLs from 'https://descargas2020.org/peliculas-x264-mkv/' link, with torrent video premieres
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith 'LinkChained' array, where 'current' is the show data link and 'from' is the url from
 * e.g.

[{
    "current": "https://descargas2020.orgescargar/peliculas-x264-mkv/no-soy-un-hombre-facil-/bluray-microhd/",
    "from": "https://descargas2020.orgeliculas-x264-mkv/"
    }, {
    "current": "https://descargas2020.orgescargar/peliculas-x264-mkv/come-sunday-/bluray-microhd/",
    "from": "https://descargas2020.orgeliculas-x264-mkv/"
    }
]
*/
exports.crawlLinkToURLsWithVideoPremieres = function (limit) {
    //console.error(`Crawling data from URL '${URL_BASE_VIDEOPREMIERES_HD}'`);
    return _crawlLinksFrom(
        new LinkChained(URL_BASE_VIDEOPREMIERES_HD),
        limit,
        '.pelilist li a'
    )
}

/**
 * Crawl URLs from 'https://descargas2020.org/estrenos-de-cine/' link, with torrent billboard films
 *
 * @param {*} limit video film list limit to return
 * @returns Promise whith 'LinkChained' array, where 'current' is the show data link and 'from' is the url from
 * e.g.
[{
    "current": "https://descargas2020.orgescargar/peliculas-castellano/estrenos-de-cine/cincuenta-sombras-liberadas-/bluray-screeener/",
    "from": "https://descargas2020.orgstrenos-de-cine/"
    }, {
    "current": "https://descargas2020.orgescargar/peliculas-castellano/estrenos-de-cine/todo-el-dinero-del-mundo-/bluray-screeener/"
    "from": "https://descargas2020.orgstrenos-de-cine/"
    }
]
*/
exports.crawlLinkToURLsWithBillboardFilms = function (limit) {
    //console.error(`Crawling data from URL '${URL_BASE_BILLBOARDFILMS}'`);
    return _crawlLinksFrom(
        new LinkChained(URL_BASE_BILLBOARDFILMS),
        limit,
        '.pelilist li a'
    )
}

/**
 * Crawl URLs from 'https://descargas2020.org/series-hd/' link, with latest tvshows published
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith 'LinkChained' array , where 'current' is the tvshow data link and 'from' is the collection link
 * e.g.
[{
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-04/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
    }, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/arrow/temporada-6/capitulo-17/",
    "from": "https://descargas2020.orgeries-hd/arrow/1596"
    }
*/
exports.crawlLinkToURLsWithLatestTVShows = function (limit) {
    return _crawlLinksFrom(
        new LinkChained(URL_BASE_TVSHOWS_HD),
        limit,
        '.pelilist li a'
    )
        .then(linkChainedToCollectionList => {
            return _crawlFirstLinkToURLWithShowFrom(linkChainedToCollectionList)
        })

        .catch(function (err) {
            console.error(`ERROR! - crawlLinkToURLsWithLatestTVShows: '${err}'`)
        })
}

/**
 * Crawl URLs with the collection episodes from  https://descargas2020.org/series-hd/${collectionName} link
 *
 * @param {*} collectionName path in the url https://descargas2020.org/series-hd/${collectionName}, where de tvshow is located
 *      e.g: /siren/3797
 *
 * @param {*} limit episodes list limit to return
 * @returns Promise with linkChained list whith episode list
 *
linkChainedToShowDataList: -- > [{
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-05/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-04/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-03/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-02/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}]
*/
exports.crawlLinkToURLsWithEpisodes = function (limit, collectionName) {
    return _crawlLinksFrom(
        new LinkChained(`${URL_BASE_TVSHOWS_HD}${collectionName}`),
        limit,
        '.buscar-list .info a'
    )
}

/**
 * Crawl 'Show' data, from domain 'tumejortorrent.com', with a torrent video/film/TVShow file
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The Film, https://descargas2020.org/descargar/peliculas-x264-mkv/coco-/bluray-microhd/
 *  e.g: The TVShow episode, https://descargas2020.org/descargar/serie-en-hd/erase-una-vez/temporada-7/capitulo-14/
 * @param {*} urlWithCollecion URL where a 'Showcollection' is located. Optional
 *
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataShow = function (urlWithShow, urlWithCollection) {
    var strURLWithShow = urlWithShow + ''
    var strURLWithCollection = urlWithCollection + ''
    var show = new Show()
    const options = {
        uri: strURLWithShow,
        transform: function (body) {
            var strBody = body + ''
            return cheerio.load(strBody)
        }
    }

    return rp(options)
        .then(function ($) {
            // URL base
            show.urlBase = strURLWithShow
            //console.log(`URL base to crawl =${strURLWithShow}`);

            // Collection Name
            var urlSplittedStr = strURLWithCollection.split('/')
            if (urlSplittedStr.length > 1) {
                show.collectionName = `${urlSplittedStr[urlSplittedStr.length - 2]}/${
                    urlSplittedStr[urlSplittedStr.length - 1]}`
            }
            // Title
            show.title = _parseTitle($.html())
            //console.log(`show.title ="${show.title}"`);

            // Session
            const fullTitle = $('.page-box h1')
                .text()
                .trim()
            show.currentSession = _parseSession(fullTitle)
            // Episode
            if (show.currentSession) {
                show.currentEpisode = _parseEpisode(fullTitle, show.currentSession)
            }
            // Description
            show.description = $('.descripcion_top').text()
            // Original Title
            show.originalTitle = _parseOriginalTitle(show.description)
            // Sinopsis
            show.sinopsis = _parseSinopsis(show.description)
            // Description
            if (show.sinopsis) {
                // Si la sinopsis esta dentro de la descripcion..
                show.description = $('.descripcion_top')
                    .text()
                    .split('Sinopsis')[0] // Quitamos la sinopsis a la descripcion
            } else {
                show.sinopsis = $('.sinopsis').text() // Establecemos el valor de sinopsis que nos venga...
            }
            //  Quality : Primera cadena entre [ ]
            var matches = $('.page-box h1')
                .text()
                .match(/\[(.*?)\]/)
            if (matches) {
                show.quality = matches[1]
            }
            // URLWithCover
            //show.urlwithCover = $('.entry-left img').attr("src")
            show.urlwithCover = _parseURLWithCover($.html())

            // ReleaseDate and filesize
            $('.entry-left .imp').each(function (index, element) {
                if (index == 0) {
                    show.fileSize = $(element)
                        .text()
                        .split('Size:')[1]
                    if (show.fileSize != null) {
                        show.fileSize = show.fileSize.trim()
                    }
                }
                if (index == 1) {
                    show.releaseDate = $(element)
                        .text()
                        .split('Fecha:')[1]
                    if (show.releaseDate != null) {
                        show.releaseDate = show.releaseDate.trim()
                    }
                }
            })
            // Year
            show.year = _parseYear(show.description)
            if (!show.year) {
                if (show.releaseDate) {
                    var chunks = show.releaseDate.split('-')
                    if (chunks != null) {
                        show.year = chunks[2]
                    }
                }
            }

            // URLToDownload
            show.urltodownload = _parseURLToDownload($.html())
            // console.log(`URL to show.urltodownload =${show.urltodownload}`)
            // console.log(`SHOW - crawlDataShow:  --> ${JSON.stringify(show)}\n\n`);

            show.error = 0
            return show
        })
        .catch(function (err) {
            console.error(`ERROR! - crawlDataShow: '${err}'`)
            show.error = err
        })
}

/**
 * Crawl 'ShowCollection' data, from url https://descargas2020.org/series-hd/${collectionName} link, with a torrent video/film/TVShow file
 *
 * @param {*} collectionName path in the url https://descargas2020.org/series-hd/${collectionName}, where de tvshow is located
 *      e.g: /siren/3797
 * @param {*} linkChainedToEpisodeList LinkChained list, with links to TVShow episodes in the collection for crawl
 * @returns Promise with 'ShowCollection' data scraped
 */
exports.crawlDataShowCollection = function (
    collectionName,
    linkChainedToEpisodeList
) {
    var actions = linkChainedToEpisodeList.map(linkChained => {
        return this.crawlDataShow(linkChained.current, linkChained.from)
    })
    return Promise.all(actions).then(shows => {
        var showCollection = new ShowCollection()
        showCollection.url = URL_BASE_TVSHOWS_HD + collectionName
        shows.forEach(show => {
            showCollection.name = collectionName
            show.collectionName = collectionName
            showCollection.shows.push(show)
        })
        return showCollection
    })
}

// ----------------------------------------------------------------------------
//
// Private functions
//

/**
 * Crawling links from 'tumejortorrent' portal, searching urls whith torrent video files
 *
 * @param {*} linkChained URL from 'tumejortorrent' domain
 * @param {*} limit If not null, limit the number of links to parse
 * @param {*} htmlSelector html selector in the html document crawled
 *
 * @returns Promise with linkChained array, with the torrent video links
 */
function _crawlLinksFrom(linkChained, limit, htmlSelector) {
    var linkChainedList = []

    const options = {
        uri: linkChained.current,
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    return rp(options)
        .then(function ($) {
            var currentHREF = ''
            var previousHREF = ''
            var counter = 0

            $(`${htmlSelector}`).each(function (index, element) {
                currentHREF = $(element).attr('href')
                //console.log(`- linkCrawled =${currentHREF}`)
                if (currentHREF.trim() != previousHREF.trim()) {
                    counter++

                    previousHREF = currentHREF
                    currentHREF = $(element).attr('href')

                    linkChained = new LinkChained()
                    linkChained.current = currentHREF
                    linkChained.from = linkChained.current
                    linkChainedList.push(linkChained)
                    if (limit != null && limit == counter) {
                        return false // break each bucle
                    }
                }
            })

            return linkChainedList
        })

        .catch(function (err) {
            console.error(`ERROR! - _crawlLinksFrom: '${err}'`)
        })
}

function _crawlFirstLinkToURLWithShowFrom(linkChainedToCollectionList) {
    var actions = linkChainedToCollectionList.map(linkChained => {
        return _crawlLinksFrom(linkChained, 1, '.buscar-list .info a')
    })

    return Promise.all(actions).then(linkChainedWithLatestEpisodeList => {
        var index
        for (index = 0; index < linkChainedToCollectionList.length; index++) {
            linkChainedToCollectionList[index].from =
                linkChainedToCollectionList[index].current
            linkChainedToCollectionList[index].current =
                linkChainedWithLatestEpisodeList[index][0].current
        }
        return linkChainedToCollectionList
    })
}

function _parseTitle(str) {
    // eslint-disable-next-line no-useless-escape
    const regex = /\"name\": \"(.+) \[/gm
    let m, titleCrawled
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        titleCrawled = m[1].trim()
    }
    // Para el caso de las series ..
    titleCrawled = titleCrawled.split('-')[0]
    //console.log("Parsear titulo orginal sobre la cadena: " + titleCrawled)

    return titleCrawled.trim()
}

function _parseURLWithCover(str) {
    // eslint-disable-next-line no-useless-escape
    const regex = /\"image\": \"(.+)(",)/gm
    let m, urlWithCover
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        urlWithCover = m[1].trim()
    }
    //console.log("Parsear url con la portada:" + urlWithCover)

    return 'https:' + urlWithCover
}

function _parseYear(str) {
    const regex = /((AÃ±o:)|(AÃ±o))\s+(\d\d\d\d)/g
    let m, originalTitle
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        originalTitle = m[4].trim()
    }
    return originalTitle
}

function _parseOriginalTitle(str) {
    // console.log("Parsear titulo orginal sobre la cadena: " + str)

    const regex = /((tulo original)|(tulo original:))\s+(.*)(AÃ±o\s+\d+\s+)/g
    let m, originalTitle
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        originalTitle = m[4].trim()
    }
    //console.log("TITULO ORIGINAL: " + originalTitle)
    return originalTitle
}

function _parseSinopsis(str) {
    const regex = /Sinopsis\s+(.*)/g
    let m, sinopsis
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        sinopsis = m[1]
    }
    return sinopsis
}

function _parseURLToDownload(htmlFragment) {
    const regex = /(\/\/descargas2020.org\/descargar-torrent\/)(.*)\//gm
    // console.log(`URL base to matches =${matches[1]}`)
    let m, urltodownload
    while ((m = regex.exec(htmlFragment)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        urltodownload = 'https:' + m[1] + m[2]
    }
    return urltodownload
}

/**
 * Parse session
 *
 * @param {*} str the full title of the tvshow
 *   e.g "Modern Family  /  Modern Family - Temporada 8 [HDTV 720p][Cap.809][AC3 5.1 Español Castellano]"
 *       "Mom/Mom - Temporada 4 [HDTV][Cap.418][AC3 5.1 Español Castellano]"
 * @param {*} session  the session string.
 *        e.g "4"
 */
function _parseSession(str) {
    // eslint-disable-next-line no-irregular-whitespace
    const regex = /Temporada\s(\d+)\s/g
    let m, session
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        session = m[1]
    }
    return session
}

/**
 * Parse episode
 *
 * @param {*} title the title of the tvshow
 *   e.g "Modern Family  /  Modern Family - Temporada 8 [HDTV 720p][Cap.809][AC3 5.1 Español Castellano]"
 *       "Mom/Mom - Temporada 4 [HDTV][Cap.418][AC3 5.1 Español Castellano]"
 * @param {*} session  the session string.
 *        e.g "4"
 */
function _parseEpisode(str, session) {
    let episode
    var matches = str.match('Cap.' + session + '(\\d+)')
    if (matches) {
        episode = matches[1]
    } else {
        matches = str.match('Cap.' + '(\\d+)')
        episode = matches[1]
    }
    return episode
}