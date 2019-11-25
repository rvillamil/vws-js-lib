// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const cheerio = require('cheerio')
const ShowParser = require('../../lib/crawlers/dontorrent/showParser')

describe('dontorrent/showParser', function () {

    it('should parsear the table on the TVShow \'Mr Robot\'', function () {
        // http://www.howtocreate.co.uk/tutorials/jsexamples/syntax/prepareInline.html

        var tableData = '<table class=\"table table-sm table-striped text-center\" style=\"color: inherit\">\n<thead>\n<tr>\n<th scope=\"col\"><b class=\"bold\">Episodios<\/b><\/th>\n<th scope=\"col\"><\/th>\n<th scope=\"col\"><b class=\"bold\">Fecha<\/b><\/th>\n<th scope=\"col\"><b class=\"bold\">Clave<\/b><\/th>\n<\/tr>\n<\/thead>\n<tbody><tr>\n<td style=\'vertical-align: middle;\'>4x01 -<\/td>\n<td><a class=\"text-white bg-primary rounded-pill d-block shadow-sm text-decoration-none my-1 py-1\" style=\"font-size: 18px; font-weight: 500;\" href=\'\/\/blazing.network\/torrents\/series\/MR-Robot-4-HDTV_01.torrent\' download>Descargar<\/a><\/td>\n<td style=\'vertical-align: middle;\'>2019-10-19<\/td>\n<td style=\'vertical-align: middle;\'><a title=\"Sin Contraseña\"><i class=\"fa fa-unlock-alt\" style=\"color:#277a27;\"><\/i><\/a><\/td>\n<\/tr><tr>\n<td style=\'vertical-align: middle;\'>4x02 -<\/td>\n<td><a class=\"text-white bg-primary rounded-pill d-block shadow-sm text-decoration-none my-1 py-1\" style=\"font-size: 18px; font-weight: 500;\" href=\'\/\/blazing.network\/torrents\/series\/Mr_Robot_4_02.torrent\' download>Descargar<\/a><\/td>\n<td style=\'vertical-align: middle;\'>2019-10-26<\/td>\n<td style=\'vertical-align: middle;\'><a title=\"Sin Contraseña\"><i class=\"fa fa-unlock-alt\" style=\"color:#277a27;\"><\/i><\/a><\/td>\n<\/tr><tr>\n<td style=\'vertical-align: middle;\'>4x03 -<\/td>\n<td><a class=\"text-white bg-primary rounded-pill d-block shadow-sm text-decoration-none my-1 py-1\" style=\"font-size: 18px; font-weight: 500;\" href=\'\/\/blazing.network\/torrents\/series\/Mr-Robot-4-3-HDTV.torrent\' download>Descargar<\/a><\/td>\n<td style=\'vertical-align: middle;\'>2019-10-31<\/td>\n<td style=\'vertical-align: middle;\'><a title=\"Sin Contraseña\"><i class=\"fa fa-unlock-alt\" style=\"color:#277a27;\"><\/i><\/a><\/td>\n<\/tr><tr>\n<td style=\'vertical-align: middle;\'>4x04 -<\/td>\n<td><a class=\"text-white bg-primary rounded-pill d-block shadow-sm text-decoration-none my-1 py-1\" style=\"font-size: 18px; font-weight: 500;\" href=\'\/\/blazing.network\/torrents\/series\/Mr-Robot-4-4-HDTV.torrent\' download>Descargar<\/a><\/td>\n<td style=\'vertical-align: middle;\'>2019-11-08<\/td>\n<td style=\'vertical-align: middle;\'><a title=\"Sin Contraseña\"><i class=\"fa fa-unlock-alt\" style=\"color:#277a27;\"><\/i><\/a><\/td>\n<\/tr><tr>\n<td style=\'vertical-align: middle;\'>4x05 -<\/td>\n<td><a class=\"text-white bg-primary rounded-pill d-block shadow-sm text-decoration-none my-1 py-1\" style=\"font-size: 18px; font-weight: 500;\" href=\'\/\/blazing.network\/torrents\/series\/Mr-Robot-4-5-HDTV.torrent\' download>Descargar<\/a><\/td>\n<td style=\'vertical-align: middle;\'>2019-11-15<\/td>\n<td style=\'vertical-align: middle;\'><a title=\"Sin Contraseña\"><i class=\"fa fa-unlock-alt\" style=\"color:#277a27;\"><\/i><\/a><\/td>\n<\/tr><tr>\n<td style=\'vertical-align: middle;\'>4x06 -<\/td>\n<td><a class=\"text-white bg-primary rounded-pill d-block shadow-sm text-decoration-none my-1 py-1\" style=\"font-size: 18px; font-weight: 500;\" href=\'\/\/blazing.network\/torrents\/series\/Mr-Robot-4-6-HDTV.torrent\' download>Descargar<\/a><\/td>\n<td style=\'vertical-align: middle;\'>2019-11-22<\/td>\n<td style=\'vertical-align: middle;\'><a title=\"Sin Contraseña\"><i class=\"fa fa-unlock-alt\" style=\"color:#277a27;\"><\/i><\/a><\/td>\n<\/tr><\/tbody>\n<\/table>';

        var showCollection = ShowParser.parseTableWithTVShows(cheerio.load(tableData))
        assert.equal(showCollection.shows.length, 6)
    })
})