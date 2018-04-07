//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const tumejortorrent = require('../lib/tumejortorrent');

describe('tumejortorrent', function () {
    this.timeout(15000);
    describe('#crawlURLsWithVideoPremieres()', function () {
        it('should return a video premiere list with 2 url', function () {
            tumejortorrent.crawlURLsWithVideoPremieres(2).then(
                showList => assert.ok(showList.length == 2))
        });
    });

    describe('#crawlURLsWithBillboardFilms()', function () {
        it('should return a billboard film list with 2 url', function () {
            tumejortorrent.crawlURLsWithBillboardFilms(2).then(
                showList => assert.ok(showList.length == 2))
        });
    });

    describe('#crawlURLsWithBillboardFilms()', function () {
        it('should return a tvshow list with 3 url', function () {
            tumejortorrent.crawlURLsWithTVShows(3).then(
                showList => assert.ok(showList.length == 3))
        });
    });

    describe('#crawlEpisodesURL()', function () {
        it('should return a tvshow list with 3 url', function () {
            tumejortorrent.crawlEpisodesURL('erase-una-vez/1490', 3).then(
                showList => assert.ok(showList.length == 3))
        });
    });

    describe('#crawlShow()', function () {
        var urlWithFilm = 'http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/';

        it("should return the film 'Coco' with all data", function () {
            return tumejortorrent.crawlShow(urlWithFilm).then(show => {
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(show.urlBase, 'http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/');
                assert.equal(show.title, 'Coco');
                assert.ok(show.description);
                assert.equal(show.quality, 'BluRay 720p X264 MKV');
                assert.equal(show.fileSize, '2.5 GB');
                assert.equal(show.urlwithCover, 'http://tumejortorrent.com/pictures/f/mediums/103770_-1518265235-coco--bluray-microhd.jpg');
                assert.equal(show.releaseDate, '10-02-2018');
                assert.equal(show.urltodownload, 'http://tumejortorrent.com/descargar-torrent/103770_-1518265235-coco--bluray-microhd/');
                assert.equal(show.originalTitle, 'Coco');
            });
        });
    });

    describe('#crawlShow() - TVshow', function () {
        var urlWithTVShow = 'http://tumejortorrent.com/descargar/serie-en-hd/erase-una-vez/temporada-7/capitulo-14/';

        it("should return the TVShow 'Erase una vez', 7x14 with all data", function () {
            return tumejortorrent.crawlShow(urlWithTVShow).then(show => {
                //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                assert.equal(show.urlBase, 'http://tumejortorrent.com/descargar/serie-en-hd/erase-una-vez/temporada-7/capitulo-14/');
                assert.equal(show.title, 'Erase una Vez/Erase Una Vez - Temporada 7');
                assert.equal(show.year, '2018');
                assert.ok(show.description);
                assert.ok(show.sinopsis);
                assert.equal(show.quality, 'HDTV 720p');
                assert.equal(show.fileSize, '1.6 GB');
                assert.equal(show.urlwithCover, 'http://tumejortorrent.com/pictures/c/1490_erase-una-vez.jpg');
                assert.equal(show.releaseDate, '06-04-2018');
                assert.equal(show.urltodownload, 'http://tumejortorrent.com/descargar-torrent/105678_-1523024727-erase-una-vez---temporada-7--hdtv-720p-ac3-5-1/');
            });
        });
    });
});