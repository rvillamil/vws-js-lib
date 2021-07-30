// @ts-nocheck
/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const Show = require('../lib/model/show')
const xmdbSearcher = require('../lib/xmdbSearcher')

describe('xmdbSearcher', function () {
  this.timeout(55000)

  describe('#searchShowInXMDB()', () => {
    it('Should return one Show object with the Superman', () => {
      const show = new Show()
      show.title = 'Superman'
      show.year = '1978'
      return xmdbSearcher.searchShowInXMDB(show)
        .then((showFound) => {
          // console.log('Show XMDB: ', showFound)
          assert.equal(showFound.year, '1978')
          assert.equal(showFound.releaseDate, '1978-12-13')
          assert.equal(showFound.title, 'Superman')
          assert.equal(showFound.originalTitle, 'Superman')
          assert.equal(show.tmdbRating, 7.1)
          assert.equal(showFound.imdbRating, 7.3)
          assert.equal(showFound.rottenTomatoes, '94%')
          assert(showFound.sinopsis)
          assert(showFound.urlwithCover)
        })
    })
  })
})
