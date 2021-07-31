// @ts-nocheck
/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const crawler = require('../lib/tvShowCrawler')

describe('tvShowCrawler', function () {
  this.timeout(55000)

  describe('#crawlTVShows()', () => {
    it('should return a TVShow list with three shows', () => crawler.crawlTVShows(
      3,
      (show) => {
        assert(show.title)
        assert(show.urltodownload)
        assert.equal(show.error, 0)
        // console.log("TVShow: " + JSON.stringify(show))
      },
    ).then((shows) => assert.ok(shows.length === 3)))
    it('should return a TVShow list with zero show', () => crawler.crawlTVShows(
      0,
      (show) => {
        assert(0, 1) // No debería de entrar aqui
        assert(show.error, 0)
      },
    ).then((shows) => assert.ok(shows.length === 0)))
  })
})
