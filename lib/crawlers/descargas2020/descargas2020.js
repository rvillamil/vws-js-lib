/* eslint-disable no-console */
//
// NPM modules
//
const rp = require('request-promise')
const cheerio = require('cheerio')
const LinkChained = require('../../model/linkChained')
const ShowCollection = require('../../model/showCollection')

//
// Constants
//
const Constants = require('./constants')

//
// Export my NPM functions
//

/**
 * Crawl URLs from 'https://descargas2020.org/peliculas-x264-mkv/' link, with torrent video premieres
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith 'LinkChained' array, where 'current' is the show data link and 'from' is the url from
 * e.g.

[{
    "current": "https://descargas2020.orgescargar/peliculas-x264-mkv/no-soy-un-hombre-facil-/bluray-microhd/",
    "from": "https://descargas2020.orgeliculas-x264-mkv/"
    }, {
    "current": "https://descargas2020.orgescargar/peliculas-x264-mkv/come-sunday-/bluray-microhd/",
    "from": "https://descargas2020.orgeliculas-x264-mkv/"
    }
]
*/
exports.crawlLinkToURLsWithVideoPremieres = function (limit) {
    console.log(`${Constants.DOMAIN}: crawlLinkToURLsWithVideoPremieres data from URL '${Constants.URL_BASE_VIDEOPREMIERES_HD}'`)
    return _crawlLinksFrom(
        new LinkChained(Constants.URL_BASE_VIDEOPREMIERES_HD),
        limit,
        '.pelilist li a'
    )
}

/**
 * Crawl URLs from 'https://descargas2020.org/estrenos-de-cine/' link, with torrent billboard films
 *
 * @param {*} limit video film list limit to return
 * @returns Promise whith 'LinkChained' array, where 'current' is the show data link and 'from' is the url from
 * e.g.
[{
    "current": "https://descargas2020.orgescargar/peliculas-castellano/estrenos-de-cine/cincuenta-sombras-liberadas-/bluray-screeener/",
    "from": "https://descargas2020.orgstrenos-de-cine/"
    }, {
    "current": "https://descargas2020.orgescargar/peliculas-castellano/estrenos-de-cine/todo-el-dinero-del-mundo-/bluray-screeener/"
    "from": "https://descargas2020.orgstrenos-de-cine/"
    }
]
*/
exports.crawlLinkToURLsWithBillboardFilms = function (limit) {
    console.log(`${Constants.DOMAIN}: crawlLinkToURLsWithBillboardFilms data from URL '${Constants.URL_BASE_BILLBOARDFILMS}'`)
    return _crawlLinksFrom(
        new LinkChained(Constants.URL_BASE_BILLBOARDFILMS),
        limit,
        '.pelilist li a'
    )
}

/**
 * Crawl URLs from 'https://descargas2020.org/series-hd/' link, with latest tvshows published
 *
 * @param {*} limit film list limit to return
 * @returns Promise whith 'LinkChained' array , where 'current' is the tvshow data link and 'from' is the collection link
 * e.g.
[{
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-04/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
    }, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/arrow/temporada-6/capitulo-17/",
    "from": "https://descargas2020.orgeries-hd/arrow/1596"
    }
*/
exports.crawlLinkToURLsWithLatestTVShows = function (limit) {
    console.log(`${Constants.DOMAIN}: crawlLinkToURLsWithLatestTVShows data from URL '${Constants.URL_BASE_TVSHOWS_HD}'`)

    return _crawlLinksFrom(
        new LinkChained(Constants.URL_BASE_TVSHOWS_HD),
        limit,
        '.pelilist li a'
    )
        .then(linkChainedToCollectionList => {
            return _crawlFirstLinkToURLWithShowFrom(linkChainedToCollectionList)
        })

        .catch(function (err) {
            console.error(`ERROR! - crawlLinkToURLsWithLatestTVShows: '${err}'`)
        })
}

/**
 * Crawl URLs with the collection episodes from  https://descargas2020.org/series-hd/${collectionName} link
 *
 * @param {*} collectionName path in the url https://descargas2020.org/series-hd/${collectionName}, where de tvshow is located
 *      e.g: /siren/3797
 *
 * @param {*} limit episodes list limit to return
 * @returns Promise with linkChained list whith episode list
 *
linkChainedToShowDataList: -- > [{
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-05/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-04/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-03/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}, {
    "current": "https://descargas2020.orgescargar/serie-en-hd/siren/temporada-1/capitulo-02/",
    "from": "https://descargas2020.orgeries-hd/siren/3797"
}]
*/
exports.crawlLinkToURLsWithEpisodes = function (limit, collectionName) {
    return _crawlLinksFrom(
        new LinkChained(`${Constants.URL_BASE_TVSHOWS_HD}${collectionName}`),
        limit,
        '.buscar-list .info a'
    )
}


// ----------------------------------------------------------------------------
//
// Private functions
//

/**
 * Crawling links from 'tumejortorrent' portal, searching urls whith torrent video files
 *
 * @param {*} linkChained URL from 'tumejortorrent' domain
 * @param {*} limit If not null, limit the number of links to parse
 * @param {*} htmlSelector html selector in the html document crawled
 *
 * @returns Promise with linkChained array, with the torrent video links
 */
function _crawlLinksFrom(linkChained, limit, htmlSelector) {
    var linkChainedList = []

    const options = {
        uri: linkChained.current,
        transform: function (body) {
            return cheerio.load(body)
        }
    }

    return rp(options)
        .then(function ($) {
            var currentHREF = ''
            var previousHREF = ''
            var counter = 0

            $(`${htmlSelector}`).each(function (index, element) {
                currentHREF = $(element).attr('href')
                //console.log(`- linkCrawled =${currentHREF}`)
                if (currentHREF.trim() != previousHREF.trim()) {
                    counter++

                    previousHREF = currentHREF
                    currentHREF = $(element).attr('href')

                    linkChained = new LinkChained()
                    linkChained.current = currentHREF
                    linkChained.from = linkChained.current
                    linkChainedList.push(linkChained)
                    if (limit != null && limit == counter) {
                        return false // break each bucle
                    }
                }
            })

            return linkChainedList
        })

        .catch(function (err) {
            console.error(`ERROR! - _crawlLinksFrom: '${err}'`)
        })
}

function _crawlFirstLinkToURLWithShowFrom(linkChainedToCollectionList) {
    var actions = linkChainedToCollectionList.map(linkChained => {
        return _crawlLinksFrom(linkChained, 1, '.buscar-list .info a')
    })

    return Promise.all(actions).then(linkChainedWithLatestEpisodeList => {
        var index
        for (index = 0; index < linkChainedToCollectionList.length; index++) {
            linkChainedToCollectionList[index].from =
                linkChainedToCollectionList[index].current
            linkChainedToCollectionList[index].current =
                linkChainedWithLatestEpisodeList[index][0].current
        }
        return linkChainedToCollectionList
    })
}

