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
            // https://pctmix1.com/descargar/peliculas-x264-mkv/superdetective-en-hollywood-2-1987-/bluray-microhd/
            var urlWithFilm=`https://${siteConstants.DOMAIN}/descargar/peliculas-x264-mkv/superdetective-en-hollywood-2-1987-/bluray-microhd/`
                            
            
            return filmCrawler.crawlDataFilm(urlWithFilm).then(show => {
                //console.log("Show crawled:'" + JSON.stringify(show) + "'");
                assert.equal(show.urlBase, urlWithFilm)
                assert.equal(show.title, 'Superdetective en hollywood 2')
                //assert.ok (show.originalTitle)
                assert.ok(show.sinopsis)
                assert.ok(show.description)
                assert.equal(show.quality, 'BluRay 720p X264 MKV')
                assert.equal(show.fileSize, '2.7 GB')
                assert.equal(show.releaseDate, '07-07-2021')
                assert.equal(
                    show.urlwithCover,
                    'https://pctmix1.com/pictures/f/mediums/153738_-1625634500-Superdetective-en-Hollywood-2--1987---BluRay-MicroHD.jpg'
                )
                assert.equal(show.year, '1987')
                assert.equal(
                    show.urltodownload,
                    'https://pctmix1.com/descargar-torrent/153738_-1625634500-Superdetective-en-Hollywood-2--1987---BluRay-MicroHD'
                    
                )

                //assert.equal(show.originalTitle, '')
            })
        })
    })
})