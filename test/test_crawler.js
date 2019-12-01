//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const crawler = require('../lib/crawler')
const ShowCollection = require('../lib/model/showCollection')

describe('crawler', function () {
    this.timeout(55000)

    describe('#crawlVideoPremieres()', function () {
        it('should return a video premiere list with two shows', function () {
            return crawler.crawlVideoPremieres(
                2,
                show => {
                    //console.log("show: " + JSON.stringify(show));
                    assert(show.title)
                    assert(show.urltodownload)
                    assert.equal(show.error, 0)
                }
            ).then(shows => assert.ok(shows.length == 2))
        })
    })
    describe('#crawlBillboardFilms()', function () {
        it('should return a billboard film list with two shows', function () {
            return crawler.crawlBillboardFilms(
                2,
                show => {
                    assert(show.title)
                    assert(show.urltodownload)
                    assert.equal(show.error, 0)
                    // console.log("show: " + JSON.stringify(show));
                }
            ).then(shows => assert.ok(shows.length == 2))
        })
    })

    describe('#crawlTVShows()', function () {
        it('should return a TVShow list with three shows', function () {
            return crawler.crawlTVShows(
                3,
                show => {
                    assert.equal(show.title, 'pp')-- > //TODO: ESTE TEST DICE QUE FUNCIONA Y NO FUNCJONA...esta mal
                        assert(show.urltodownload)
                    assert.equal(show.error, 0)
                    console.log("TVShow: " + JSON.stringify(show))
                }
            )
        })
    })


    describe('#crawlTVShowCollections()', function () {
        it('should return a TVShow collection list with 2 showscollection with 4 episodes every collecion', function () {
            var showCollection1 = new ShowCollection()
            showCollection1.name = 'modern-family/2261'

            var showCollection2 = new ShowCollection()
            showCollection1.name = 'arrow/1596'

            var showCollectionList = []
            showCollectionList.push(showCollection1)
            showCollectionList.push(showCollection2)

            return crawler.crawlTVShowCollections(4, showCollectionList)
                .then(newShowCollectionList => {
                    assert.equal(newShowCollectionList.length, 2)
                    assert.equal(newShowCollectionList[0].shows.length, 4)
                })
        })
    })


})