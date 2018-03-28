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
        it('should return a list with at least one show', function () {
            crawler.crawlVideoPremieres(
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                }, 2
            ).then(showList => assert.ok(showList.length == 2))
        });
    });
    describe('#crawlBillboardFilms()', function () {
        it('should return a list with at least one show', function () {
            crawler.crawlBillboardFilms(
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                    // console.log("show: " + JSON.stringify(show));
                }, 2
            ).then(showList => assert.ok(showList.length == 2))
        });
    });
});