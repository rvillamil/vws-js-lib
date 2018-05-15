const omdb = require('../lib/omdb');
const tmdb = require('../lib/tmdb');
const crawler = require('../lib/crawler');
const Show = require('../lib/show');

var title = "Peelers"
show = new Show()
show.title = title

return crawler.searchShowInXMDB(show)
    .then(show => {
        console.log(`------------------------------------`)
        console.log(`Show Crawler: ${JSON.stringify(show)}`)
    })