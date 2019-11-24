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

    describe('#crawlDataShow()', function () {
        var urlWithFilm =
            'https://dontorrent.org/pelicula/21442/Vengadores-Endgame-Open-Matte-Imax'

        it('should return the film \'Vengadores: Endgame\' with all data', function () {
            return dontorrent.crawlDataShow(urlWithFilm).then(show => {
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(
                    show.urlBase,
                    'https://dontorrent.org/pelicula/21442/Vengadores-Endgame-Open-Matte-Imax'
                )
                assert.equal(show.title, 'Vengadores: Endgame')
                assert.ok(show.description)
                assert.equal(show.quality, 'HDRip')
                assert.equal(show.fileSize, '2,85 GB')
                assert.equal(
                    show.urlwithCover,
                    'https://blazing.network/imagenes/peliculas/Vengadores%20Endgame.jpg'
                )
                assert.equal(show.releaseDate, '22-11-2019')
                assert.equal(
                    show.urltodownload,
                    'https://blazing.network/torrents/peliculas/Vengadores_Endgame_OPEN_MATTE.torrent'
                )
            })
        })
    })

})