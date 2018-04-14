//
// npm modules required
//
var ShowCollection = require('./ShowCollection');
var Datastore = require('nedb') // https://github.com/louischatriot/nedb

// -------- DB Load -------------
const database_path = 'vws-db'
console.log(`Loading database from '${database_path}'`)
var db = new Datastore({
	filename: database_path,
	autoload: true
});

db.ensureIndex({
	fieldName: 'name',
	unique: true
});

// ------------------------------------------------------------
/**	
 * Repository for my favorites show objects
 * https://www.todojs.com/introduccion-a-nedb-una-base-de-datos-javascript-embebida/
 */
class FavoriteRepository {
	constructor() {}

	findAll() {
		return new Promise((resolve, reject) => {
			db.find({}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findAll ${err}`));
				} else {
					//console.log(`All ShowCollections: ${JSON.stringify(records)}`)
					resolve(records);
				}
			});
		});
	}

	save(showCollection) {
		return new Promise((resolve, reject) => {
			db.insert(showCollection, function (err, newShowCollection) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - save error:  ${err}`));
				} else {
					resolve(newShowCollection);
				}
			});
		});
	}

}

//
// Node modules
//
module.exports = FavoriteRepository;