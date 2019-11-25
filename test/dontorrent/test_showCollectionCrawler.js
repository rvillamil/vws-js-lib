// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const showCrawler = require('../../lib/crawlers/dontorrent/showCrawler')

describe('dontorrent/showCollectionCrawler', function () {
    it('should return the TVShow \'Mr Robot\' with all data', function () {
        return showCrawler.crawlDataShow('https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada').then(show => {
            //console.log("Show crawled:'" + JSON.stringify(show) + "'");
            assert.equal(show.urlBase, 'https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada')
            assert.equal(show.title, 'Mr Robot')
            assert.ok(show.sinopsis)
            assert.ok(show.description)
            assert.equal(show.quality, 'HDTV')
            //assert.equal(show.fileSize, '2,85 GB')
            assert.equal(
                show.urlwithCover,
                'https://blazing.network/imagenes/series/MrRobot4.jpg'
            )
            assert.equal(show.year, '2019')
            //assert.equal(show.urltodownload, '')
            //assert.equal(show.releaseDate, '') // dontorrent no proporciona este dato
            //assert.equal(show.originalTitle, '') // dontorrent no proporciona este dato
        })
    })


})