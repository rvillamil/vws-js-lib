//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require("assert");
const descargas2020 = require("../lib/crawlers/descargas2020");

describe("descargas2020", function() {
    this.timeout(15000);
    describe("#crawlLinkToURLsWithVideoPremieres()", function() {
        it("should return a video premiere url list with 2 url", function() {
            return descargas2020.crawlLinkToURLsWithVideoPremieres(2).then(urls => {
                assert.ok(urls.length == 2);
            });
        });
    });

    describe("#crawlLinkToURLsWithBillboardFilms()", function() {
        it("should return a billboard film url list with 2 url", function() {
            return descargas2020
                .crawlLinkToURLsWithBillboardFilms(2)
                .then(urls => assert.ok(urls.length == 2));
        });
    });

    describe("#crawlLinkToURLsWithLatestTVShows()", function() {
        it("should return a tvshow url list with 3 url", function() {
            return descargas2020
                .crawlLinkToURLsWithLatestTVShows(3)
                .then(urls => assert.ok(urls.length == 3));
        });
    });

    describe("#crawlLinkToURLsWithEpisodes()", function() {
        it("should return a tvshow url list with 3 url", function() {
            return descargas2020
                .crawlLinkToURLsWithEpisodes(3, "erase-una-vez/1490")
                .then(urls => assert.ok(urls.length == 3));
        });
    });

    describe("#crawlDataShowFromPeliculasMKV()", function() {
        var urlWithFilm =
            "https://descargas2020.org/descargar/peliculas-x264-mkv/300/";

        it("should return the film '300' with all data", function() {
            return descargas2020.crawlDataShow(urlWithFilm).then(show => {
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(
                    show.urlBase,
                    "https://descargas2020.org/descargar/peliculas-x264-mkv/300/"
                );
                assert.equal(show.title, "300");
                assert.ok(show.description);
                assert.equal(show.quality, "BluRay 720p X264 MKV");
                assert.equal(show.fileSize, "2.7 GB");
                assert.equal(
                    show.urlwithCover,
                    "https://descargas2020.org/pictures/f/mediums/124384_-1562062800-300--BluRay-MicroHD.jpg"
                );
                assert.equal(show.releaseDate, "02-07-2019");
                assert.equal(
                    show.urltodownload,
                    "https://descargas2020.org/descargar-torrent/124384_-1562062800-300--BluRay-MicroHD"
                );
            });
        });
    });

    describe("#crawlDataShowFromURLWithTVShow()", function() {
        var urlWithTVShow =
            "https://descargas2020.org/descargar/serie-en-hd/elementary/temporada-7/capitulo-05/";

        it("should return the TVShow 'Elementary' 7x05", function() {
            return descargas2020.crawlDataShow(urlWithTVShow).then(show => {
                //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                assert.equal(
                    show.urlBase,
                    "https://descargas2020.org/descargar/serie-en-hd/elementary/temporada-7/capitulo-05/"
                );
                assert.equal(show.title, "Elementary");
                assert.equal(show.year, "2019");
                assert.equal(show.currentSession, "7");
                assert.equal(show.currentEpisode, "05");
                assert.ok(show.description);
                assert.ok(show.sinopsis);
                assert.equal(show.quality, "HDTV 720p");
                assert.equal(show.fileSize, "1.5 GB");
                assert.equal(
                    show.urlwithCover,
                    "https://descargas2020.org/pictures/c/thumbs/1618_elementary.jpg"
                );
                assert.equal(show.releaseDate, "02-07-2019");
                assert.equal(
                    show.urltodownload,
                    "https://descargas2020.org/descargar-torrent/124369_-1562035403-Elementary---Temporada-7--HDTV-720p-AC3-5-1"
                );
            });
        });

        it("should return the TVShow 'La resistencia' 2x156 (aunque la URL ponga temporada 1)", function() {
            var urlWithTVShow =
                "https://descargas2020.org/descargar/serie-en-hd/la-resistencia/temporada-1/capitulo-56-al-57/";

            return descargas2020.crawlDataShow(urlWithTVShow).then(show => {
                //console.log(`TVShow Crawled:  ${JSON.stringify(show)}\n\n`);
                assert.equal(
                    show.urlBase,
                    "https://descargas2020.org/descargar/serie-en-hd/la-resistencia/temporada-1/capitulo-56-al-57/"
                );
                assert.equal(show.title, "La Resistencia");
                assert.equal(show.year, "2019");
                assert.equal(show.currentSession, "2");
                assert.equal(show.currentEpisode, "156");
                assert.ok(show.description);
                assert.equal(show.quality, "HDTV 720p");
                assert.equal(show.fileSize, "3.9 GB");
                assert.equal(
                    show.urlwithCover,
                    "https://descargas2020.org/pictures/c/thumbs/4116_la-resistencia.jpg"
                );
                assert.equal(show.releaseDate, "05-07-2019");
                assert.equal(
                    show.urltodownload,
                    "https://descargas2020.org/descargar-torrent/124523_-1562334660-La-Resistencia---Temporada-2--HDTV-720p-AC3-5-1"
                );
            });
        });
    });
});