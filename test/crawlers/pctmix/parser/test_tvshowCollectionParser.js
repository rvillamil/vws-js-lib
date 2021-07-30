/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const tvshowCollectionParser = require('../../../../lib/crawlers/pctmix/parser/tvshowCollectionParser')

describe('crawlers/pctmix/parser/tvshowCollectionParser', () => {
  describe('#parseUrlWithShowCollectionName()', () => {
    it('should return the collection name from URL', () => {
      const urlWithShowCollectionName = 'https://pctmix.org/series-hd/watchmen/5258'

      assert.ok(tvshowCollectionParser)
      assert.equal(tvshowCollectionParser.parseUrlWithShowCollectionName(urlWithShowCollectionName),
        'watchmen/5258')
    })
  })
})
