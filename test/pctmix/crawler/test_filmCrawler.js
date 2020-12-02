// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const filmCrawler = require('../../../lib/crawlers/pctmix/crawler/filmCrawler')
const siteConstants = require('../../../lib/crawlers/pctmix/constants')

describe('pctmix/crawler/filmCrawler', function () {

    describe('#crawlDataFilm()', function () {
        it('should return the film \'Ejecucion inminente\' with all data', function () {
            
            var urlWithFilm=`https://${siteConstants.DOMAIN}/descargar/peliculas-x264-mkv/ejecucion-inminente-1999-/bluray-microhd/`

            return filmCrawler.crawlDataFilm(urlWithFilm).then(show => {
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(show.urlBase, urlWithFilm)
                assert.equal(show.title, 'Ejecucion inminente')
                //assert.ok (show.originalTitle)
                assert.ok(show.sinopsis)
                assert.ok(show.description)
                assert.equal(show.quality, 'BLURAY 720P X264 MKV')
                assert.equal(show.fileSize, '2.7 GB')
                assert.equal(show.releaseDate, '01-12-2020')
                assert.equal(
                    show.urlwithCover,
                    'https://pctmix.com/pictures/f/mediums/143973_-1606890987-Ejecucion-inminente--1999---BluRay-MicroHD.jpg'
                )
                assert.equal(show.year, '2020')
                assert.equal(
                    show.urltodownload,
                    'https://pctmix.com/download/143973_-1606890987-Ejecucion-inminente--1999---BluRay-MicroHD.torrent'

                )

                //assert.equal(show.originalTitle, '')
            })
        })
    })
})