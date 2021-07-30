// @ts-nocheck
/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const tvshowCrawler = require('../../../../lib/crawlers/pctmix/crawler/tvshowCrawler')
const siteConstants = require('../../../../lib/crawlers/pctmix/constants')

describe('crawlers/pctmix/crawler/tvshowCrawler', () => {
  describe('#crawlDataTVShow()', () => {
    it('should return the TVShow \'Black Lightning\' 2x06', () => tvshowCrawler.crawlDataTVShow('https://pctmix1.com/descargar/torrent/serie-en-hd/black-lightning/temporada-4/capitulo-09-al-13/2021-07-06/').then((show) => {
      // console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
      assert.equal(
        show.urlBase,
        `https://${siteConstants.DOMAIN}/descargar/torrent/serie-en-hd/black-lightning/temporada-4/capitulo-09-al-13/2021-07-06/`,
      )
      assert.equal(show.collectionName, 'black-lightning/3626')
      assert.equal(show.title, 'Black lightning')
      assert.equal(show.year, '2021')
      assert.equal(show.currentSession, '4')
      assert.equal(show.currentEpisode, '9')
      assert.ok(show.description)
      assert.equal(show.quality, 'HDTV 720p')
      assert.equal(show.fileSize, '4.9 GB')
      assert.equal(
        show.urlwithCover,
        `https://${siteConstants.DOMAIN}/pictures/c/thumbs/3626_black-lightning.jpg`,
      )

      assert.equal(show.releaseDate, '06-07-2021')
      assert.equal(
        show.urltodownload,
        `https://${siteConstants.DOMAIN}/download/153751_-1625640900-Black-Lightning--Proper----Temporada-4--HDTV-720p-AC3-5-1.torrent`,
      )
    }))

    it('should return the TVShow \'The office\'', () => tvshowCrawler.crawlDataTVShow('https://pctmix1.com/descargar/torrent/serie-en-hd/the-office/temporada-7/capitulo-23-al-26/').then((show) => {
      // console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
      assert.equal(
        show.urlBase,
        'https://pctmix1.com/descargar/torrent/serie-en-hd/the-office/temporada-7/capitulo-23-al-26/',
      )

      assert.equal(
        show.urltodownload,
        'https://pctmix1.com/download/154046_-1626071122-The-Office---Temporada-7--HDTV-720p-AC3-5-1.torrent',
      )
    }))
  })
})
