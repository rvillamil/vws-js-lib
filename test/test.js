// assert es la libreria que nos permite verificar cosas
const assert = require('assert');
// instanciamos el codigo de nuestra libreria
const mylib = require('../lib');

// describe es la forma en la que describimos que pasara
describe('vws-js-lib', function() {
    describe('#parseVideoPremieres()', function() {

        it('should return a string representing a greeting', function() {
            assert.equal(mylib.parseVideoPremieres(), "Hello!");
        });
    });
});