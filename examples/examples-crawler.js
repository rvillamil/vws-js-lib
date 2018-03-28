const crawler = require('../lib/crawler');

//
// Example use
//
crawler.crawlBillboardFilms(
        show => console.log('Show: ', show))
    .then(
        showList => {
            console.log("crawler - Billboardfilms length: " + showList.length);
        }
    ).catch(function (err) {
        console.log('Error: ' + err);
    });