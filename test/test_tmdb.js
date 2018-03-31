//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const tmdb = require('../lib/tmdb');
const show = require('../lib/show');

describe('tmdb', function () {
    describe('#searchShow()', function () {

        it('Should return one Show object with the film Star Wars', function () {
            return tmdb.searchShow('Star wars', '1977')
                .then(show => {
                    //console.log('Show: ', show);
                    assert.equal(show.title, 'Star wars');
                    assert.equal(show.year, '1977');
                    assert.equal(show.error, 0);
                })
        });
    });

    describe('#searchShow()', function () {

        it('Should return one Show object with error', function () {
            return tmdb.searchShow('Star way', '2977')
                .then(show => {
                    //console.log('Show: ', show);
                    assert.notEqual(show.error, 0);
                })
        });
    });
});