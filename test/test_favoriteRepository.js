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
var ShowCollection = require('../lib/showCollection');
var FavoriteRepository = require('../lib/favoriteRepository');


describe('favoriteRepository', function () {

    describe('#findAll()', function () {
        var favoriteRepository = new FavoriteRepository('vws-db');

        it('Should load two Collection', function () {

            var showCollection1 = new ShowCollection()
            showCollection1.name = "hola/mola_1"

            var showCollection2 = new ShowCollection()
            showCollection2.name = "hola/mola_2"

            favoriteRepository.save(showCollection1)
                .catch(showCollectionSaved => {
                    console.error("Problem on save!")
                })

            favoriteRepository.save(showCollection2)
                .catch(showCollectionSaved => {
                    console.error("Problem on save!")
                })

            return favoriteRepository.findAll().then(
                showCollectionList => {
                    assert.equal(showCollectionList.length, 2)
                }
            )
        });


        it('Not Should save duplicated collection name', function () {

            var showCollection1 = new ShowCollection()
            showCollection1.name = "hola/mola_2"

            favoriteRepository.save(showCollection1)
                .catch(err => {
                    assert(err)
                    //console.error(err)
                })

            return favoriteRepository.findAll().then(
                showCollectionList => {
                    assert.equal(showCollectionList.length, 2)
                }
            )
        });
    });
});