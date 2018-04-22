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
    var favoriteRepository = new FavoriteRepository('vws-db');

    describe('#findAll()', function () {

        it('Should load two Collection', function () {

            var showCollection1 = new ShowCollection()
            showCollection1.name = "hola/mola_1"

            var showCollection2 = new ShowCollection()
            showCollection2.name = "hola/mola_2"

            favoriteRepository.save(showCollection1)
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.save(showCollection2)
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.findAll().then(
                showCollectionList => {
                    assert.equal(showCollectionList.length, 2)
                }
            )
            return favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 2)
                }
            )
        });


        it('Not Should save duplicated collection name', function () {

            var showCollection1 = new ShowCollection()
            showCollection1.name = "hola/mola_1"

            var showCollection2 = new ShowCollection()
            showCollection2.name = "hola/mola_1"

            favoriteRepository.save(showCollection1)
                .catch(err => {
                    assert(err)
                })

            favoriteRepository.save(showCollection2)
                .catch(err => {
                    assert(err)
                })

            favoriteRepository.findAll().then(
                showCollectionList => {
                    assert.equal(showCollectionList.length, 1)
                }
            )

            return favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 1)
                }
            )
        });

    });

    describe('#delete()', function () {

        it('Should persistir two Collection more and delete one', function () {

            var showCollection1 = new ShowCollection()
            showCollection1.name = "hola/mola_1"

            var showCollection2 = new ShowCollection()
            showCollection2.name = "hola/mola_2"

            favoriteRepository.save(showCollection1)
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.save(showCollection2)
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.findAll().then(
                showCollectionList => {
                    assert.equal(showCollectionList.length, 2)
                })

            favoriteRepository.delete("hola/mola_2")
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.findAll().then(
                showCollectionList => {
                    assert.equal(showCollectionList.length, 1)
                }
            ).catch(err => {
                console.error("ERROR!" + err)
                assert.ok(1 == 0) // Forzamos el pete del test
            })

            return favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 1)
                }
            )

        });

    });

    describe('#findByCollectionName()', function () {

        it('Should load one Collection by', function () {

            var showCollection1 = new ShowCollection()
            showCollection1.name = "hola/mola_1"

            var showCollection2 = new ShowCollection()
            showCollection2.name = "hola/mola_2"

            favoriteRepository.save(showCollection1)
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.save(showCollection2)
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.findByCollectionName('hola/mola_1').then(
                showCollectionList => {
                    assert.equal(showCollectionList.length, 1)
                }
            )
            return favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 2)
                }
            )
        });


        it('it should not load one Collection by collection name', function () {

            var showCollection1 = new ShowCollection()
            showCollection1.name = "hola/mola_1"

            var showCollection2 = new ShowCollection()
            showCollection2.name = "hola/mola_2"

            favoriteRepository.save(showCollection1)
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.save(showCollection2)
                .catch(err => {
                    console.error("ERROR!" + err)
                    assert.ok(1 == 0) // Forzamos el pete del test
                })

            favoriteRepository.findByCollectionName('hola/mola_3').then(
                showCollectionList => {
                    assert.equal(showCollectionList.length, 0)
                }
            )
            return favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 2)
                }
            )
        });

    });
});