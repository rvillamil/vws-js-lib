const ShowCollection = require('../../model/showCollection')
const Show = require('../../model/show')
//const cheerio = require('cheerio')

exports.parseTitle = function (str) {
    // eslint-disable-next-line no-useless-escape
    const regex = /\"name\": \"([^(\[]+)/gm

    //console.log("Todo--->" + str + "<-----")

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

exports.parseDescription = function ($) {
    var data = ''
    data = $('.descripcion_top').text()
    return data
}

exports.parseQuality = function ($) {
    var data = ''
    //  Quality : Primera cadena entre [ ]
    var matches = $('.page-box h1')
        .text()
        .match(/\[(.*?)\]/)
    if (matches) {
        data = matches[1]
    }
    return data
}

exports.parseFileSize = function ($) {
    var data = ''
    // ReleaseDate and filesize
    $('.entry-left .imp').each(function (index, element) {
        if (index == 0) {
            data = $(element)
                .text()
                .split('Size:')[1]
            if (data != null) {
                data = data.trim()
            }
        }
    })

    return data
}
exports.parseReleaseDate = function ($) {
    var data = ''
    // ReleaseDate and filesize
    $('.entry-left .imp').each(function (index, element) {
        if (index == 1) {
            data = $(element)
                .text()
                .split('Fecha:')[1]
            if (data != null) {
                data = data.trim()
            }
        }
    })

    return data
}

exports.parseURLWithCover = function (str) {
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

exports.parseYearByShowDescription = function (str) {
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

exports.parseYearByReleaseDate = function (releaseDate) {
    var data = ''
    var chunks = releaseDate.split('-')
    if (chunks != null) {
        data = chunks[2]
    }
    return data
}

exports.parseOriginalTitle = function (str) {
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

exports.parseSinopsis = function (str) {
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

exports.parseURLToDownload = function (htmlFragment) {
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
 */
exports.parseSession = function (str) {
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
 */

exports.parseEpisode = function (str, session) {
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

exports.parseUrlWithShowCollectionName = function (strURLWithCollection) {
    // Collection Name
    var collectionName = ''
    var urlSplittedStr = strURLWithCollection.split('/')
    //console.log(`parseUrlWithShowCollectionName: ${urlSplittedStr}`)

    if (urlSplittedStr.length > 1) {
        collectionName = `${urlSplittedStr[urlSplittedStr.length - 2]}/${urlSplittedStr[urlSplittedStr.length - 1]}`
    }
    return collectionName
}