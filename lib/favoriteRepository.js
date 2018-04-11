//
// npm modules required
//
var Show = require('./show');
var Datastore = require('nedb') // https://github.com/louischatriot/nedb

// -------- DB Load -------------
const database_path = '/tmp/vws-db'
console.log(`Loading database from '${database_path}'`)
var db = new Datastore({
	filename: database_path,
	autoload: true
});

// ------------------------------------------------------------
/**	
 * Repository for my favorites show objects
 * https://www.todojs.com/introduccion-a-nedb-una-base-de-datos-javascript-embebida/
 */
class FavoriteRepository {
	constructor() {}

	findAllFavoritesShows() {
		return new Promise((resolve, reject) => {
			db.find({}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findAllFavoritesShows ${err}`));
				} else {
					resolve(records);
				}
			});
		});
	}

	findShowByTittle(theTitle) {
		return new Promise((resolve, reject) => {
			db.find({
				title: theTitle
			}, function (err, record) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findShowByTittle ${err}`));
				} else {
					resolve(record);
				}
			});
		});
	}

	save(show) {
		return new Promise((resolve, reject) => {
			db.insert(show, function (err, newShow) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - insert error:  ${err}`));
				} else {
					resolve(newShow);
				}
			});
		});
	}
}

//
// Node modules
//
module.exports = FavoriteRepository;