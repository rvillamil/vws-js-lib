// https://medium.com/data-scraper-tips-tricks/scraping-data-with-javascript-in-3-minutes-8a7cf8275b31
// https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7
// https: //github.com/request/request-promise
const rp = require('request-promise');
const cheerio = require('cheerio');


function parseVideoPremieres() {
    var urlList = [];

    const options = {
        uri: `http://tumejortorrent.com/peliculas-x264-mkv/`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return rp(options)
        .then(function ($) {
            $('.pelilist li a').each(function (index, element) {
                urlList[index] = {};
                urlList[index] = $(element).attr('href');
            });
            return urlList;
        })

        .catch(function (err) {
            console.log(err);
        });
}

function parseShow(urlWithShow) {
    var show = {}; // Init show Object

    const options = {
        uri: urlWithShow,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return rp(options)
        .then(function ($) {
            // URL base
            show.urlBase = urlWithShow;
            // Title
            $('.page-box h1 strong').each(function (index, element) {
                show.title = $(element).text().trim();
            });
            // TODO Session 
            // TODO episode
            // Description
            $('.descripcion_top').each(function (index, element) {
                show.description = $(element).text();
            });
            // Sinopsis
            $('.sinopsis').each(function (index, element) {
                show.sinopsis = $(element).text();
            });
            // TODO quality
            // TODO URLWithCover
            // TODO filesize
            // TODO releaseDate
            // TODO URLToDownload
            return show;
        })
        .catch(function (err) {
            console.log(err);
        });
}

// Examplo use:
/*
var crawlVideoPremieres = function () {
    var showList = [];

    parseVideoPremieres()
        .then(function (urlList) {
            //console.log("RESULTADO: " + urlList);
            urlList.forEach(function (currentValue) {
                //console.log("URL:'" + currentValue + "'");
                parseShow(currentValue).then(function (show) {
                    //console.log("Show:'" + JSON.stringify(show) + "'");
                    showList.push(currentValue);
                });
            });
            return showList;
        });
};
*/