/* eslint-disable no-undef */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const tmdb = require('../../lib/agents/tmdb')

describe('tmdb', () => {
  describe('#searchFilm()', () => {
    it('Should return one Show object with the film Star Wars', () => tmdb.searchShow('Star wars', '1977').then((show) => {
      // console.log('Show TMDB: ', show)
      assert.equal(show.title, 'Star wars')
      assert.equal(show.year, '1977')
      assert.equal(show.originalTitle, 'Star Wars')
      assert.equal(show.releaseDate, '1977-05-25')
      assert.equal(show.error, 0)
      assert(show.sinopsis)
      assert(show.urlwithCover)
    }))

    it('Should return one Show object with the film El Padre , year 2020/2021', () => tmdb.searchShow('El Padre', '2020').then((show) => {
      // console.log('Show TMDB: ', show)
      assert.equal(show.title, 'El Padre')
      assert.equal(show.year, '2020') // En este caso, la pelicula en españa es de 2021 y en TMDB de 2020. Al hacer la busqueda por 2021 nos encuentra la de 2020 primero(la mas cercana)
      assert.equal(show.originalTitle, 'The Father')
      assert.equal(show.releaseDate, '2020-12-23')
      assert.equal(show.error, 0)
      assert(show.sinopsis)
      assert(show.urlwithCover)
    }))

    it('Should return one Show object with the Superman', () => tmdb.searchShow('Superman').then((show) => {
      // console.log('Show TMDB: ', show)
      assert.equal(show.year, '1978')
      assert.equal(show.releaseDate, '1978-12-13')
      assert.equal(show.tmdbRating, 7.1)
      assert.equal(show.title, 'Superman')
      assert.equal(show.originalTitle, 'Superman')
      assert(show.sinopsis)
    }))

    it('Should return one Show object with error not 0', () => tmdb.searchShow('dfewpom pmwd').then((show) => {
      // console.log('Show: ', show)
      assert.notStrictEqual(show.error, 0)
    }))
  })

  describe('#searchTvShow()', () => {
    it('Should return one Show object with the TVShow named as \'Arrow\'', () => tmdb.searchShow('Arrow', 'tv').then((show) => {
      // console.log('Show TMDB: ', show)
      assert(!show.sinopsis)
      assert.equal(show.title, 'Arrow')
      assert.equal(show.year, '2019')
      assert.equal(show.originalTitle, 'Arrow')
      assert.equal(show.error, 0)
      assert.equal(show.releaseDate, '2019-07-12')
    }))
  })
})
