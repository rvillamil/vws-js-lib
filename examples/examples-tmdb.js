const tmdb = require('../lib/tmdb');

//
// Example use
//
tmdb.searchShow('Star wars', '1977')
    .then(function (response) {
        console.log('Response: ', response);
    })
    .catch(function (err) {
        console.log('Error: ' + err);
    });

tmdb.searchShow('No existe', '1977')
    .then(function (response) {
        console.log('Response: ', response);
    })
    .catch(function (err) {
        console.log('Error: ' + err);
    });