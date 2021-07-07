
//
// Film and TVShows functions/utilities for parsing
//
/**
 * From HTML like :
 *
<script type="application/ld+json">
{
  "@context": "http://schema.org/",
  "@type": "Recipe",
  "name": "Watchmen - Temporada 1 [HDTV 720p][Cap.106][AC3 5.1 Castellano][www.pctmix.ORG][www.pctnew.ORG]",
  "author": "PctNew",
  "image": "//pctmix.org/pictures/c/thumbs/5258_1571665790-Watchmen.jpg",
  "description": "Director: Damon Lindelof (Creator), Steph Green, Nicole Kass",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.00",
    "reviewCount": "100",
    "bestRating": "5",
    "worstRating": "1"
  }

  then, get the string: "Watchmen - Temporada 1 [HDTV 720p][Cap.106][AC3 5.1 Castellano][www.pctmix.ORG][www.pctnew.ORG]"
}
 */
exports.parseFullName = function (htmlFragment) {
    // eslint-disable-next-line no-useless-escape
    const regex = /\"name\": \"([^,]+)\"/gm

    //console.log("Todo--->" + str + "<-----")

    let m, titleCrawled
    while ((m = regex.exec(htmlFragment)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        titleCrawled = m[1].trim()
    }
    // Para el caso de las series ..

    return titleCrawled
}

exports.parseTitle = function ($) {
    // eslint-disable-next-line no-useless-escape

    let titleCrawled = $('.breadcrumbs').text().trim().split('\n')[2]
    
    // Eliminamos todo el texto entre corchetes
    titleCrawled = titleCrawled.replace(/ *\[[^\]]*]/g, '')
    // Eliminamos todo el texto entre parentesis
    titleCrawled = titleCrawled.replace(/ *\([^)]*\) */g, '')
    // Capitalizamos
    titleCrawled = titleCrawled.charAt(0).toUpperCase() + titleCrawled.slice(1).toLowerCase()
    //const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1)

    return titleCrawled
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
            data = $(element).text()
            if (data != null) {
                data = data.split('Size:')[1].trim()
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
            data = $(element).text()
            if (data != null) {
                data = data.split('Fecha:')[1].trim()
            }
        }
    })

    return data
}

exports.parseURLWithCover = function ($) {
    // eslint-disable-next-line no-useless-escape
    var urlWithCover=$('.fichas-box').find('img').attr('src')
    
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

exports.parseYearByTitle = function ($) {
    // eslint-disable-next-line no-useless-escape
    var year = null
    let titleCrawled = $('.breadcrumbs').text().trim().split('\n')[2]    
    let arrayMatched = `${titleCrawled}`.match(/\(([^)]+)\)/)    
    if (arrayMatched) {
        year = arrayMatched[1]
    }
    return year
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

exports.parseURLToDownload = function ($) {
    const regex = /(pctmix1.com\/download\/)(.*)";/gm    
    var str = $.root().html()
    let m, urltodownload
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        // m[2] = 153751_-1625640900-Black-Lightning--Proper----Temporada-4--HDTV-720p-AC3-5-1.torrent
        urltodownload = m[2]        
    }

    return "https://pctmix1.com/download/" + urltodownload
}

exports.parseURLToDownloadByURLWithCover = function (urlWithCover) {

    // urlWithCover: https://pctmix1.com/pictures/f/mediums/153738_-1625634500-Superdetective-en-Hollywood-2--1987---BluRay-MicroHD.jpg
    // output: https://pctmix1.com/descargar-torrent/153738_-1625634500-Superdetective-en-Hollywood-2--1987---BluRay-MicroHD
    var lastSegment=(urlWithCover.substring(urlWithCover.lastIndexOf('/') + 1)).split('.jpg')[0]

    return "https://pctmix1.com/descargar-torrent/" + lastSegment
}   