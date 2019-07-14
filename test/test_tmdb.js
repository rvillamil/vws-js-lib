//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tmdb = require('../lib/tmdb')

describe('tmdb', function () {
    describe('#searchShow()', function () {

        it('Should return one Show object with the film Star Wars', function () {
            return tmdb.searchShow('Star wars')
                .then(show => {
                    //console.log('Show TMDB: ', show);
                    assert.equal(show.title, 'Star wars')
                    assert.equal(show.year, '1977')
                    assert.equal(show.originalTitle, 'Star Wars')
                    assert.equal(show.releaseDate, '1977-05-25')
                    assert.equal(show.error, 0)
                })
        })

        it('Should return one Show object with error not 0', function () {
            return tmdb.searchShow('dfewpom pmwd')
                .then(show => {
                    //console.log('Show: ', show);
                    assert.notEqual(show.error, 0)
                })
        })

        it('Should return one Show object with the TVShow named as \'Arrow\'', function () {
            return tmdb.searchShow('Arrow', 'tv')
                .then(show => {
                    // console.log('Show TMDB: ', show);
                    assert(show.sinopsis)
                    assert.equal(show.title, 'Arrow')
                    assert.equal(show.error, 0)
                })
        })

    })
})