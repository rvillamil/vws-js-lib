//
// Search shows in site
//

//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const LinkChained = require('../../../model/linkChained')
const torrentLinksCrawler = require('../crawler/torrentLinksCrawler')


//
// Constants
//
const Constants = require('../constants')


exports.search = function (text, limit, onShowFound) {
    console.log('showSearch->search()')
    const searchURL = encodeURI(`https://dontorrent.org/buscar/${text}`)

    /*
    return torrentLinksCrawler.crawlLinksFrom(searchURL, limit, "ll")-- > 
        .then(torrentLinks => {
        console.log(`torrentLinks: ${JSON.stringify(torrentLinks)}`)

    })
    */
}