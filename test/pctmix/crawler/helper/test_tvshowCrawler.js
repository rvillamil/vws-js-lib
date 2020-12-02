// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tvshowCrawler = require('../../../../lib/crawlers/pctmix/crawler/helper/tvshowCrawler')
const siteConstants = require('../../../../lib/crawlers/pctmix/constants')

describe('pctmix/crawler/tvshowCrawler', function () {

    describe('#crawlDataTVShow()', function () {
        it('should return the TVShow \'Un mundo Feliz\' 1x09', function () {
            return tvshowCrawler.crawlDataTVShow(`https://${siteConstants.DOMAIN}/descargar/serie-en-hd/un-mundo-feliz/temporada-1/capitulo-09/`).then(show => {
                //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                assert.equal(
                    show.urlBase,
                    `https://${siteConstants.DOMAIN}/descargar/serie-en-hd/un-mundo-feliz/temporada-1/capitulo-09/`
                )
                assert.equal(show.collectionName, 'un-mundo-feliz/6333')
                assert.equal(show.title, 'Un mundo feliz')
                assert.equal(show.year, '2020')
                assert.equal(show.currentSession, '1')
                assert.equal(show.currentEpisode, '9')
                assert.ok(show.description)
                assert.equal(show.quality, 'HDTV 720p')
                assert.equal(show.fileSize, '2 GB')
                assert.equal(
                    show.urlwithCover,
                    `https://${siteConstants.DOMAIN}/pictures/c/thumbs/6333_1601805574-Un-Mundo-Feliz.jpg`
                )

                assert.equal(show.releaseDate, '30-11-2020')
                assert.equal(
                    show.urltodownload,
                    `https://${siteConstants.DOMAIN}/download/143918_-1606730825-Un-Mundo-Feliz---Temporada-1--HDTV-720p-AC3-5-1.torrent`                     
                )
            })
        })
    })

})