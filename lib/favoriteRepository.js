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
					reject(Error(`ERROR! findAll ${err}`));
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
					reject(Error(`ERROR! findByCollectionName ${err}`));
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
					reject(Error(`ERROR! findShowByURLtodownload ${err}`));
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

	findShowCollectionWithShowByURLtodownload(urltodownload) {
		return new Promise((resolve, reject) => {
			this.db.find({
				"shows.urltodownload": urltodownload
			}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! findShowCollectionWithShowByURLtodownload ${err}`));
				} else {
					resolve(records[0]);
				}
			});
		});
	}

	updateAllreadyDownloadedShowByURL(urltodownload, value) {

		return this.findShowCollectionWithShowByURLtodownload(urltodownload).then(
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
			console.error(`ERROR! updateAllreadyDownloadedShowByURL ${err}`)
		})
	}

	save(showCollection) {
		return new Promise((resolve, reject) => {
			this.db.insert(showCollection, function (err, newShowCollection) {
				if (err) {
					reject(Error(`ERROR! save error:  ${err}`));
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
					reject(Error(`ERROR! delete error:  ${err}`));
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
					reject(Error(`ERROR! deleteAll error:  ${err}`));
				} else {
					resolve(numRemoved);
				}
			});
		});
	}

	mergeShowCollections(fromCrawledCollection, toPersistedCollectionName) {
		// fromCrawledCollection : Tiene la coleccion crawleada de internet
		// toPersistedCollectionName: Nombre de la coleccion en BB.DD sobre la que queremos actualizar la coleccion anterior

		return this.findByCollectionName(toPersistedCollectionName)
			.then(
				showCollectionPersistedFound => {
					console.log(`Encontrada coleccion en persistencia: '${showCollectionPersistedFound.name}'`)
					return showCollectionPersistedFound
				})
			.then(showCollectionPersisted => {
				var newShows = []
				fromCrawledCollection.shows.forEach(showCrawled => {

					var showAlreadyExists = false
					showCollectionPersisted.shows.forEach(showPersisted => {
						if (showPersisted.urltodownload == showCrawled.urltodownload) {
							showAlreadyExists = true
						}
					})
					if (!showAlreadyExists) {
						newShows.push(showCrawled)
						console.log(`Nuevo show a actualizar en BB.DD '${showCrawled.title} - S.${showCrawled.currentSession}.Ep.${showCrawled.currentEpisode}'`)
					}
				})
				// Completamos la lista de shows a reemplazar con los que ya estaban en la BB.DD
				showCollectionPersisted.shows.forEach(showPersisted => {
					newShows.push(showPersisted)
				})
				return newShows

			})
			.then(newShowsToPersist => {
				return this.updateCollectionWithNewShows(toPersistedCollectionName, newShowsToPersist)
			})
			.catch(err => {
				console.log(`ERROR! - mergeShowCollections - ${err}`)
			})
	}

	updateCollectionWithNewShows(persistedCollectionName, newShowsToPersist) {
		//console.log(`Actualizando la coleccion '${persistedCollectionName}' con los shows '${JSON.stringify(newShowsToPersist)}'`)

		return new Promise((resolve, reject) => {
			this.db.update({
				name: persistedCollectionName
			}, {
				$set: {
					"shows": newShowsToPersist
				}
			}, function (err, numReplaced) {
				if (err) {
					reject(Error(`ERROR! - updateCollectionWithNewShows ${err}`));
				} else {
					console.log(`updateCollectionWithNewShows	 - reemplazos: '${numReplaced}'`)
					resolve(newShowsToPersist);
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