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

describe('descargas2020/crawler/tvshowCollectionCrawler', function () {
    describe('#crawlDataShowCollection()', function () {
        it('should return 5 episodes from tvshow collection \'Watchmen\'', function () {

            var uri = 'https://descargas2020.org/series-hd/watchmen/5258'

            return showCollectionCrawler.crawlDataShowCollection(uri, 5)
                .then(showCollection => {
                    assert.equal(showCollection.name, 'watchmen/5258')
                    assert.equal(showCollection.url, 'https://descargas2020.org/series-hd/watchmen/5258')
                    assert.ok(showCollection.shows)
                    assert.equal(showCollection.shows.length, 5)
                    showCollection.shows.forEach(show => {
                        assert.ok(show.urlBase)
                        assert.equal(show.urlCollection, uri)
                        assert.equal(show.title, 'Watchmen')
                        assert.ok(show.sinopsis)
                        assert.ok(show.description)
                        assert.ok(show.quality)
                        assert.ok(show.fileSize)
                        assert.ok(show.urlwithCover)
                        assert.ok(show.year)
                        assert.ok(show.releaseDate)
                        assert.ok(show.urltodownload)
                        assert.equal(show.collectionName, showCollection.name)
                        //assert.ok(show.originalTitle)
                        //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                    })
                })
        })
    })
})