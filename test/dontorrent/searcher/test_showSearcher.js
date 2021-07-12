// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const showSearcher = require('../../../lib/crawlers/dontorrent/searcher/showSearcher')

//
// Constants
//
const SearchResultConstants = require('../../../lib/model/searchResultConstants')

describe('dontorrent/searcher/showSearcher', function () {

  describe('#search()', function () {
    it('should return the first 4 shows for \'Star Wars\' string search (films and TVShows)', function () {
      //assert.equal(showCollection.shows.length, 6)
      return showSearcher.search('Star Wars', 4).then(
        searchResult => {
          //console.log(`searchResult found: ${JSON.stringify(searchResult)}`)
          assert.equal(searchResult[0].urlWithShow, 'https://dontorrent.app/pelicula/19942/Han-Solo-Una-historia-de-Star-Wars-3D')
          assert.equal(searchResult[0].type, SearchResultConstants.FILM)
          assert.equal(searchResult.length, 4)
        }
      )
    })
  })
})