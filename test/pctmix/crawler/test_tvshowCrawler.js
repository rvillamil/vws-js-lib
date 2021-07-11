// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tvshowCrawler = require('../../../lib/crawlers/pctmix/crawler/tvshowCrawler')
const siteConstants = require('../../../lib/crawlers/pctmix/constants')

describe('pctmix/crawler/tvshowCrawler', function () {

  describe('#crawlDataTVShow()', function () {
    it('should return the TVShow \'Batwoman\' 2x06', function () {
            
      // https://pctmix1.com/descargar/torrent/serie-en-hd/black-lightning/temporada-4/capitulo-09-al-13/2021-07-06/
      return tvshowCrawler.crawlDataTVShow(`https://${siteConstants.DOMAIN}/descargar/serie-en-hd/black-lightning/temporada-4/capitulo-09-al-13/2021-07-06/`).then(show => {
        //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
        assert.equal(
          show.urlBase,
          `https://${siteConstants.DOMAIN}/descargar/serie-en-hd/black-lightning/temporada-4/capitulo-09-al-13/2021-07-06/`
        )
        assert.equal(show.collectionName, 'black-lightning/3626')
        assert.equal(show.title, 'Black lightning')
        assert.equal(show.year, '2021')
        assert.equal(show.currentSession, '4')
        assert.equal(show.currentEpisode, '09')
        assert.ok(show.description)
        assert.equal(show.quality, 'HDTV 720p')
        assert.equal(show.fileSize, '4.9 GB')
        assert.equal(
          show.urlwithCover,
          `https://${siteConstants.DOMAIN}/pictures/c/thumbs/3626_black-lightning.jpg`
        )
                
        // https://pctmix1.com/download/153751_-1625640900-Black-Lightning--Proper----Temporada-4--HDTV-720p-AC3-5-1.torrent
        assert.equal(show.releaseDate, '07-07-2021')
        assert.equal(
          show.urltodownload,
          `https://${siteConstants.DOMAIN}/download/153751_-1625640900-Black-Lightning--Proper----Temporada-4--HDTV-720p-AC3-5-1.torrent`
        )
      })
    })
  })

})