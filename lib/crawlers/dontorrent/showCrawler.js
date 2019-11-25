// @ts-nocheck
//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const Show = require('../../model/show')

//
// Constants
//
const Constants = require('./constants')

/**
 * Crawl 'Show' data, from domain 'dontorrent.com', with a torrent video/film/TVShow file
 *
 * @param {*} urlWithShow URL where 'Show' data is located
 *  e.g: The Film, https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada
 *  e.g: The ShowTV, https://dontorrent.org/pelicula/21442/Vengadores-Endgame-Open-Matte-Imax
 *
 * @returns Promise with 'Show' data scraped
 */
exports.crawlDataShow = function (urlWithShow) {

    var strURLWithShow = urlWithShow + ''
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
            console.log(`${Constants.DOMAIN} - crawlDataShow on url '${show.urlBase}'`)

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
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShow: '${err}'`)
            show.error = err
        })
}

// ----------------------------------------------------------------------------
//
// Private functions
//

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
