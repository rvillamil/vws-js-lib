// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tvshowCrawler = require('../../../lib/crawlers/descargas2020/crawler/tvshowCrawler')

describe('descargas2020/crawler/tvshowCrawler', function () {

    it('should return the film \'watchmen\' with all data', function () {
        var pathFile = '/home/rvp001es/Desarrollos/Projects/vws-js/vws-js-lib/test/descargas2020/crawler/tvshowcollection_watchmen_5258.html'
        var show = tvshowCrawler.crawlDataTVShowFromFile(pathFile)
        console.log('Film crawled:\'' + JSON.stringify(show) + '\'')

        assert.equal(show.urlBase, pathFile)
        assert.equal(show.title, 'Watchmen')
        assert.ok(show.sinopsis)
        assert.ok(show.description)
        assert.equal(show.quality, 'BluRay 720p X264 MKV')
        assert.equal(show.fileSize, '2.7 GB')
        assert.equal(show.releaseDate, '02-07-2019')
        assert.equal(
            show.urlwithCover,
            'https://descargas2020.org/pictures/f/mediums/124384_-1562062800-300--BluRay-MicroHD.jpg'
        )
        assert.equal(show.year, '2019')
        assert.equal(
            show.urltodownload,
            'https://descargas2020.org/descargar-torrent/124384_-1562062800-300--BluRay-MicroHD'

        )

    })


    /*
          it('should return the TVShow \'La resistencia\' 2x156 (aunque la URL ponga temporada 1)', function () {
              return tvshowCrawler.crawlDataTVShow('https://descargas2020.org/descargar/serie-en-hd/la-resistencia/temporada-1/capitulo-56-al-57/').then(show => {
                  //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                  assert.equal(
                      show.urlBase,
                      'https://descargas2020.org/descargar/serie-en-hd/la-resistencia/temporada-1/capitulo-56-al-57/'
                  )
                  assert.equal(show.title, 'La Resistencia')
                  assert.equal(show.year, '2019')
                  assert.equal(show.currentSession, '2')
                  assert.equal(show.currentEpisode, '156')
                  assert.ok(show.description)
                  assert.equal(show.quality, 'HDTV 720p')
                  assert.equal(show.fileSize, '3.9 GB')
                  assert.equal(
                      show.urlwithCover,
                      'https://descargas2020.org/pictures/c/thumbs/4116_la-resistencia.jpg'
                  )
                  assert.equal(show.releaseDate, '05-07-2019')
                  assert.equal(
                      show.urltodownload,
                      'https://descargas2020.org/descargar-torrent/124523_-1562334660-La-Resistencia---Temporada-2--HDTV-720p-AC3-5-1'
                  )
              })
          })
          */
})