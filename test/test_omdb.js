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
    it('Should return one Show object with the film Star Wars', function () {
        return omdb.searchShow('Star wars', '1977')
            .then(show => {
                //console.log('Show: ', show);
                assert.equal(show.title, 'Star wars');
                assert.equal(show.year, '1977');    
                assert.equal(show.error, 'none');                    
            })
    });

    it('Should return one Show object with error description', function () {
        return omdb.searchShow('Star way', '2977')
            .then(show => {
                //console.log('Show: ', show);
                assert.notEqual (show.error, 'none');                 
            })
    });
});