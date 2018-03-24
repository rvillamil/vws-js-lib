//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const omdb = require('../lib/omdb');

describe('omdb', function () {
    it('should return the film Star Wars IV', function () {
        return omdb.searchShow('Star wars', '1977')
            .then(response => {
                //console.log('Response: ', response);
                assert.equal(response.Title, 'Star Wars: Episode IV - A New Hope')
                assert.equal(response.Year, '1977')
            })
    });

    it('not should return the film Star Wars IV', function () {
        return omdb.searchShow('Star way', '2977')
            .then(response => {
                //console.log('Response: ', response);
                assert.equal(response.Response, 'False')
            })
    });
});