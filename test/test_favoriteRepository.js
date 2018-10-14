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
const Show = require('../lib/show');

function newTestShow(title, currentSession, currentEpisode) {
    var toShow = new Show()
    toShow.title = title
    toShow.currentSession = currentSession
    toShow.currentEpisode = currentEpisode
    toShow.urltodownload = `http://urltodownload_${title}_${currentSession}_${currentEpisode}`
    toShow.collectionName = `collection_${title}_${currentSession}`

    return toShow
}

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
                showCollection => {
                    assert.equal(showCollection.name, 'hola/mola_1')
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
                showCollection => {
                    assert.equal(showCollection, null)
                }
            )
            return favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 2)
                }
            )
        });

    });

    describe('#findShowByURLtodownload()', function () {



        it('Should find the url show in the Collection', function () {


            var showCollection1 = new ShowCollection()
            showCollection1.name = "showCollection1/5167"
            showCollection1.urlBase = "http://urlbase1"
            var show1 = newTestShow("showCollection1", "5", "2")
            var show2 = newTestShow("showCollection1", "5", "3")
            var show3 = newTestShow("showCollection1", "5", "4")
            showCollection1.push(show1);
            showCollection1.push(show2);
            showCollection1.push(show3);

            var showCollection2 = new ShowCollection()
            showCollection2.name = "showCollection2/5167"
            showCollection2.urlBase = "http://urlbase2"
            var showA = newTestShow("showCollection2", "5", "2")
            var showB = newTestShow("showCollection2", "5", "3")
            var showC = newTestShow("showCollection2", "5", "4")
            showCollection2.push(showA);
            showCollection2.push(showB);
            showCollection2.push(showC);


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
            favoriteRepository.findByCollectionName('showCollection2/5167').then(
                showCollection => {
                    assert.equal(showCollection.name, 'showCollection2/5167')
                }
            ).catch(err => {
                console.error("ERROR! " + err)
            })


            favoriteRepository.findShowByURLtodownload('http://urltodownload_showCollection2_5_3').then(
                show => {
                    //console.log (`SHOW: ${JSON.stringify(show)}`)
                    assert.equal(show.urltodownload, 'http://urltodownload_showCollection2_5_3')
                }
            ).catch(err => {
                console.error("ERROR! " + err)
            })

            favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 2)
                }
            )

        });

        it('Should not find the url show in the Collection', function () {
            var showCollection1 = new ShowCollection()
            showCollection1.name = "showCollection1/5167"
            showCollection1.urlBase = "http://urlbase1"
            var show1 = newTestShow("showCollection1", "5", "2")
            var show2 = newTestShow("showCollection1", "5", "3")
            var show3 = newTestShow("showCollection1", "5", "4")
            showCollection1.push(show1);
            showCollection1.push(show2);
            showCollection1.push(show3);

            var showCollection2 = new ShowCollection()
            showCollection2.name = "showCollection2/5167"
            showCollection2.urlBase = "http://urlbase2"
            var showA = newTestShow("showCollection2", "5", "2")
            var showB = newTestShow("showCollection2", "5", "3")
            var showC = newTestShow("showCollection2", "5", "4")
            showCollection2.push(showA);
            showCollection2.push(showB);
            showCollection2.push(showC);


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

            favoriteRepository.findShowByURLtodownload('http://urltodownload_showCollection6_5_3').then(
                show => {
                    //console.log (`SHOW 2: ${JSON.stringify(show)}`)
                    assert.equal(show, null)
                }
            ).catch(err => {
                console.error("ERROR! " + err)
            })

            return favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 2)
                }
            )
        });


    });

    describe('#updateCollectionWithNewShow()', function () {

        it('Should update with new show in the Collection 2', function () {

            var showCollection1 = new ShowCollection()
            showCollection1.name = "showCollection1/567"
            showCollection1.urlBase = "http://urlbase1"
            var show1 = newTestShow("showCollection1", "5", "2")
            var show2 = newTestShow("showCollection1", "5", "3")
            var show3 = newTestShow("showCollection1", "5", "4")
            showCollection1.push(show1);
            showCollection1.push(show2);
            showCollection1.push(show3);

            var showCollection2 = new ShowCollection()
            showCollection2.name = "showCollection2/567"
            showCollection2.urlBase = "http://urlbase2"
            var showA = newTestShow("showCollection2", "5", "1")
            var showB = newTestShow("showCollection2", "5", "2")
            var showC = newTestShow("showCollection2", "5", "3")
            showCollection2.push(showA);
            showCollection2.push(showB);
            showCollection2.push(showC);


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

            var newShow = newTestShow("showCollection2", "5", "4")

            // Imprimimos antes..
            /*
            favoriteRepository.findByCollectionName('showCollection2/567').then(
                showCollection => {
                    console.log(`showCollection antes ${JSON.stringify(showCollection)}`)
                }
            )
 
           favoriteRepository.findAll().then(
            showCollectionList => {
                showCollectionList.forEach(element => {
                    console.log(`showCollectionList  Antes ${JSON.stringify(element)}\n`)
                });
              
            })
            */
            favoriteRepository.updateCollectionWithNewShow('showCollection2/567', newShow).then(
                showCollection => {
                    assert.equal(showCollection.shows.length, 4)
                }
            ).catch(err => {
                console.error("ERROR! " + err)
            })

            // Imprimimos despues..
            /*
            favoriteRepository.findByCollectionName('showCollection2/567').then(
                showCollection => {
                    console.log(`showCollection DESPUES ${JSON.stringify(showCollection)}`)
                }
            )
            
            favoriteRepository.findAll().then(
                showCollectionList => {
                    showCollectionList.forEach(element => {
                        console.log(`showCollectionList despues  ${JSON.stringify(element)}\n`)
                    });

                })
            */
        });

        it('Should removed the objects to test', function () {

            return favoriteRepository.deleteAll().then(
                numRemoved => {
                    assert.equal(numRemoved, 2)
                }
            )
        });


    });
});