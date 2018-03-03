//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const tumejortorrent_scraper = require('../lib/tumejortorrent');
const url = require("url");

describe('tumejortorrent', function () {
    describe('#parseVideoPremieres()', function () {

        it('should return a list with at least one valid url', function () {
            return tumejortorrent_scraper.parseVideoPremieres().then(function (urlList) {
                urlList.forEach(function (element) {
                    assert.ok(url.parse(element));
                    //console.log('URL: ' + element);
                });
                assert.ok(urlList.length > 1);
                console.log('urlList size:' + urlList.length);
            });
        });
    });

    describe('#parseBillboardFilms()', function () {

        it('should return a list with at least one valid url', function () {
            return tumejortorrent_scraper.parseBillboardFilms().then(function (urlList) {
                urlList.forEach(function (element) {
                    assert.ok(url.parse(element));
                });
                assert.ok(urlList.length > 1);
                console.log('urlList size:' + urlList.length);
            });
        });
    });

    describe('#parseShow()', function () {

        var urlWithFilm = 'http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/';

        it("should return the film 'coco' with all data", function () {
            return tumejortorrent_scraper.parseShow(urlWithFilm).then(function (show) {
                assert.equal(show.urlBase, 'http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/');
                assert.equal(show.title, 'Coco');
                assert.ok(show.description);
                assert.equal(show.quality, 'BluRay 720p X264 MKV');
                assert.equal(show.fileSize, '2.5 GB');
                assert.equal(show.urlwithCover, 'http://tumejortorrent.com/pictures/f/mediums/103770_-1518265235-coco--bluray-microhd.jpg');
                assert.equal(show.releaseDate, '10-02-2018');
                assert.equal(show.urltodownload, 'http://tumejortorrent.com/descargar-torrent/103770_-1518265235-coco--bluray-microhd/');
                // console.log("Show:'" + JSON.stringify(show) + "'");
            });
        });
    });

});