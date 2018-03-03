const rp = require('request-promise');
const cheerio = require('cheerio');

// Export functions NPM 
exports.parseVideoPremieres = function () {
    return parseFilms('http://tumejortorrent.com/peliculas-x264-mkv/');
}

exports.parseBillboardFilms = function () {
    return parseFilms('http://tumejortorrent.com/estrenos-de-cine/');
}

exports.parseShow = function (urlWithShow) {
    return parseShow(urlWithShow);
}

// ------------------------------
function parseFilms(urlWithFilms) {
    var urlList = [];

    const options = {
        uri: urlWithFilms,
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
            show.title = $('.page-box h1 strong').text().trim();
            // TODO session 
            // TODO episode
            // Description
            show.description = $('.descripcion_top').text();
            // Sinopsis
            show.sinopsis = $('.sinopsis').text();
            //  Quality : Primera cadena entre [ ]
            var matches = $('.page-box h1').text().match(/\[(.*?)\]/);
            if (matches) {
                show.quality = matches[1];
            }
            // URLWithCover
            show.urlwithCover = $('.entry-left a img').attr("src");
            // releaseDate and filesize
            $('.entry-left .imp').each(function (index, element) {
                if (index == 0) {
                    show.fileSize = $(element).text().split('Size:')[1].trim();
                }
                if (index == 1) {
                    show.releaseDate = $(element).text().split('Fecha:')[1].trim();
                }
            });
            // URLToDownload
            show.urltodownload = parseURLToDownload($.html());

            return show;
        })
        .catch(function (err) {
            console.log(err);
        });
}

function parseURLToDownload(htmlText) {
    var matches = htmlText.match("window\.location\.href.+=.+\"(.+)\"(;)");
    if (matches) {
        urltodownload = matches[1];
    }
    return urltodownload;
}

// ------------- Examples -------
var crawlVideoPremieres = function () {

    parseFilms('http://tumejortorrent.com/peliculas-x264-mkv/')
        .then(function (urlList) {
            urlList.forEach(function (currentValue) {
                parseShow(currentValue).then(function (show) {
                    console.log("Show:'" + JSON.stringify(show) + "'");
                });
            });

        });
};

var crawlBillboardFilms = function () {

    parseFilms('http://tumejortorrent.com/estrenos-de-cine/')
        .then(function (urlList) {
            urlList.forEach(function (currentValue) {
                parseShow(currentValue).then(function (show) {
                    console.log("Show:'" + JSON.stringify(show) + "'");
                });
            });

        });
};

//crawlVideoPremieres();
//crawlBillboardFilms();