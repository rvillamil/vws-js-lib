const tmdb = require('../lib/tmdb');

//
// Example use
//
tmdb.searchShow('Star wars', '1977')
    .then(show => {
        console.log('Show Star wars: ', show);
    })
    .catch(err => {
        console.log('Error: ' + err);
    });  

tmdb.searchShow('does not exist', '2076')
    .then(show => {
        console.log('Show does not exist: ', show);
    })
    .catch(err=> {
        console.log('Error: ' + err);
    });
