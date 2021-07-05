// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const filmCrawler = require('../../../lib/crawlers/dontorrent/crawler/filmCrawler')

describe('dontorrent/crawler/filmCrawler', function () {

    describe('#crawlDataFilm()', function () {
        it('should return the film \'Vengadores: Endgame\' with all data', function () {
            return filmCrawler.crawlDataFilm('https://dontorrent.org/pelicula/21442/Vengadores-Endgame-Open-Matte-Imax').then(show => {
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(show.urlBase, 'https://dontorrent.org/pelicula/21442/Vengadores-Endgame-Open-Matte-Imax')
                assert.equal(show.title, 'Vengadores: Endgame')
                assert.ok(show.sinopsis)
                assert.ok(show.description)
                assert.equal(show.quality, 'HDRip')
                //assert.equal(show.fileSize, '2,85 GB')
                assert.equal(show.urlwithCover, null)
                assert.equal(show.year, '2019')
                assert.equal(
                    show.urltodownload,
                    'https://blazing.network/torrents/peliculas/Vengadores_Endgame_OPEN_MATTE.torrent'
                )
                assert.equal(show.releaseDate, '') // dontorrent no proporciona este dato
                assert.equal(show.originalTitle, '') // dontorrent no proporciona este dato
            })
        })
    })
})