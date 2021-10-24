// @ts-nocheck
/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const tvshowCrawler = require('../../../../lib/crawlers/pctmix/crawler/tvshowCrawler')
const siteConstants = require('../../../../lib/crawlers/pctmix/constants')

describe('crawlers/pctmix/crawler/tvshowCrawler', () => {
  describe('#crawlDataTVShow()', () => {
    it('should return the TVShow \'The Office\' 9x22',
      () => tvshowCrawler.crawlDataTVShow(`https://${siteConstants.DOMAIN}/descargar/torrent/serie-en-hd/the-office/temporada-9/capitulo-22-al-23/`).then((show) => {
      // console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
        assert.equal(
          show.urlBase,
          `https://${siteConstants.DOMAIN}/descargar/torrent/serie-en-hd/the-office/temporada-9/capitulo-22-al-23/`,
        )
        assert.equal(show.collectionName, 'the-office/7001')
        assert.equal(show.title, 'The office')
        assert.equal(show.year, '2021')
        assert.equal(show.currentSession, '9')
        assert.equal(show.currentEpisode, '22')
        assert.ok(show.description)
        assert.equal(show.quality, 'HDTV 720p')
        assert.equal(show.fileSize, '6.8 GB')
        assert.equal(
          show.urlwithCover,
          `https://${siteConstants.DOMAIN}/pictures/c/thumbs/7001_1622796285-The-Office.jpg`,
        )
        assert.equal(show.releaseDate, '28-07-2021')
        assert.equal(
          show.urltodownload,
          `https://${siteConstants.DOMAIN}/download/154985_-1627451418-The-Office---Temporada-9--HDTV-720p-AC3-5-1.torrent`,
        )
      }))

    it('should return the TVShow \'The office\'', () => tvshowCrawler.crawlDataTVShow(`https://${siteConstants.DOMAIN}/descargar/torrent/serie-en-hd/the-office/temporada-7/capitulo-23-al-26/`).then((show) => {
      // console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
      assert.equal(
        show.urlBase,
        `https://${siteConstants.DOMAIN}/descargar/torrent/serie-en-hd/the-office/temporada-7/capitulo-23-al-26/`,
      )

      assert.equal(
        show.urltodownload,
        `https://${siteConstants.DOMAIN}/download/154046_-1626071122-The-Office---Temporada-7--HDTV-720p-AC3-5-1.torrent`,
      )
    }))
  })
})
