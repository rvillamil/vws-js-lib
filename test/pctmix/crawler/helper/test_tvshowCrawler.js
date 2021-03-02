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
        it('should return the TVShow \'Batwoman\' 2x06', function () {
            
            return tvshowCrawler.crawlDataTVShow(`https://${siteConstants.DOMAIN}/descargar/serie-en-hd/batwoman/temporada-2/capitulo-06/`).then(show => {
                //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                assert.equal(
                    show.urlBase,
                    `https://${siteConstants.DOMAIN}/descargar/serie-en-hd/batwoman/temporada-2/capitulo-06/`
                )
                assert.equal(show.collectionName, 'batwoman/5212')
                assert.equal(show.title, 'Batwoman')
                assert.equal(show.year, '2021')
                assert.equal(show.currentSession, '2')
                assert.equal(show.currentEpisode, '06')
                assert.ok(show.description)
                assert.equal(show.quality, 'HDTV 720p')
                assert.equal(show.fileSize, '1.5 GB')
                assert.equal(
                    show.urlwithCover,
                    `https://${siteConstants.DOMAIN}/pictures/c/thumbs/5212_1570531110-Batwoman.jpg`
                )

                assert.equal(show.releaseDate, '02-03-2021')
                assert.equal(
                    show.urltodownload,
                    `https://${siteConstants.DOMAIN}/descargar-torrent/147478_-1614669299-Batwoman---Temporada-2--HDTV-720p-AC3-5-1/`
                )
            })
        })
    })

})