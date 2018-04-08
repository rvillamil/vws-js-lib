//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const show = require('../lib/show');

describe('show', function () {
    describe('#mergeEpisodes()', function () {
        var toShow = new Show();
        toShow.title = "TVShow_1";
        toShow.currentSession = "5";
        toShow.currentEpisode = "1";
        toShow.urltodownload = "http://urltodownload_" + toShow.title;

        it('Should add the episode list from shows to show', function () {

        });
    });
});