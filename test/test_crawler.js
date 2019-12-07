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
        it('should return a video premiere list with zero show', function () {
            return crawler.crawlVideoPremieres(
                0,
                show => {
                    assert.equal(0, 1) // No debería de entrar aqui
                    assert.equal(show.error, 0)
                }
            ).then(shows => assert.ok(shows.length == 0))
        })

        it('should return a video premiere list with one show', function () {
            return crawler.crawlVideoPremieres(
                1,
                show => {
                    //console.log("show: " + JSON.stringify(show))
                    assert(show.title)
                    assert(show.urltodownload)
                    assert.equal(show.error, 0)
                }
            ).then(shows => assert.ok(shows.length == 1))
        })

        it('should return a video premiere list with two shows', function () {
            return crawler.crawlVideoPremieres(
                2,
                show => {
                    //console.log("show: " + JSON.stringify(show))
                    assert(show.title)
                    assert(show.urltodownload)
                    assert.equal(show.error, 0)
                }
            ).then(shows => assert.ok(shows.length == 2))
        })

        it('should return a video premiere list with three shows', function () {
            return crawler.crawlVideoPremieres(
                3,
                show => {
                    //console.log("show: " + JSON.stringify(show))
                    assert(show.title)
                    assert(show.urltodownload)
                    assert.equal(show.error, 0)
                }
            ).then(shows => assert.ok(shows.length == 3))
        })

        it('should return a video premiere list with 35 shows as max when i request 40', function () {
            return crawler.crawlVideoPremieres(
                40,
                show => {
                    //console.log("show: " + JSON.stringify(show))
                    assert(show.title)
                    assert(show.domain)
                    assert(show.urltodownload)
                    assert.equal(show.error, 0)
                }
            ).then(shows => {
                //console.log("show: " + JSON.stringify(show))
                assert.equal(shows.length, 35)
            })
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
                    assert(show.title)
                    assert(show.urltodownload)
                    assert.equal(show.error, 0)
                    //console.log("TVShow: " + JSON.stringify(show))
                }
            ).then(shows => assert.ok(shows.length == 3))
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