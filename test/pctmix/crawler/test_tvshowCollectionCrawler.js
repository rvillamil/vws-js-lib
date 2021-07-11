// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const showCollectionCrawler = require('../../../lib/crawlers/pctmix/crawler/tvshowCollectionCrawler')
const siteConstants = require('../../../lib/crawlers/pctmix/constants')

describe('pctmix/crawler/tvshowCollectionCrawler', function () {
  describe('#crawlDataShowCollection()', function () {
    it('should return 5 episodes from Un mundo Feliz collection \'Un mundo Feliz\'', function () {

      var uri = `https://${siteConstants.URL_BASE_TVSHOWS_HD}un-mundo-feliz/6333`

      return showCollectionCrawler.crawlDataShowCollection(uri, 5)
        .then(showCollection => {
          assert.equal(showCollection.name, 'un-mundo-feliz/6333')
          assert.equal(showCollection.url, `https://${siteConstants.URL_BASE_TVSHOWS_HD}un-mundo-feliz/6333`)
          assert.ok(showCollection.shows)
          assert.equal(showCollection.shows.length, 5)
          showCollection.shows.forEach(show => {
            assert.ok(show.urlBase)
            assert.equal(show.urlCollection, uri)
            assert.equal(show.title, 'Un Mundo Feliz')
            assert.ok(show.sinopsis)
            assert.ok(show.description)
            assert.ok(show.quality)
            assert.ok(show.fileSize)
            assert.ok(show.urlwithCover)
            assert.ok(show.year)
            assert.ok(show.releaseDate)
            assert.ok(show.urltodownload)
            assert.equal(show.collectionName, showCollection.name)
            //assert.ok(show.originalTitle)
            //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
          })
        }).done()
    })
  })
})