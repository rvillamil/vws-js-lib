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
					var docFound = null
					if (records[0]) {
						records[0].shows.forEach(show => {
							if (show.urltodownload == urltodownload) {
								//console.log(`findShowByURLtodownload - show: " ${docFound.urltodownload}`)
								docFound = show
							}
						})
					}
					resolve(docFound);
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
			}, function (err, numReplaced) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - updateCollectionWithNewShow ${err}`));
				} else {
					//console.log(`updateCollectionWithNewShow - Numreplaces: '${numReplaced}'` )
					resolve(numReplaced);
				}
			});
		});
	}
	 
	updateCollectionWithNewShows(newShowCollectionName, newShows) {

		return new Promise((resolve, reject) => {
		
			newShows.forEach(newShow => { 
				return this.findShowByURLtodownload(newShow.urltodownload).then(
					show=>{
						if (show!=null){
							console.log(`Show with URL '${show.urltodownload}' already exist!. Not adding!!! '`)	
						} else {
							console.log(`Adding Show with URL '${newShow.urltodownload}' to ${newShowCollectionName}`)
							
							return this.updateCollectionWithNewShow (newShowCollectionName,newShow).then(
								numReplaced => {
									console.log(`REEMPLANZANDO '${numReplaced}'`)
								}
							).catch(err => {
								console.log(`ERROR! - updateCollectionWithNewShows - ${err}`)
							})
						}
					}
				).catch(err => {
					console.log(`ERROR! - updateCollectionWithNewShows ${err}`)
				})
			})
		});
	}
		/*
		newShows.forEach(newShow => {
			return this.findShowByURLtodownload(newShow.urltodownload).then(
				show => {
					if (show != null) {
						console.log(`Ya existe el show '${newShow.toStringSimple()}'. No lo anidadimos`)
					} else {
						console.log(`Tenemos que aniadir el show '${newShow.toStringSimple()}' a la coleccion ${newShowCollection.name}`)
	
						updateCollectionWithNewShow(newShowCollection.name, newShow).then(
							showCollectionUpdated => {
								console.log(`showCollectionUpdated '${showCollectionUpdated.shows.length}'`)
							}
						)
					}
				}
			).catch(err => {
				console.log(`ERROR! ${err}`)
			})
		})
		*/
	


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