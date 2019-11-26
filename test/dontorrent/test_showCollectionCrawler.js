// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const showCollectionCrawler = require('../../lib/crawlers/dontorrent/crawler/showCollectionCrawler')

describe('dontorrent/showCollectionCrawler', function () {
    it('should return the TVShow \'Mr Robot\' with all data', function () {

        return showCollectionCrawler.crawlDataShowCollection('https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada').then(showCollection => {
            //console.log("ShowCollection crawled:'" + JSON.stringify(showCollection) + "'");

            assert.equal(showCollection.name, '63880/63881/Mr-Robot-4-Temporada')
            assert.equal(showCollection.url, 'https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada')
            assert.ok(showCollection.shows)
            assert.ok(showCollection.shows.length > 0)
            showCollection.shows.forEach(show => {
                assert.equal(show.urlBase, 'https://dontorrent.org/serie/63880/63881/Mr-Robot-4-Temporada')
                assert.equal(show.title, 'Mr. Robot')
                assert.ok(show.sinopsis)
                assert.ok(show.description)
                assert.equal(show.quality, 'HDTV')
                assert.equal(show.fileSize, 'N/A')
                assert.equal(
                    show.urlwithCover,
                    'https://blazing.network/imagenes/series/MrRobot4.jpg'
                )
                assert.equal(show.year, '2019')
                assert.ok(show.releaseDate)
                assert.ok(show.urltodownload)
                // assert.equal(show.originalTitle, '') // dontorrent no proporciona este dato

            })
        })
    })
})