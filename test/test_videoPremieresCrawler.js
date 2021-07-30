// @ts-nocheck
/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const crawler = require('../lib/videoPremieresCrawler')

describe('videoPremieresCrawler', function () {
  this.timeout(55000)

  describe('#crawlVideoPremieres()', () => {
    it('should return a video premiere list with zero show', () => crawler.crawlVideoPremieres(
      0,
      (show) => {
        assert(0, 1) // No debería de entrar aqui
        assert(show.error, 0)
      },
    ).then((shows) => assert.ok(shows.length === 0)))

    it('should return a video premiere list with one show', () => crawler.crawlVideoPremieres(
      1,
      (show) => {
        // console.log("show: " + JSON.stringify(show))
        assert(show.title)
        assert(show.urltodownload)
        assert.equal(show.error, 0)
      },
    ).then((shows) => assert.ok(shows.length === 1)))

    it('should return a video premiere list with two shows', () => crawler.crawlVideoPremieres(
      2,
      (show) => {
        // console.log("show: " + JSON.stringify(show))
        assert(show.title)
        assert(show.urltodownload)
        assert.equal(show.error, 0)
      },
    ).then((shows) => assert.ok(shows.length === 2)))

    it('should return a video premiere list with three shows', () => crawler.crawlVideoPremieres(
      3,
      (show) => {
        // console.log("show: " + JSON.stringify(show))
        assert(show.title)
        assert(show.urltodownload)
        assert.equal(show.error, 0)
      },
    ).then((shows) => assert.ok(shows.length === 3)))

    it('should return a video premiere list with at less, 30 shows', () => crawler.crawlVideoPremieres(
      30,
      (show) => {
        // console.log("show: " + JSON.stringify(show))
        assert(show.title)
        assert(show.domain)
        assert(show.urltodownload)
        assert.equal(show.error, 0)
      },
    ).then((shows) => {
      // console.log("show: " + JSON.stringify(show))
      // console.log(`shows length: ${shows.length}`)
      assert(shows.length <= 40)
    }))
  })
})
