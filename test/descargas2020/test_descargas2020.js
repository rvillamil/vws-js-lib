// @ts-nocheck
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const descargas2020 = require('../../lib/crawlers/descargas2020/descargas2020')

describe('descargas2020', function () {
    this.timeout(15000)
    describe('#crawlLinkToURLsWithVideoPremieres()', function () {
        it('should return a video premiere url list with 2 url', function () {
            return descargas2020.crawlLinkToURLsWithVideoPremieres(2).then(urls => {
                assert.ok(urls.length == 2)
            })
        })
    })

    describe('#crawlLinkToURLsWithBillboardFilms()', function () {
        it('should return a billboard film url list with 2 url', function () {
            return descargas2020
                .crawlLinkToURLsWithBillboardFilms(2)
                .then(urls => assert.ok(urls.length == 2))
        })
    })

    describe('#crawlLinkToURLsWithLatestTVShows()', function () {
        it('should return a tvshow url list with 3 url', function () {
            return descargas2020
                .crawlLinkToURLsWithLatestTVShows(3)
                .then(urls => assert.ok(urls.length == 3))
        })
    })

    describe('#crawlLinkToURLsWithEpisodes()', function () {
        it('should return a tvshow url list with 3 url', function () {
            return descargas2020
                .crawlLinkToURLsWithEpisodes(3, 'erase-una-vez/1490')
                .then(urls => assert.ok(urls.length == 3))
        })
    })
})