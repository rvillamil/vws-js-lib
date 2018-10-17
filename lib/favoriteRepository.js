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

	findAll(limit) {
		return new Promise((resolve, reject) => {
			this.db.find({}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findAll ${err}`));
				} else {
					if (limit != undefined) {
						resolve(records.slice(0, limit))
					} else {
						resolve(records);
					}
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

	findShowCollectionWithShowWithURLtodownload(urltodownload) {
		return new Promise((resolve, reject) => {
			this.db.find({
				"shows.urltodownload": urltodownload
			}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findShowCollectionWithShowWithURLtodownload ${err}`));
				} else {
					resolve(records[0]);
				}
			});
		});
	}

	updateAllreadyDownloadedShowByURL(urltodownload, value) {

		return this.findShowCollectionWithShowWithURLtodownload(urltodownload).then(
			docFound => {
				if (!docFound) {
					//console.log(`updateAllreadyDownloadedShowByURL - Showcollection not found!!`)
					return null
				} else {
					//console.log(`updateAllreadyDownloadedShowByURL - ShowCollection found ${docFound.name}`)
					return docFound
				}
			}
		).then(docFound => {
			if (docFound) {
				return this._updateAllreadyDownloadedShowByURL(docFound, urltodownload, value).then(
					numReplaced => {
						//console.log('Numreplaced ' + numReplaced)
						return numReplaced
					})
			} else {
				return 0
			}
		}).catch(err => {
			console.error(`ERROR! FavoriteRepository - updateAllreadyDownloadedShowByURL ${err}`)
		})
	}

	updateCollectionWithNewShow(newShowCollectionName, newShow) {

		return this.findShowByURLtodownload(newShow.urltodownload).then(
			docFound => {
				if (!docFound) {
					console.log(`updateCollectionWithNewShow - Show not found!!`)
					return newShow
				} else {
					console.log(`updateCollectionWithNewShow - Show found ${docFound.urltodownload}`)
					return null
				}
			}
		).then(theShow => {
			if (theShow) {
				return this._updateCollectionWithNewShow(newShowCollectionName, theShow).then(
					numReplaced => {
						//console.log('Numreplaced ' + numReplaced)
						return numReplaced
					})
			} else {
				return 0
			}
		}).catch(err => {
			console.error(`ERROR! FavoriteRepository - updateCollectionWithNewShow ${err}`)
		})
	}

	updateCollectionWithNewShows(newShowCollectionName, newShows) {

		var actions = newShows.map(showToAdd => {
			return this.updateCollectionWithNewShow(newShowCollectionName, showToAdd).then(
				numReplaced => {
					return numReplaced
				}
				// Nothing ...
			).catch(err => {
				console.log(`ERROR! - updateCollectionWithNewShows - ${err}`)
			})
		})
		return Promise.all(actions).then(
				arrayWithReplaced => {
					var numReplacedTotal = 0
					for (let i = 0; i < arrayWithReplaced.length; i++) {
						numReplacedTotal += arrayWithReplaced[i]
					}
					console.log(`updateCollectionWithNewShows - numReplacedTotal:'${numReplacedTotal}'`)
					return numReplacedTotal
				}
			)
			.catch(err => {
				console.log(`ERROR! - updateCollectionWithNewShows - ${err}`)
			})
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

	_updateCollectionWithNewShow(newShowCollectionName, newShow) {

		return new Promise((resolve, reject) => {
			this.db.update({
				name: newShowCollectionName
			}, {
				$addToSet: {
					"shows": newShow
				}
			}, function (err, numReplaced) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - _updateCollectionWithNewShow ${err}`));
				} else {
					//console.log(`updateCollectionWithNewShow - Numreplaces: '${numReplaced}'`)
					resolve(numReplaced);
				}
			})
		});
	}

	_updateAllreadyDownloadedShowByURL(docWithShowCollection, urltodownload, value) {
		// Actualizamos el valor del campo con el show con la url adecuada
		docWithShowCollection.shows.forEach(show => {
			if (show.urltodownload == urltodownload) {
				show.allreadyDownloaded = value
			}
		})
		//console.log(`\nShowcollection a generar ${JSON.stringify(docWithShowCollection)}`)

		return this.delete(docWithShowCollection.name)
			.then(
				numRemoved => {
					//console.log(`Eliminada ${numRemoved} colecciones`)
					return numRemoved
				})
			.then(
				this.save(docWithShowCollection).then(
					newShowCollection => {
						//console.log(`Se ha creado una nueva show collection ${JSON.stringify(newShowCollection)}`)
						return newShowCollection
					}))
			.catch(err => {
				console.error("ERROR! - _updateAllreadyDownloadedShowByURL " + err)
			})
	}
}

//
// Node modules
//
module.exports = FavoriteRepository;