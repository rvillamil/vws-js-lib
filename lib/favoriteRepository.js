//
// npm modules required
//
var ShowCollection = require('./ShowCollection');
var Database = require('./database') // https://github.com/louischatriot/nedb

// ------------------------------------------------------------
/**	
 * Repository for my favorites show objects
 * https://www.todojs.com/introduccion-a-nedb-una-base-de-datos-javascript-embebida/
 */
class FavoriteRepository {

	constructor(dbFilePath) {
		this.db = Database.createDB(dbFilePath)
		this.db.ensureIndex({
			fieldName: 'name', // 'ShowCollection' object field
			unique: true
		});
	}

	findAll() {
		return new Promise((resolve, reject) => {
			this.db.find({}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findAll ${err}`));
				} else {
					resolve(records);
				}
			});
		});
	}

	findByCollectionName(collectionName) {
		return new Promise((resolve, reject) => {
			this.db.find({
				name: collectionName
			}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findByCollectionName ${err}`));
				} else {
					resolve(records);
				}
			});
		});
	}

	save(showCollection) {
		return new Promise((resolve, reject) => {
			this.db.insert(showCollection, function (err, newShowCollection) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - save error:  ${err}`));
				} else {
					resolve(newShowCollection);
				}
			});
		});
	}


	delete(collectionName) {
		return new Promise((resolve, reject) => {
			this.db.remove({
				name: collectionName
			}, {
				multi: true
			}, function (err, numRemoved) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - delete error:  ${err}`));
				} else {
					resolve(numRemoved);
				}
			});
		});
	}

	deleteAll() {
		return new Promise((resolve, reject) => {
			this.db.remove({}, {
				multi: true
			}, function (err, numRemoved) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - delete error:  ${err}`));
				} else {
					resolve(numRemoved);
				}
			});
		});
	}
}

//
// Node modules
//
module.exports = FavoriteRepository;