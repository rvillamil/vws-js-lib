/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const tvshowParser = require('../../../../lib/crawlers/pctmix/parser/tvshowParser')

describe('crawlers/pctmix/parser/tvshowParser', () => {
  describe('#parseSession()', () => {
    it('should return sesion 8', () => {
      const htmlFragment = '<script type="application/ld+json">'
                + '{'
                + '  "@context": "http://schema.org/",'
                + '  "@type": "Recipe",'
                + '  "name": "Watchmen - Temporada 1 [HDTV 720p][Cap.106][AC3 5.1 Castellano][www.pctmix.ORG][www.pctnew.ORG]",'
                + '  "author": "PctNew",'
                + '  "image": "//pctmix.org/pictures/c/thumbs/5258_1571665790-Watchmen.jpg",'
                + '  "description": "Director: Damon Lindelof (Creator), Steph Green, Nicole Kass",'
                + '  "aggregateRating": {'
                + '    "@type": "AggregateRating",'
                + '    "ratingValue": "5.00",'
                + '    "reviewCount": "100",'
                + '    "bestRating": "5",'
                + '    "worstRating": "1"'
                + '  }'

      assert.ok(tvshowParser)
      assert.equal(tvshowParser.parseSession(htmlFragment), '1')
    })
  })

  describe('#parseEpisode()', () => {
    it('should return episode 6', () => {
      const htmlFragment = '<script type="application/ld+json">'
                + '{'
                + '  "@context": "http://schema.org/",'
                + '  "@type": "Recipe",'
                + '  "name": "Watchmen - Temporada 1 [HDTV 720p][Cap.106][AC3 5.1 Castellano][www.pctmix.ORG][www.pctnew.ORG]",'
                + '  "author": "PctNew",'
                + '  "image": "//pctmix.org/pictures/c/thumbs/5258_1571665790-Watchmen.jpg",'
                + '  "description": "Director: Damon Lindelof (Creator), Steph Green, Nicole Kass",'
                + '  "aggregateRating": {'
                + '    "@type": "AggregateRating",'
                + '    "ratingValue": "5.00",'
                + '    "reviewCount": "100",'
                + '    "bestRating": "5",'
                + '    "worstRating": "1"'
                + '  }'

      assert.ok(tvshowParser)
      assert.equal(tvshowParser.parseEpisode(htmlFragment, '1'), '06')
    })
  })
})
