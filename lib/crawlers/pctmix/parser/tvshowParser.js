//
// TVShow functions/utilities for parsing
//

//
// NPM modules
//
const tvshowCollectionParser = require('./tvshowCollectionParser')

/**
 * Parse session
 *
 * @param {*} htmlFragment the full name of data show
 * 
 * e.g.
 * <script type="application/ld+json">
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
exports.parseSession = function (htmlFragment) {

    //console.log(`${htmlFragment}`)
    var strFromHtmlFragment = htmlFragment + ''
    const regex = /temporada\s(\d+)\s/g
    let m, session
    while ((m = regex.exec(strFromHtmlFragment)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        session = m[1]
    }
    return session
}

/**
 * Parse episode
 *
 * @param {*} htmlFragment the full name of data show
 *
 * e.g.
 * <script type="application/ld+json">
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
exports.parseEpisode = function (htmlFragment, session) {
    let episode
    var matches = htmlFragment.match('capitulo 0' + '(\\d+)')
    if (matches) {
        episode = matches[1]
    } else {
        matches = htmlFragment.match('capitulo' + '(\\d+)')
        episode = matches[1]
    }
    return episode
}

exports.parseCollectionName = function ($) {
    return tvshowCollectionParser.parseUrlWithShowCollectionName($('.page-box h1 a').attr('href'))
}


