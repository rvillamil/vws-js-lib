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
    describe('#crawlLinkToURLsWithVideoPremieres()', function () {
        it('should return a video premiere url list with 2 url', function () {
            return tumejortorrent.crawlLinkToURLsWithVideoPremieres(2).then(
                urls => assert.ok(urls.length == 2))
        });
    });

    describe('#crawlLinkToURLsWithBillboardFilms()', function () {
        it('should return a billboard film url list with 2 url', function () {
            return tumejortorrent.crawlLinkToURLsWithBillboardFilms(2).then(
                urls => assert.ok(urls.length == 2))
        });
    });

    describe('#crawlLinkToURLsWithLatestTVShows()', function () {
        it('should return a tvshow url list with 3 url', function () {
            return tumejortorrent.crawlLinkToURLsWithLatestTVShows(3).then(
                urls => assert.ok(urls.length == 3))
        });
    });

    describe('#crawlLinkToURLsWithEpisodes()', function () {
        it('should return a tvshow url list with 3 url', function () {
            return tumejortorrent.crawlLinkToURLsWithEpisodes(3, 'erase-una-vez/1490').then(
                urls => assert.ok(urls.length == 3))
        });
    });

    describe('#crawlDataShow()', function () {
        var urlWithFilm = 'http://tumejortorrent.com/descargar/peliculas-x264-mkv/coco-/bluray-microhd/';

        it("should return the film 'Coco' with all data", function () {
            return tumejortorrent.crawlDataShow(urlWithFilm).then(show => {
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

        var urlWithFilm2 = 'http://tumejortorrent.com/descargar/peliculas-castellano/estrenos-de-cine/ready-player-one-/ts-screener/'

        it("should return the film 'Ready Player oner' with all data", function () {
            return tumejortorrent.crawlDataShow(urlWithFilm2).then(show => {
                console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(show.title, 'Ready Player One');
                assert.equal(show.originalTitle, 'Ready Player One');
            });
        });


        var urlWithTVShow = 'http://tumejortorrent.com/descargar/serie-en-hd/erase-una-vez/temporada-7/capitulo-14/';

        it("should return the TVShow 'Erase una vez', 7x14 with all data", function () {
            return tumejortorrent.crawlDataShow(urlWithTVShow).then(show => {
                //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                assert.equal(show.urlBase, 'http://tumejortorrent.com/descargar/serie-en-hd/erase-una-vez/temporada-7/capitulo-14/');
                assert.equal(show.title, 'Erase una Vez');
                assert.equal(show.year, '2018');
                assert.equal(show.currentSession, '7');
                assert.equal(show.currentEpisode, '14');
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