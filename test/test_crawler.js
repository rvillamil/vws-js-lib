//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const crawler = require('../lib/crawler');

describe('crawler', function () {

    describe('#crawlVideoPremieres()', function () {
        it('should return a video premiere list with two shows', function () {
            crawler.crawlVideoPremieres(
                2,
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                    assert.equal(show.error, 0);
                }
            ).then(showList => assert.ok(showList.length == 2))
        });
    });
    describe('#crawlBillboardFilms()', function () {
        it('should return a billboard film list with thow shows', function () {
            crawler.crawlBillboardFilms(
                2,
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                    assert.equal(show.error, 0);
                    // console.log("show: " + JSON.stringify(show));
                }
            ).then(showList => assert.ok(showList.length == 2))
        });
    });
});