// @ts-nocheck
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
const DOMAIN = 'dontorrent.org'
const URL_BASE_VIDEOPREMIERES_HD = `https://${DOMAIN}/ultimos`
const URL_BASE_BILLBOARDFILMS = URL_BASE_VIDEOPREMIERES_HD
const URL_BASE_TVSHOWS_HD = URL_BASE_VIDEOPREMIERES_HD

//
// Export my NPM functions
//
/**
 * Crawl URLs from 'https://dontorrent.org/ultimos/' link, with torrent video premieres
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith array of links
*/
exports.crawlLinkToURLsWithVideoPremieres = function (limit) {
    console.log(`${DOMAIN}: crawlLinkToURLsWithVideoPremieres data from URL '${URL_BASE_VIDEOPREMIERES_HD}'`)
    return _crawlLinksFrom(URL_BASE_VIDEOPREMIERES_HD, limit, 'pelicula')
}

/**
 * Crawl URLs from 'https://dontorrent.org/ultimos/' link, with torrent billboard films
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith array of links
*/
exports.crawlLinkToURLsWithBillboardFilms = function (limit) {
    console.log(`${DOMAIN}: crawlLinkToURLsWithBillboardFilms data from URL '${URL_BASE_BILLBOARDFILMS}'`)
    return _crawlLinksFrom(URL_BASE_BILLBOARDFILMS, limit, 'NO_HAY_EN_ESTA_WEB_ESTRENOS_DE_CINE')
}

/**
 * Crawl URLs from 'https://dontorrent.org/ultimos/' link, with torrent series
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith array of links
*/
exports.crawlLinkToURLsWithLatestTVShows = function (limit) {
    // TODO : Implementar
    console.log(`${DOMAIN}: crawlLinkToURLsWithLatestTVShows data from URL '${URL_BASE_TVSHOWS_HD}'`)

    /*
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
        */
}

/**
 * Crawl ...
 */
exports.crawlLinkToURLsWithEpisodes = function (limit, collectionName) {
    // TODO : Implementar
}

/**
 * Crawl 'Show' data, from domain 'dontorrent.com', with a torrent video/film/TVShow file
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The Film, https://blazing.network/imagenes/peliculas/Vengadores%20Endgame.jpg
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
            console.log(`${DOMAIN} - crawlDataShow on url '${show.urlBase}'`)

            //
            // ---- Datos comnunes de la pelicula o serie que solo estan en la web
            //
            //console.log(`ALL: ${($)}`)
            show.title = _parseTitle($)
            show.sinopsis = _parseSinopsis($)
            show.description = _parseDescription($)
            show.quality = _parseQuality($)
            show.fileSize = _parseFileSize($)
            show.urlwithCover = _parseURLWithCover($)
            show.year = _parseYear($)
            show.urltodownload = _parseURLToDownload($)
            show.releaseDate = _parseReleaseDate($)
            show.originalTitle = _parseOriginalTitle($)
            //
            // ---- ONLY TVSHOWS ----
            //
            // Collection Name
            // TODO: show.collectionName = _parseCollectionName($)
            // Session
            // TODO: show.currentSession = _parseSession($)
            // Episode
            // TODO: show.currentEpisode = _parseEpisode($)


            // console.log(`crawlDataShow:  --> ${JSON.stringify(show)}\n\n`);

            show.error = 0
            return show
        })
        .catch(function (err) {
            console.error(`ERROR! - ${DOMAIN} - crawlDataShow: '${err}'`)
            show.error = err
        })
}

/**
 * Crawl 'ShowCollection' data,
 */
exports.crawlDataShowCollection = function (collectionName, linkChainedToEpisodeList) {
    // TODO: Implementar
}

// ----------------------------------------------------------------------------
//
// Private functions
//
/**
* Crawling links from 'dontorrent' portal, searching urls whith torrent video files
*
* @param {*} url URL from 'dontorrent' domain
* @param {*} limit If not null, limit the number of links to parse
* @param {*} htmlSelector html selector in the html document crawled
*
* @returns Promise with array, with the torrent video links
*/
function _crawlLinksFrom(url, limit, filter) {
    var links = []
    const options = {
        uri: url,
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    return rp(options).then(function ($) {
        var counter = 0
        //console.log(`- All---> ${$.html()}`)
        //const texto = $('.text-primary')
        $('.text-primary').each(function () {
            var link = $(this).attr('href')
            // console.log(`_crawlLinksFrom: ${link}`)
            if (link.includes(filter)) {
                links.push(link)
                counter++
                if (limit != null && limit == counter) {
                    return false // break each bucle
                }
            }
        })
        //console.log(`Links: ${links}`)
        return links

    }).catch(function (err) {
        console.error(`ERROR! - _crawlLinksFrom: '${err}'`)
    })
}

function _parseTitle($) {
    const data = $('.position-relative.ml-2.descargarTitulo').text().trim()
    //console.log(`Title: '${data}'`)
    return data
}

function _parseSinopsis($) {
    const data = $('.text-justify').text().replace('Descripción: ', '')
    //console.log(`Sinopsis: '${data}'`)
    return data
}

function _parseDescription($) {
    var data = ''
    $('.mb-0').each(function (i, item) {
        if (i == 0) {
            data = $(item).text()
        }
    })

    $('.m-1').each(function (i, item) {
        if ($(item).text().trim()) {
            data = data + '. ' + $(item).text().trim()
        }
    })

    //console.log(`Description: '${data}'`)
    return data
}

function _parseQuality($) {
    const regex = /Formato:<\/b>(.+)<\/p>/g
    let m, data
    while ((m = regex.exec($.html())) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        data = m[1].trim()
    }
    //console.log(`Quality: '${data}'`)
    return data
}

function _parseFileSize($) {
    var data = ''
    $('.mb-0').each(function (i, item) {
        if (i == 1) {
            data = $(item).text().replace('Tamaño: ', '').trim()
        }
    })
    //console.log(`FileSize: '${data}'`)
    return data
}

function _parseURLWithCover($) {
    const data = encodeURI(`https:${$('.img-thumbnail.float-left').attr('src')}`)
    //console.log(`URLWithCover: '${data}'`)
    return data
}
function _parseYear($) {
    var data = ''
    $('.m-1').each(function (i, item) {
        var substring = $(item).text().trim()
        if (substring.includes('Año: ')) {
            data = substring.replace('Año: ', '').trim()
        }
    })
    //console.log(`Year: '${data}'`)
    return data
}
function _parseURLToDownload($) {
    const data = encodeURI(`https:${$('.text-white.bg-primary.rounded-pill.d-block.shadow.text-decoration-none.p-1').attr('href')}`)
    //console.log(`urlToDownload: '${data}'`)
    return data
}
function _parseReleaseDate($) {
    const data = ''
    //console.log(`ReleaseDate: '${data}'`)
    return data
}

function _parseOriginalTitle($) {
    const data = ''
    //console.log(`Original Title: '${data}'`)
    return data
}
