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
                    //console.log('Show TMDB: ', show);
                    assert.equal(show.title, 'Star wars');
                    assert.equal(show.year, '1977');
                    assert.equal(show.originalTitle, 'Star Wars');
                    assert.equal(show.releaseDate, '1977-05-25');
                    assert.equal(show.error, 0);
                })
        });

        it('Should return one Show object with error', function () {
            return tmdb.searchShow('Star way', '2977')
                .then(show => {
                    //console.log('Show: ', show);
                    assert.notEqual(show.error, 0);
                })
        });

        it('Should return one Show object with the TVShow Arroq', function () {
            return tmdb.searchShow('Arrow', null, 'tv')
                .then(show => {
                    //console.log('Show TMDB: ', show);
                    assert.equal(show.title, 'Arrow');
                    assert.equal(show.error, 0);
                })
        });

    });
});