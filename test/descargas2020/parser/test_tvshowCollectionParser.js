//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tvshowCollectionParser = require('../../../lib/crawlers/descargas2020/parser/tvshowCollectionParser')

describe('descargas2020/parser/tvshowCollectionParser', function () {

    describe('parseUrlWithShowCollectionName', function () {

        it('should return the collection name from URL', function () {


            var urlWithShowCollectionName = 'https://descargas2020.org/series-hd/watchmen/5258'

            assert.ok(tvshowCollectionParser)
            assert.equal(tvshowCollectionParser.parseUrlWithShowCollectionName(urlWithShowCollectionName),
                'watchmen/5258')
        })
    })
})