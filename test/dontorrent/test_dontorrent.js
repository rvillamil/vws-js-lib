// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const dontorrent = require('../../lib/crawlers/dontorrent/dontorrent')

describe('dontorrent/dontorrent', function () {
    this.timeout(15000)

    describe('#crawlLinkToURLsWithVideoPremieres()', function () {
        it('should return a video premiere url list with 5 url', function () {
            return dontorrent.crawlLinkToURLsWithVideoPremieres(5).then(urls => {
                assert.ok(urls.length == 5)
                for (var i = 0; i < urls.length; i++) {
                    assert.ok(urls[i].includes('pelicula/'))
                }
            })
        })
    })


    describe('#crawlLinkToURLsWithBillboardFilms()', function () {
        it('should return a billboard film url list with 0 url', function () {
            return dontorrent.crawlLinkToURLsWithBillboardFilms(2).then(urls => assert.ok(urls.length == 0))
        })
    })

})