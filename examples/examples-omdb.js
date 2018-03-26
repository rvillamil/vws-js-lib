const omdb = require('../lib/omdb');

//
// Example use
//
omdb.searchShow('Star wars', '1977')
    .then(show => {
        console.log('Show Star wars: ', show);
    })
    .catch(err => {
        console.log('Error: ' + err);
    });


omdb.searchShow('does not exist', '2076')
    .then(show => {
        console.log('Show does not exist: ', show);
    })
    .catch(err=> {
        console.log('Error: ' + err);
    });
