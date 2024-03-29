/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
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
  const regex = /emporada\s(\d+)\s/g
  let m; let
    session
  while ((m = regex.exec(htmlFragment)) !== null) {
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
 * @param {*} htmlFragment the session of data show
 *
 * "Watchmen - Temporada 1 [HDTV 720p][Cap.106][AC3 5.1 Castellano][www.pctmix.ORG][www.pctnew.ORG]",
 */
exports.parseEpisode = function (htmlFragment, session) {
  let matches = htmlFragment.match('capitulo 0' + '(\\d+)')
  if (matches) {
    return matches[1]
  }

  matches = htmlFragment.match('capitulo' + '(\\d+)')
  if (matches) {
    return matches[1]
  }

  matches = htmlFragment.match(`Cap.${session}(\\d+)`)
  if (matches) {
    return matches[1]
  }

  matches = htmlFragment.match(`Cap.${session}0` + '(\\d+)')
  if (matches) {
    return matches[1]
  }
}

exports.parseCollectionName = function ($) {
  return tvshowCollectionParser.parseUrlWithShowCollectionName($('.page-box h1 a').attr('href'))
}
