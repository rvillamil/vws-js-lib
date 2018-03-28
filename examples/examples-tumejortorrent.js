const tumejortorrent = require('../lib/tumejortorrent');

//
// Example use
//
tumejortorrent.crawlBillboardFilms(
        show => console.log('Show: ', show))
    .then(
        showList => {
            console.log("billboardfilms length: " + showList.length);
        }
    ).catch(function (err) {
        console.log('Error: ' + err);
    });