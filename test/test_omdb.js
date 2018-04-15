//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const omdb = require('../lib/omdb');
const show = require('../lib/show');

describe('omdb', function () {
    describe('#searchShow()', function () {

        it('Should return one Show object with the film Star Wars', function () {
            return omdb.searchShow('Star wars', '1977')
                .then(show => {
                    //console.log('Show OMDB: ', show);
                    assert.equal(show.title, 'Star wars');
                    assert.equal(show.year, '1977');
                    assert.equal(show.originalTitle, 'Star Wars: Episode IV - A New Hope');
                    assert.equal(show.releaseDate, '25 May 1977');

                    assert.equal(show.error, 0);
                })
        });

        it('Should return one Show object with error', function () {
            return omdb.searchShow('Star way', '2977')
                .then(show => {
                    //console.log('Show Error: ', show);
                    assert.notEqual(show.error, 0);
                })
        });
    });
});