//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const tumejortorrent = require('../lib/tumejortorrent');
const url = require("url");

describe('crawlShows', function () {

    describe('#crawlVideoPremieres()', function () {
        it('should return a list with at least one show', function () {
            tumejortorrent.crawlVideoPremieres(
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                }
            ).then(showList => assert.ok(showList.length >= 1))
        });
    });
    describe('#crawlBillboardFilms()', function () {
        it('should return a list with at least one show', function () {
            tumejortorrent.crawlBillboardFilms(
                show => {
                    assert(show.title);
                    assert(show.urltodownload);
                    // console.log("showObjectCrawled: " + JSON.stringify(showObjectCrawled));
                }
            ).then(showList => assert.ok(showList.length >= 1))
        });
    });

    describe('#crawlShow()', function () {
        var urlWithFilm = 'http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/';

        it("should return the film 'Coco' with all data", function () {
            return tumejortorrent.crawlShow(urlWithFilm).then(show => {
                assert.equal(show.urlBase, 'http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/');
                assert.equal(show.title, 'Coco');
                assert.ok(show.description);
                assert.equal(show.quality, 'BluRay 720p X264 MKV');
                assert.equal(show.fileSize, '2.5 GB');
                assert.equal(show.urlwithCover, 'http://tumejortorrent.com/pictures/f/mediums/103770_-1518265235-coco--bluray-microhd.jpg');
                assert.equal(show.releaseDate, '10-02-2018');
                assert.equal(show.urltodownload, 'http://tumejortorrent.com/descargar-torrent/103770_-1518265235-coco--bluray-microhd/');
                assert.equal(show.originalTitle, 'Coco');
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
            });
        });
    });

});