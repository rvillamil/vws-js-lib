//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const crawler = require('../lib/crawler');

describe('crawler', function () {
    this.timeout(15000);

    describe('#crawlVideoPremieres()', function () {
        it('should return a video premiere list with two shows', function () {
            return crawler.crawlVideoPremieres(
                2,
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                    assert.equal(show.error, 0);
                }
            ).then(shows => assert.ok(shows.length == 2))
        });
    });
    describe('#crawlBillboardFilms()', function () {
        it('should return a billboard film list with two shows', function () {
            return crawler.crawlBillboardFilms(
                2,
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                    assert.equal(show.error, 0);
                    // console.log("show: " + JSON.stringify(show));
                }
            ).then(shows => assert.ok(shows.length == 2))
        });
    });

    describe('#crawlTVShows()', function () {
        it('should return a TVShow list with three shows', function () {
            return crawler.crawlTVShows(
                3,
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                    assert.equal(show.error, 0);
                    //console.log("TVShow: " + JSON.stringify(show));
                }
            ).then(shows => assert.ok(shows.length == 3))
        });
    });
});