//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const Show = require('../lib/show');

function newTestShow(title, currentSession, currentEpisode) {
    var toShow = new Show()
    toShow.title = title
    toShow.currentSession = currentSession
    toShow.currentEpisode = currentEpisode
    toShow.urltodownload = `http://urltodownload_${title}_${currentSession}_${currentEpisode}`

    return toShow
}

describe('show object', function () {

    describe('#newTVShowLinks(showList)', function () {

        favoritesList = [];

        var toShow = newTestShow("TVShow", "5", "1")
        var fromShow1 = newTestShow("TVShow", "5", "2")
        var fromShow2 = newTestShow("TVShow", "5", "3")
        var fromShow3 = newTestShow("TVShow", "5", "4")

        favoritesList.push(fromShow1);
        favoritesList.push(fromShow2);
        favoritesList.push(fromShow3);

        it('Should add the episode list from shows to show', function () {
            // console.log(`toShow antes  --> ${JSON.stringify(toShow)}\n\n`)
            toShow.newTVShowLinks(favoritesList)

            assert.equal(toShow.tvShowLinks[0].session, "5");
            assert.equal(toShow.tvShowLinks[0].episode, "2");
            assert.equal(toShow.tvShowLinks[0].urltodownload, "http://urltodownload_TVShow_5_2");

            assert.equal(toShow.tvShowLinks[1].session, "5");
            assert.equal(toShow.tvShowLinks[1].episode, "3");
            assert.equal(toShow.tvShowLinks[1].urltodownload, "http://urltodownload_TVShow_5_3");

            assert.equal(toShow.tvShowLinks[2].session, "5");
            assert.equal(toShow.tvShowLinks[2].episode, "4");
            assert.equal(toShow.tvShowLinks[2].urltodownload, "http://urltodownload_TVShow_5_4");
        });
    });
});