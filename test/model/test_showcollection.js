/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert')
const Show = require('../../lib/model/show')
const ShowCollection = require('../../lib/model/showCollection')

function newTestShow(title, currentSession, currentEpisode) {
  const toShow = new Show()
  toShow.title = title
  toShow.currentSession = currentSession
  toShow.currentEpisode = currentEpisode
  toShow.urltodownload = `http://urltodownload_${title}_${currentSession}_${currentEpisode}`
  toShow.collectionName = `collection_${title}_${currentSession}`

  return toShow
}

describe('model/ShowCollection', () => {
  describe('#push(show)', () => {
    const showCollection = new ShowCollection()
    showCollection.name = 'collection_TVShow_5'
    showCollection.url = 'http://urlbase'

    const show1 = newTestShow('TVShow', '5', '2')
    const show2 = newTestShow('TVShow', '5', '3')
    const show3 = newTestShow('TVShow', '5', '4')

    it('Should add three diferentes shows to ShowCollection', () => {
      showCollection.push(show1)
      showCollection.push(show2)
      showCollection.push(show3)

      // console.log(`ShowCollection antes  --> ${showCollection.toStringSimple()}\n\n`)

      const { shows } = showCollection

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
