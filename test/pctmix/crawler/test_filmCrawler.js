// @ts-nocheck
/* eslint-disable no-console */
//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert')
const filmCrawler = require('../../../lib/crawlers/pctmix/crawler/filmCrawler')
const siteConstants = require('../../../lib/crawlers/pctmix/constants')

describe('pctmix/crawler/filmCrawler', function () {

    describe('#crawlDataFilm()', function () {
     
        it('should return the film \'Richard dice adios \' with all data', function () {
            //https://pctmix.com/descargar/peliculas-x264-mkv/richard-dice-adios-2021-/bluray-microhd/
            var urlWithFilm=`https://${siteConstants.DOMAIN}/descargar/peliculas-x264-mkv/richard-dice-adios-2021-/bluray-microhd/`
                            
            
            return filmCrawler.crawlDataFilm(urlWithFilm).then(show => {
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(show.urlBase, urlWithFilm)
                assert.equal(show.title, 'Richard dice adios')
                //assert.ok (show.originalTitle)
                assert.ok(show.sinopsis)
                assert.ok(show.description)
                assert.equal(show.quality, 'BluRay 720p X264 MKV')
                assert.equal(show.fileSize, '2.7 GB')
                assert.equal(show.releaseDate, '25-02-2021')
                assert.equal(
                    show.urlwithCover,
                    'https://pctmix.com/pictures/f/mediums/147287_-1614253519-Richard-dice-adios--2021---BluRay-MicroHD.jpg'
                )
                assert.equal(show.year, '2021')
                assert.equal(
                    show.urltodownload,
                    //'https://pctmix.com/download/143973_-1606890987-Ejecucion-inminente--1999---BluRay-MicroHD.torrent'                    
                    'https://pctmix.com/descargar-torrent/147287_-1614253519-Richard-dice-adios--2021---BluRay-MicroHD/'
                )

                //assert.equal(show.originalTitle, '')
            })
        })
    })
})