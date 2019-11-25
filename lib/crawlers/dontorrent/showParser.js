
exports.parseTitle = function ($) {
    const data = $('.position-relative.ml-2.descargarTitulo').text().trim()
    //console.log(`Title: '${data}'`)
    return data
}

exports.parseSinopsis = function ($) {
    const data = $('.text-justify').text().replace('Descripción: ', '')
    //console.log(`Sinopsis: '${data}'`)
    return data
}

exports.parseDescription = function ($) {
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

exports.parseQuality = function ($) {
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

exports.parseFileSize = function ($) {
    var data = ''
    $('.mb-0').each(function (i, item) {
        if (i == 1) {
            data = $(item).text().replace('Tamaño: ', '').trim()
        }
    })
    //console.log(`FileSize: '${data}'`)
    return data
}

exports.parseURLWithCover = function ($) {
    const data = encodeURI(`https:${$('.img-thumbnail.float-left').attr('src')}`)
    //console.log(`URLWithCover: '${data}'`)
    return data
}

exports.parseYear = function ($) {
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

exports.parseURLToDownload = function ($) {
    const data = encodeURI(`https:${$('.text-white.bg-primary.rounded-pill.d-block.shadow.text-decoration-none.p-1').attr('href')}`)
    //console.log(`urlToDownload: '${data}'`)
    return data
}

exports.parseReleaseDate = function ($) {
    const data = ''
    //console.log(`ReleaseDate: '${data}'`)
    return data
}

exports.parseOriginalTitle = function ($) {
    const data = ''
    //console.log(`Original Title: '${data}'`)
    return data
}
