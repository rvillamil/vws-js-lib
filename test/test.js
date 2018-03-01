// assert es la libreria que nos permite verificar cosas
const assert = require('assert');
// instanciamos el codigo de nuestra libreria
const tumejortorrent_scraper = require('../lib/tumejortorrent');

// describe es la forma en la que describimos que pasara

describe('testeo', function () {
    describe('#testeo', function () {
        it('Should return kaka', function () { // no done
            data = tumejortorrent_scraper.test('mola');
            expect(data).to.equal('hola mola');

        });
    });
});

describe('parseFilms', function () {
    describe('#parseFilms()', function () {
        it('Should return list url', function () { // no done

            return tumejortorrent_scraper.parseFilms('http://tumejortorrent.com/peliculas-x264-mkv/').then(function (urlList) {
                expect(urlList.length).to.equal(10);
            });

            /*
            return shapeshift.getRate(pair).then(function (data) {
                expect(data.pair).to.equal(pair);
                expect(data.rate).to.have.length(400);
            }); // no catch, it'll figure it out since the promise is rejected
       */
        });
    });
});