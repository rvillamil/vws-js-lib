// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const cheerio = require('cheerio')
const showSearcher = require('../../../lib/crawlers/dontorrent/searcher/showSearch')

describe('dontorrent/searcher/showSearch', function () {

    describe('#search()', function () {
        it('should return the first 10 shows for \'Star Wars\' string search (films and TVShows)', function () {
            //assert.equal(showCollection.shows.length, 6)
            return showSearcher.search('Star Wars', 10).then(
                shows => {
                    console.log(`Shows found: ${JSON.stringify(shows)}`)
                    assert(shows.length > 1)
                }
            )
        })
    })
})