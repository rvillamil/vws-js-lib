const tumejortorrent = require('../lib/tumejortorrent');

//
// Example use
//
function crawlShowFromUrl(url) {

    return tumejortorrent.crawlShow(url)
        .then(show => {
            console.log("URL whith show -->" + url);
            console.log(`Show crawled  --> ${JSON.stringify(show)}\n\n`)
        });
}

tumejortorrent.crawlURLsWithBillboardFilms(2)
    .then(
        urlList => {
            urlList.forEach(
                url => {
                    return crawlShowFromUrl(url);
                }
            )
            return urlList;
        }
    ).catch(function (err) {
        console.log('Error: ' + err);
    });

tumejortorrent.crawlURLsWithVideoPremieres(2)
    .then(
        urlList => {
            urlList.forEach(
                url => {
                    return crawlShowFromUrl(url);
                }
            )
            return urlList;
        }
    ).catch(function (err) {
        console.log('Error: ' + err);
    });


tumejortorrent.crawlEpisodesURL('erase-una-vez/1490', 3)
    .then(
        urlList => {
            urlList.forEach(
                url => {
                    return crawlShowFromUrl(url);
                }
            )
            return urlList;
        }
    ).catch(function (err) {
        console.log('Error: ' + err);
    });


tumejortorrent.crawlShow("http://tumejortorrent.com/descargar/serie-en-hd/mom/temporada-5/capitulo-15/")
    .then(show => {
        console.log(`Show crawled  --> ${JSON.stringify(show)}\n\n`)
    });


tumejortorrent.crawlURLsWithTVShows(3).then(urlListWithLastEpisode => {
    urlListWithLastEpisode.forEach(url => {
        return crawlShowFromUrl(url);
    })
    return urlListWithLastEpisode;

}).catch(function (err) {
    console.log('Error: ' + err);
});