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
        it('should return the film \'300\' with all data', function () {
            
            return filmCrawler.crawlDataFilm(`${siteConstants.URL_BASE_VIDEOPREMIERES_HD}300`).then(show => {
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(show.urlBase, `${siteConstants.URL_BASE_VIDEOPREMIERES_HD}300`)
                assert.equal(show.title, '300')
                assert.ok(show.sinopsis)
                assert.ok(show.description)
                assert.equal(show.quality, 'BluRay 720p X264 MKV')
                assert.equal(show.fileSize, '2.7 GB')
                assert.equal(show.releaseDate, '02-07-2019')
                assert.equal(
                    show.urlwithCover,
                    'https://pctmix.com/pictures/f/mediums/124384_-1562062800-300--BluRay-MicroHD.jpg'
                )
                assert.equal(show.year, '2019')
                assert.equal(
                    show.urltodownload,
                    'https://pctmix.com/descargar-torrent/124384_-1562062800-300--BluRay-MicroHD'

                )

                //assert.equal(show.originalTitle, '')
            })
        })
    })
})