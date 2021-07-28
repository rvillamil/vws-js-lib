// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const showCollectionCrawler = require('../../../../lib/crawlers/pctmix/crawler/tvshowCollectionCrawler')
const siteConstants = require('../../../../lib/crawlers/pctmix/constants')

describe('pctmix/crawler/tvshowCollectionCrawler', function () {
  describe('#crawlDataShowCollection()', function () {
    it('should return 5 episodes from Un mundo Feliz collection \'Un mundo Feliz\'', function () {

      var uri = `${siteConstants.URL_BASE_TVSHOWS_HD}the-office/7001`

      return showCollectionCrawler.crawlDataShowCollection(uri, 5)
        .then(showCollection => {
          assert.equal(showCollection.name, 'the-office/7001')
          assert.equal(showCollection.url, `${siteConstants.URL_BASE_TVSHOWS_HD}the-office/7001`)
          assert.ok(showCollection.shows)
          assert.equal(showCollection.shows.length, 5)
          
          showCollection.shows.forEach(show => {
            assert.ok(show.urlBase)
            assert.equal(show.urlCollection, uri)
            assert.equal(show.title, 'The office')
            assert.ok(show.sinopsis)
            assert.ok(show.description)
            assert.ok(show.quality)
            assert.ok(show.fileSize)
            assert.ok(show.urlwithCover)
            assert.ok(show.year)
            assert.ok(show.releaseDate)
            assert.ok(show.urltodownload.includes('.torrent'))
            assert.equal(show.collectionName, showCollection.name)
            //assert.ok(show.originalTitle)
            //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
          })          
        })
    })
  })
})
/*
pctmix1.com - crawlDataShowCollection - 6 episodes found on 'https://pctmix1.com/series-hd/the-office/7001'
/home/rodrigo/Desarrollos/Projects/vws-js/vws-js-lib/lib/crawlers/pctmix/crawler/tvshowCrawler.js:25 pctmix1.com - crawlDataTVShow on url 'https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-7/capitulo-23-al-26/'
/home/rodrigo/Desarrollos/Projects/vws-js/vws-js-lib/lib/crawlers/pctmix/crawler/tvshowCrawler.js:25 pctmix1.com - crawlDataTVShow on url 'https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-7/capitulo-20-al-22/'
/home/rodrigo/Desarrollos/Projects/vws-js/vws-js-lib/lib/crawlers/pctmix/crawler/tvshowCrawler.js:25 pctmix1.com - crawlDataTVShow on url 'https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-7/capitulo-17-al-19/'
/home/rodrigo/Desarrollos/Projects/vws-js/vws-js-lib/lib/crawlers/pctmix/crawler/tvshowCrawler.js:25 pctmix1.com - crawlDataTVShow on url 'https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-7/capitulo-13-al-16/'
/home/rodrigo/Desarrollos/Projects/vws-js/vws-js-lib/lib/crawlers/pctmix/crawler/tvshowCrawler.js:25 pctmix1.com - crawlDataTVShow on url 'https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-7/capitulo-10-al-12/'
/home/rodrigo/Desarrollos/Projects/vws-js/vws-js-lib/lib/crawlers/pctmix/crawler/tvshowCrawler.js:25 pctmix1.com - crawlDataTVShow on url 'https://pctmix1.com/descargar/serie-en-hd/the-office/temporada-7/capitulo-07-al-09/'
*/