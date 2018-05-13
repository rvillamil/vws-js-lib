const omdb = require('../lib/omdb');
const tmdb = require('../lib/tmdb');
const crawler = require('../lib/crawler');
const Show = require('../lib/show');

var title = "Winchester la casa que construyeron los espiritus"
show = new Show()
show.title = title

crawler.searchShowInXMDB(show)
    .then(show => {
        console.log(`------------------------------------`)
        console.log(`Show Crawler: ${JSON.stringify(show)}`)
    })