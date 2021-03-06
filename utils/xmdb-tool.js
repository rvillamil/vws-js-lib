/* eslint-disable no-console */
const crawler = require('../lib/crawler')
const Show = require('../lib/model/show')

function processParamTitle() {
    if (process.argv.length > 3) {
        console.log('ERROR! Argument list error')
        help()
        process.exit(1)
    }
    var titleToSearch = process.argv[2]
    if (!titleToSearch) {
        console.log('ERROR! Need the title to search')
        help()
        process.exit(1)
    }

    return titleToSearch
}

function help() {
    console.log('Search a film in TMDB and OMDB databases')
    console.log(`   Usage: ${process.argv[1]} 'film title'`)
}

function searchFilmByTitle(title) {
    var show = new Show()
    show.title = title

    return crawler.searchShowInXMDB(show, 'movie', true)
        .then(show => {
            console.log('------------------------------------')
            console.log(`Show: ${JSON.stringify(show)}`)
        })
}

searchFilmByTitle(processParamTitle())