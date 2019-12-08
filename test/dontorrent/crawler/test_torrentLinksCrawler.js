// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const torrentLinksCrawler = require('../../../lib/crawlers/dontorrent/crawler/torrentLinksCrawler')
const constantsDontorrent = require('../../../lib/crawlers/dontorrent/constants')


describe('dontorrent/crawler/torrentLinksCrawler', function () {

    describe('#crawlLinksFrom()', function () {

        it('should return the "peliculas" torrent links list with size 4', function () {
            return torrentLinksCrawler.crawlLinksFrom(constantsDontorrent.URL_BASE_VIDEOPREMIERES_HD, 4, 'pelicula')
                .then(torrentLinks => {
                    //console.log(`torrentLinks - ${JSON.stringify(torrentLinks)}`)
                    assert.equal(torrentLinks.length, 4)
                })
        })

        it('should return the "peliculas" torrent links list with size 15 even if you ask 30', function () {
            return torrentLinksCrawler.crawlLinksFrom(constantsDontorrent.URL_BASE_VIDEOPREMIERES_HD, 30, 'pelicula')
                .then(torrentLinks => {
                    //console.log(`torrentLinks - ${JSON.stringify(torrentLinks)}`)
                    assert.equal(torrentLinks.length, 15)
                })
        })

        it('should return the "series" torrent links list with size 3', function () {
            return torrentLinksCrawler.crawlLinksFrom(constantsDontorrent.URL_BASE_TVSHOWS_HD, 3, 'serie')
                .then(torrentLinks => {
                    //console.log(`torrentLinks - ${JSON.stringify(torrentLinks)}`)
                    assert.equal(torrentLinks.length, 3)
                })
        })


        it('should return the "series" torrent links list with size 20', function () {
            return torrentLinksCrawler.crawlLinksFrom(constantsDontorrent.URL_BASE_TVSHOWS_HD, 15, 'serie')
                .then(torrentLinks => {
                    //console.log(`torrentLinks - ${JSON.stringify(torrentLinks)}`)
                    assert.equal(torrentLinks.length, 15)
                })
        })

    })
})


