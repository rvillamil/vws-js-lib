// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const dontorrent = require('../lib/crawlers/dontorrent')

describe('dontorrent', function () {
    this.timeout(15000)
    describe('#crawlLinkToURLsWithVideoPremieres()', function () {
        it('should return a video premiere url list with 5 url', function () {
            return dontorrent.crawlLinkToURLsWithVideoPremieres(5).then(urls => {
                assert.ok(urls.length == 5)
            })
        })
    })
})