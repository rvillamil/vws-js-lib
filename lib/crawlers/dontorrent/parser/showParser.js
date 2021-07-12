//
// Film and TVShows functions/utilities for parsing
//

//
// NPM modules
//
const ShowCollection = require('../../../model/showCollection')
const Show = require('../../../model/show')
const cheerio = require('cheerio')

exports.parseTitle = function ($) {
  var data = $('.position-relative.ml-2.descargarTitulo').text().trim()

  if (data.includes('por Torrent')) { // Es una serie
    data = data.replace('por Torrent', '').trim()
  }   

  if (data.includes('Descargar')) { // Es una serie
    data = data.replace('Descargar', '').trim()
  }

  if (data.includes('Temporada')) { // Es una serie
    const tvShowDataSplitted = data.split('-')
    data = tvShowDataSplitted[0].trim()
  }

  if (data.includes('(')) {
    const tvShowDataSplitted = data.split('(')
    data = tvShowDataSplitted[0].trim()
  }
  if (data.includes('[')) {
    const tvShowDataSplitted = data.split('[')
    data = tvShowDataSplitted[0].trim()
  }    
    
  //console.log(`Title: '${data}'`)
  return data.trim()
}

exports.parseSinopsis = function ($) {
  var data = ''
  if ($('.text-justify').text()) {
    data = $('.text-justify').text().replace('Descripción: ', '')
  }
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
      if ($(item).text()) {
        data = $(item).text().replace('Tamaño: ', '').trim()
      }
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

exports.parseYearByRelaseDate = function (releaseDate) {
  var data = releaseDate.split('-')[0]
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

exports.parseUrlWithShowCollectionName = function (strURLWithCollection) {
  // Collection Name
  var collectionName = ''
  var urlSplittedStr = strURLWithCollection.split('/')
  //console.log(`parseUrlWithShowCollectionName: ${urlSplittedStr}`)

  if (urlSplittedStr.length > 1) {
    collectionName = `${urlSplittedStr[urlSplittedStr.length - 3]}/${urlSplittedStr[urlSplittedStr.length - 2]}/${urlSplittedStr[urlSplittedStr.length - 1]}`
  }
  return collectionName
}

exports.parseTableWithTVShows = function ($) {
  var showCollection = new ShowCollection()

  var tableElements = $('table.table-sm.table-striped.text-center tbody tr td')
  //console.log(`TableElements.length: ${tableElements.length}`)

  var row = 0
  for (let i = 0; i < tableElements.length; i++) {
    //console.log(`Item ${i}: ${$(tableElements[i])}\n`)
    if (row == 0) {
      var show = new Show()
      var sessionEpisode = $(tableElements[i]).text().split('x') // Retorna la cadena: '4,05 -'
      //console.log(`sessionEpisode: ${sessionEpisode}`)
      show.currentSession = sessionEpisode[0]
      if (sessionEpisode[1]) {
        show.currentEpisode = sessionEpisode[1].replace('-', '').trim()
      }
    } else if (row == 1) { // url de descarga
      var $2 = cheerio.load($(tableElements[i]).html())
      show.urltodownload = 'https:' + $2('a').attr('href')
    } else if (row == 2) { // Release date
      show.releaseDate = $(tableElements[i]).text()
    } else if (row == 3) {
      showCollection.push(show)
      row = -1
    }
    row++
  }
  //console.log(`Showcollection - ${showCollection.toStringSimple()} `)
  return showCollection
}