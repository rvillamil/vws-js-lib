const omdb = require('../lib/omdb');

//
// Example use
//
omdb.searchShow('Star wars', '1977')
    .then(function (response) {
        console.log('Response: ', response);
    })
    .catch(function (err) {
        console.log('Error: ' + err);
    });

omdb.searchShow('No existe', '1977')
    .then(function (response) {
        console.log('Response: ', response);
    })
    .catch(function (err) {
        console.log('Error: ' + err);
    });