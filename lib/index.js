// https://medium.com/data-scraper-tips-tricks/scraping-data-with-javascript-in-3-minutes-8a7cf8275b31
// https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7
// https: //github.com/request/request-promise
const rp = require('request-promise');
const cheerio = require('cheerio');

var shows = [];
const options = {
    uri: `http://tumejortorrent.com/peliculas-x264-mkv/`,
    transform: function (body) {
        return cheerio.load(body);
    }
};


module.exports = {

    parseURLWithShows() {
        rp(options)
            .then(($) => {
                $('.pelilist li a').each(function (index, element) {
                    //console.log($(this).html());
                    //console.log($(element).attr('href'));
                    //console.log(index);
                    shows[index] = {};
                    shows[index] = $(element).attr('href');
                });

                console.log('URL:' + shows);
                return shows;
            })
            .catch((err) => {
                console.log(err);
            });

    }
};