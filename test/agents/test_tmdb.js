//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tmdb = require('../../lib/agents/tmdb')

describe('tmdb', function () {
  describe('#searchFilm()', function () {
    it('Should return one Show object with the film Star Wars', function () {
      return tmdb.searchShow('Star wars','1977').then((show) => {
        //console.log('Show TMDB: ', show)
        assert.equal(show.title, 'Star wars')
        assert.equal(show.year, '1977')
        assert.equal(show.originalTitle, 'Star Wars')
        assert.equal(show.releaseDate, '1977-05-25')
        assert.equal(show.error, 0)
        //assert.equal(show.urlwithCover, 'http://image.tmdb.org/t/p/w185//4hOUzmButYUeON0prG3RpbqS7ag.jpg')
      })
    })


    it('Should return one Show object with the film El Padre , year 2020/2021', function () {
      return tmdb.searchShow('El Padre','2020').then((show) => {
        //console.log('Show TMDB: ', show)
        assert.equal(show.title, 'El Padre')
        assert.equal(show.year, '2020') // En este caso, la pelicula en españa es de 2021 y en TMDB de 2020. Al hacer la busqueda por 2021 nos encuentra la de 2020 primero(la mas cercana)
        assert.equal(show.originalTitle, 'The Father')
        assert.equal(show.releaseDate, '2020-12-23')
        assert.equal(show.error, 0)
        //assert.equal(show.urlwithCover, 'http://image.tmdb.org/t/p/w185//4hOUzmButYUeON0prG3RpbqS7ag.jpg')
      })
    })

    it('Should return one Show object with error not 0', function () {
      return tmdb.searchShow('dfewpom pmwd').then((show) => {
        //console.log('Show: ', show);
        assert.notStrictEqual(show.error, 0)
      })
    })
  })

  describe('#searchTvShow()', function () {
    it('Should return one Show object with the TVShow named as \'Arrow\'', function () {
      return tmdb.searchShow('Arrow', 'tv').then((show) => {
        console.log('Show TMDB: ', show)
        //assert(show.sinopsis)
        assert.equal(show.title, 'Arrow')
        assert.equal(show.error, 0)
      })
    })
  })
})
