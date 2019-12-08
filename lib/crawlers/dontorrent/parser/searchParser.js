//
// Utilities for parsing
//

//
// NPM modules
//
const cheerio = require('cheerio')
const filmCrawler = require('../crawler/filmCrawler')
const tvshowCollectionCrawler = require('../crawler/tvshowCollectionCrawler')

//
// Constants
//
const Constants = require('../constants')

exports.parseTableWithTVShows = function ($, limit) {
    // TODO: Lanzar esto en una promesa .... Quizas lo suto es crear un search a la altura del crawler... y que esto no lance promesas
    var shows = []
    var counter = 0
    var tableElements = $('.card-body p')

    for (let i = 0; i < tableElements.length; i++) {
        var $2 = cheerio.load($(tableElements[i]).html())
        var urlPath = $2('a').attr('href')
        if (urlPath) {
            var typeOfShow = $2('.badge.badge-primary.float-right').text()

            if (typeOfShow == 'Serie') {
                tvshowCollectionCrawler.crawlDataShowCollection(`https://${Constants.DOMAIN}${urlPath}`, 1)
                    .then(show => {
                        //console.log(`SERIE: ${JSON.stringify(show)}`)
                        shows.push(show)
                    })
                counter++
            }
            if (typeOfShow == 'Película') {
                filmCrawler.crawlDataFilm(`https://${Constants.DOMAIN}${urlPath}`)
                    .then(show => {
                        //console.log(`PELICULA: ${JSON.stringify(show)}`)
                        shows.push(show)
                    })
                counter++
            }
        }
        if (counter == limit) {
            i = tableElements.length
        }
    }
    console.log(`shows - ${JSON.stringify(shows)} `)
    return shows
}