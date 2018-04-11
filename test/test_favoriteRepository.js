//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//

//
// npm modules requiered
//
const assert = require('assert');
var Show = require('../lib/show');
var FavoriteRepository = require('../lib/favoriteRepository');


describe('favoriteRepository', function () {
    describe('#save()', function () {

        it('Should persist one Show', function () {

            var favoriteRepository = new FavoriteRepository();
            var show = new Show();
            show.title = 'test_title_save_1';
            show.year = 'test_year_save_1';

            return favoriteRepository.save(show).then(
                newShow => {
                    assert.equal(show.year, newShow.year)
                    assert.equal(show.title, newShow.title)
                }
            );
        });
    });

});