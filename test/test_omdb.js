//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const omdb = require('../lib/omdb')

describe('omdb', function () {
    describe('#searchShow()', function () {

        it('Should return one Show object with the film Star Wars', function () {
            return omdb.searchShow('Star wars')
                .then(show => {
                    //console.log('Show OMDB: ', show);
                    assert.equal(show.title, 'Star wars')
                    assert.equal(show.year, '1977')
                    assert.equal(show.originalTitle, 'Star Wars: Episode IV - A New Hope')
                    assert.equal(show.releaseDate, '25 May 1977')
                    assert.equal(show.urlwithCover, 'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg')
                    assert.equal(show.error, 0)
                })
        })

        it('Should return one Show object with error not 0', function () {
            return omdb.searchShow('dfewpom pmwd')
                .then(show => {
                    assert.notEqual(show.error, 0)
                })
        })
    })
})