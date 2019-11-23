//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const Show = require('../lib/model/show')
const ShowCollection = require('../lib/model/showCollection')

function newTestShow(title, currentSession, currentEpisode) {
    var toShow = new Show()
    toShow.title = title
    toShow.currentSession = currentSession
    toShow.currentEpisode = currentEpisode
    toShow.urltodownload = `http://urltodownload_${title}_${currentSession}_${currentEpisode}`
    toShow.collectionName = `collection_${title}_${currentSession}`

    return toShow
}

describe('ShowCollection', function () {

    describe('#push(show)', function () {

        var showCollection = new ShowCollection()
        showCollection.name = 'collection_TVShow_5'
        showCollection.url = 'http://urlbase'

        var show1 = newTestShow('TVShow', '5', '2')
        var show2 = newTestShow('TVShow', '5', '3')
        var show3 = newTestShow('TVShow', '5', '4')


        it('Should add three diferentes shows to ShowCollection', function () {
            showCollection.push(show1)
            showCollection.push(show2)
            showCollection.push(show3)

            // console.log(`ShowCollection antes  --> ${showCollection.toStringSimple()}\n\n`)

            var shows = showCollection.shows

            assert.equal(shows[0].currentSession, '5')
            assert.equal(shows[0].currentEpisode, '2')
            assert.equal(shows[0].urltodownload, 'http://urltodownload_TVShow_5_2')
            assert.equal(shows[0].collectionName, 'collection_TVShow_5')

            assert.equal(shows[1].currentSession, '5')
            assert.equal(shows[1].currentEpisode, '3')
            assert.equal(shows[1].urltodownload, 'http://urltodownload_TVShow_5_3')
            assert.equal(shows[0].collectionName, 'collection_TVShow_5')

            assert.equal(shows[2].currentSession, '5')
            assert.equal(shows[2].currentEpisode, '4')
            assert.equal(shows[2].urltodownload, 'http://urltodownload_TVShow_5_4')
            assert.equal(shows[0].collectionName, 'collection_TVShow_5')
        })
    })

})