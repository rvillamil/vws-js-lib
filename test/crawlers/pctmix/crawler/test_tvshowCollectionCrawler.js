// @ts-nocheck
/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const showCollectionCrawler = require('../../../../lib/crawlers/pctmix/crawler/tvshowCollectionCrawler')
const siteConstants = require('../../../../lib/crawlers/pctmix/constants')

describe('crawlers/pctmix/crawler/tvshowCollectionCrawler', () => {
  describe('#crawlDataShowCollection()', () => {
    it('should return 5 episodes from Un mundo Feliz collection \'Un mundo Feliz\'', () => {
      const uri = `${siteConstants.URL_BASE_TVSHOWS_HD}the-office/7001`

      return showCollectionCrawler.crawlDataShowCollection(uri, 5)
        .then((showCollection) => {
          assert.equal(showCollection.location, 'the-office/7001')
          assert.equal(showCollection.url, `${siteConstants.URL_BASE_TVSHOWS_HD}the-office/7001`)
          assert.ok(showCollection.shows)
          assert.equal(showCollection.shows.length, 5)

          showCollection.shows.forEach((show) => {
            assert.ok(show.urlBase)
            assert.equal(show.urlCollection, uri)
            assert.equal(show.title, 'The office')
            assert.ok(show.sinopsis)
            assert.ok(show.description)
            assert.ok(show.quality)
            assert.ok(show.fileSize)
            assert.ok(show.urlwithCover)
            assert.ok(show.year)
            assert.ok(show.releaseDate)
            assert.ok(show.urltodownload.includes('.torrent'))
            assert.equal(show.collectionName, showCollection.location)
            // assert.ok(show.originalTitle)
            // console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
          })
        })
    })
  })
})
