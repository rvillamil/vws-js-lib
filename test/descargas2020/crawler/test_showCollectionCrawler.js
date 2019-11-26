// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const showCollectionCrawler = require('../../../lib/crawlers/descargas2020/crawler/tvshowCollectionCrawler')

describe('descargas2020/showCollectionCrawler', function () {
    // TODO!! Tratar la coleccion no el show individual..

    it('should return the TVShow \'Watchmen\'', function () {

        var uri = 'https://descargas2020.org/series-hd/watchmen/5258'

        return showCollectionCrawler.crawlDataShowCollection(uri)
            .then(showCollection => {
                //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                assert.equal(showCollection.name, 'watchmen/5258')
                assert.equal(showCollection.url, 'https://descargas2020.org/series-hd/watchmen/5258')
                assert.ok(showCollection.shows)
                assert.ok(showCollection.shows.length > 0)
                showCollection.shows.forEach(show => {
                    assert.equal(show.urlBase, 'https://descargas2020.org/series-hd/watchmen/5258')
                    assert.equal(show.title, 'Watchmen')
                    assert.ok(show.sinopsis)
                    assert.ok(show.description)
                    assert.equal(show.quality, 'HDTV')
                    assert.equal(show.fileSize, 'N/A')
                    assert.equal(
                        show.urlwithCover,
                        'https://descargas2020.org/pictures/c/thumbs/5258_1571665790-Watchmen.jpg'
                    )
                    assert.equal(show.year, '2019')
                    assert.ok(show.releaseDate)
                    assert.ok(show.urltodownload)
                    // assert.equal(show.originalTitle, '') // dontorrent no proporciona este dato
                })
            })
    })
})