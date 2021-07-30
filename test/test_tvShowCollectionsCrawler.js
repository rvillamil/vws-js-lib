// @ts-nocheck
/* eslint-disable no-undef */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const crawler = require('../lib/tvShowCollectionsCrawler')
// const ShowCollection = require('../lib/model/showCollection')
// const siteConstants = require('../lib/crawlers/pctmix/constants')
// const Show = require('../lib/model/show')

describe('tvShowCollectionsCrawler', function () {
  this.timeout(55000)

  describe('#crawlTVShowCollections()', () => {
    it('should return a TVShow list with three shows', () => crawler.crawlTVShowCollections(
      3,
      (show) => {
        assert(show.title)
        assert(show.urltodownload)
        assert.equal(show.error, 0)
        // console.log("TVShow: " + JSON.stringify(show))
      },
    ).then((shows) => assert.ok(shows.length == 3)))
  })
  /*
  describe('#crawlTVShowCollectionsBy()', () => {
    it('should return a TVShow collection list with 3 showscollection with 4 episodes every collecion from all torrent sites', () => {
      const showCollection1 = new ShowCollection()
      showCollection1.name = 'modern-family/2261'
      showCollection1.domain = siteConstants.DOMAIN
      showCollection1.url = `${siteConstants.URL_BASE_TVSHOWS_HD}modern-family/2261`

      const showCollection2 = new ShowCollection()
      showCollection2.name = 'arrow/1596'
      showCollection2.domain = siteConstants.DOMAIN
      showCollection2.url = `${siteConstants.URL_BASE_TVSHOWS_HD}arrow/1596`
      const showCollectionList = []
      showCollectionList.push(showCollection1)
      showCollectionList.push(showCollection2)
      //    showCollectionList.push(showCollection3)

      return crawler.crawlTVShowCollectionsBy(4, showCollectionList)
        .then((newShowCollectionList) => {
          assert.equal(newShowCollectionList.length, 2)
          assert.equal(newShowCollectionList[0].shows.length, 4)
          assert.equal(newShowCollectionList[1].shows.length, 4)
          //      assert.equal(newShowCollectionList[2].shows.length, 4)
        })
    })
  })
  */
})
