//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const omdb = require('../lib/tmdb');

describe('tmdb', function () {
    it('should return the film La guerra de las galaxias. Episodio IV: Una nueva esperanza', function () {
        return omdb.searchShow('Star wars', '1977')
            .then(response => {
                // console.log('Response: ', response);
                assert.equal(response.results[0].title, 'La guerra de las galaxias. Episodio IV: Una nueva esperanza')
            })
    });

    it('not should return the film La guerra de las galaxias. Episodio IV: Una nueva esperanza', function () {
        return omdb.searchShow('Star way', '2977')
            .then(response => {
                //console.log('Response: ', response);
                assert.equal(response.total_results, '0')
            })
    });

});