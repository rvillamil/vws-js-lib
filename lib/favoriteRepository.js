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

	findShowCollectionWithShowByURLtodownload(urltodownload) {
		return new Promise((resolve, reject) => {
			this.db.find({
				"shows.urltodownload": urltodownload
			}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findShowCollectionWithShowByURLtodownload ${err}`));
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
			console.error(`ERROR! FavoriteRepository - updateAllreadyDownloadedShowByURL ${err}`)
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
		console.log(`Actualizando la coleccion '${persistedCollectionName}' con los shows '${JSON.stringify(newShowsToPersist)}'`)

		return new Promise((resolve, reject) => {
			this.db.update({
				name: persistedCollectionName
			}, {
				$set: {
					"shows": newShowsToPersist
				}
			}, function (err, numReplaced) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - updateCollectionWithNewShows ${err}`));
				} else {
					console.log(`updateCollectionWithNewShows - reemplazos: '${numReplaced}'`)
					resolve(newShowsToPersist);
				}
			})
		});
	}


	/*
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
					//var reverseShows = newShowCollectionName.shows.reverse()
					//newShowCollectionName.shows = reverseShows
					return numReplacedTotal
				}
			)
			.catch(err => {
				console.log(`ERROR! - updateCollectionWithNewShows - ${err}`)
			})
	}
*/
	/*
	updateCollectionWithNewShow(newShowCollectionName, newShow) {

		return this.findShowByURLtodownload(newShow.urltodownload).then(
			docFound => {
				if (!docFound) {
					console.log(`updateCollectionWithNewShow - Show ${newShow.title} (${newShow.currentSession}/${newShow.currentEpisode})' not found!!`)
					return newShow
				} else {
					console.log(`updateCollectionWithNewShow - Show found ${docFound.title} (${docFound.currentSession}/${docFound.currentEpisode})`)
					return null
				}
			}
		).then(theNewShow => {
			if (theNewShow) {

				return this.findByCollectionName(newShowCollectionName).then(showCollection => {
					//console.log(`Coleccion encontrada: ${newShowCollectionName}`)
					return showCollection
				}).then(
					showCollection => {
						var newShows = showCollection.shows
						newShows.push(theNewShow)

						return this._updateCollectionWithNewShow(showCollection, newShows).then(
							numReplaced => {
								//console.log('Numreplaced ' + numReplaced)
								return numReplaced
							})
					}
				)
			} else {
				return 0
			}
		}).catch(err => {
			console.error(`ERROR! FavoriteRepository - updateCollectionWithNewShow ${err}`)
		})
	}
*/


	/*
		updateCollectionWithNewShow(showCollection, newShows) {
			console.log(`\n\nRecibidos los shows ${JSON.stringify(newShows)}`)
			return new Promise((resolve, reject) => {

				this.db.update({
					name: showCollection.name
				}, {

					$set: {
						"shows": newShows
					}
				}, function (err, numReplaced) {
					if (err) {
						reject(Error(`ERROR! FavoriteRepository - _updateCollectionWithNewShow ${err}`));
					} else {
						console.log(`updateCollectionWithNewShow - Numreplaces: '${numReplaced}'`)
						resolve(numReplaced);
					}
				})
			});
		}
	*/
}

//
// Node modules
//
module.exports = FavoriteRepository;