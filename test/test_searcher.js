//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const searcher = require('../lib/searcher')
const SearchResult = require('../lib/model/searchResult')

describe('searcher', function () {
    this.timeout(55000)

    describe('#searchShows()', function () {
        it('should return a search result list with 3 shows', function () {
            return searcher.searchShows(
                'Star Wars',
                3,
                searchResult => {
                    console.log(`searchResult: ${JSON.stringify(searchResult)}`)
                }
            ).then(searchResults => assert.ok(searchResults.length == 3))
        })
    })
})