// https://medium.com/data-scraper-tips-tricks/scraping-data-with-javascript-in-3-minutes-8a7cf8275b31
// https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7
// https: //github.com/request/request-promise
const rp = require('request-promise');
const cheerio = require('cheerio');
var urlList = [];

const options = {
    uri: `http://tumejortorrent.com/peliculas-x264-mkv/`,
    transform: function (body) {
        return cheerio.load(body);
    }
};

function parseVideoPremieres() {
    rp(options)
        .then(($) => {
            $('.pelilist li a').each(function (index, element) {
                //console.log($(this).html());
                urlList[index] = {};
                urlList[index] = $(element).attr('href');
                parseShow(urlList[index]);
            });
            // console.log('URL List: ' + urlList);
            return urlList;
        })

        .catch((err) => {
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

    rp(options)
        .then(($) => {
            // URL base
            show.urlBase = urlWithShow;
            // Title
            $('.page-box h1 strong').each(function (index, element) {
                show.title = $(element).text().trim();
            });
            // Session
            // episode
            // Description
            $('.descripcion_top').each(function (index, element) {
                show.description = $(element).text();
            });
            // Sinopsis
            $('.sinopsis').each(function (index, element) {
                show.sinopsis = $(element).text();
            });
            // quality
            // URLWithCover
            // filesize
            // releaseDate
            // URLToDownload
            console.log("");
            console.log(show);
        })
        .catch((err) => {
            console.log(err);
        });

}
parseVideoPremieres();
//var promise = parseVideoPremieres();
//console.log("RESULTADO: " + parseVideoPremieres());