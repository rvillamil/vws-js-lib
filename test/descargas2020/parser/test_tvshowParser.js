//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tvshowParser = require('../../../lib/crawlers/descargas2020/parser/tvshowParser')

describe('descargas2020/parser/tvshowParser', function () {

    describe('#parseSession()', function () {

        it('should return sesion 8', function () {

            var htmlFragment = '<script type="application/ld+json">' +
                '{' +
                '  "@context": "http://schema.org/",' +
                '  "@type": "Recipe",' +
                '  "name": "Watchmen - Temporada 1 [HDTV 720p][Cap.106][AC3 5.1 Castellano][www.descargas2020.ORG][www.pctnew.ORG]",' +
                '  "author": "PctNew",' +
                '  "image": "//descargas2020.org/pictures/c/thumbs/5258_1571665790-Watchmen.jpg",' +
                '  "description": "Director: Damon Lindelof (Creator), Steph Green, Nicole Kass",' +
                '  "aggregateRating": {' +
                '    "@type": "AggregateRating",' +
                '    "ratingValue": "5.00",' +
                '    "reviewCount": "100",' +
                '    "bestRating": "5",' +
                '    "worstRating": "1"' +
                '  }'

            assert.ok(tvshowParser)
            assert.equal(tvshowParser.parseSession(htmlFragment), '1')
        })
    })

    describe('#parseEpisode()', function () {

        it('should return episode 6', function () {

            var htmlFragment = '<script type="application/ld+json">' +
                '{' +
                '  "@context": "http://schema.org/",' +
                '  "@type": "Recipe",' +
                '  "name": "Watchmen - Temporada 1 [HDTV 720p][Cap.106][AC3 5.1 Castellano][www.descargas2020.ORG][www.pctnew.ORG]",' +
                '  "author": "PctNew",' +
                '  "image": "//descargas2020.org/pictures/c/thumbs/5258_1571665790-Watchmen.jpg",' +
                '  "description": "Director: Damon Lindelof (Creator), Steph Green, Nicole Kass",' +
                '  "aggregateRating": {' +
                '    "@type": "AggregateRating",' +
                '    "ratingValue": "5.00",' +
                '    "reviewCount": "100",' +
                '    "bestRating": "5",' +
                '    "worstRating": "1"' +
                '  }'

            assert.ok(tvshowParser)
            assert.equal(tvshowParser.parseEpisode(htmlFragment, '1'), '06')
        })
    })
})