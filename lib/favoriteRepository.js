//
// npm modules required
//
var ShowCollection = require('./showCollection')
const Show = require('./show')
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
					resolve(records[0]);
				}
			});
		});
	}

	findShowByURLtodownload(urltodownload) {
		return new Promise((resolve, reject) => {
			this.db.find({
				"shows.urltodownload": urltodownload
			}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findShowByURLtodownload ${err}`));
				} else {
					var showFound = new Show()
					if (records[0]) {
						records[0].shows.forEach(show => {
							if (show.urltodownload == urltodownload) {
								showFound = show
							}
						})
					}
					//console.log(`findShowByURLtodownload - show: " ${showFound.urltodownload}`)
					resolve(showFound);
				}
			});
		});
	}

	updateCollectionWithNewShow(newShowCollectionName, newShow) {

		return new Promise((resolve, reject) => {
			this.db.update({
				name: newShowCollectionName
			}, {
				$addToSet: {
					"shows": newShow
				}
			}, function () {});
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