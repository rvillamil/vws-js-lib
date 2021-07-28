//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tvshowCollectionParser = require('../../../../lib/crawlers/pctmix/parser/tvshowCollectionParser')

describe('pctmix/parser/tvshowCollectionParser', function () {

    describe('#parseUrlWithShowCollectionName()', function () {

        it('should return the collection name from URL', function () {


            var urlWithShowCollectionName = 'https://pctmix.org/series-hd/watchmen/5258'

            assert.ok(tvshowCollectionParser)
            assert.equal(tvshowCollectionParser.parseUrlWithShowCollectionName(urlWithShowCollectionName),
                'watchmen/5258')
        })
    })
})