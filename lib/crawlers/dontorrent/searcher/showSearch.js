//
// Search shows in site
//

//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const searchParser = require('../parser/searchParser')
const LinkChained = require('../../../model/linkChained')
const torrentLinksCrawler = require('../crawler/torrentLinksCrawler')


//
// Constants
//
const Constants = require('../constants')

exports.search = function (text, limit, onTVshowFound, onFilmFound) {

    const searchURL = encodeURI(`https://dontorrent.org/buscar/${text}`)
    console.log(`${Constants.DOMAIN} - showSearch->search(): ${searchURL}`)

    const options = {
        uri: searchURL,
        transform: function (body) {
            var strBody = body + ''
            return cheerio.load(strBody)
        }
    }

    return rp(options)
        .then(function ($) {
            //console.log(`ALL: ${($)}`)
            const linkChainedList = searchParser.parseTableWithTVShows($)
            for (let i=0;i<linkChainedList.length;i++){
                linkChainedList[i].from
            }
            // ShowCollection Object
            //var showCollection = ShowParser.parseTableWithTVShows($) // Aqui obtenemos la release date, session y episode

            return linkChainedList
        })
        .catch(function (err) {
            console.error(`ERROR! - ${Constants.DOMAIN} - crawlDataShowCollection: '${err}'`)
            showCollection.error = err
        })

    /*
    return torrentLinksCrawler.crawlLinksFrom(searchURL, limit, "ll")-- > 
        .then(torrentLinks => {
        console.log(`torrentLinks: ${JSON.stringify(torrentLinks)}`)

    })
    */
}
