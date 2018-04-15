//
// npm modules required
//
var Datastore = require('nedb') // https://github.com/louischatriot/nedb

/**
 * Load database from path. Create new database if not exist
 * 
 * @param {*} dbFilePath Path where database file is located
 */
exports.createDB = function (dbFilePath) {
	//const database_path = __dirname + 'vws-db'
	console.log(`Loading database from '${dbFilePath}'`)
	var db = new Datastore({
		filename: dbFilePath,
		autoload: true
	});

	db.ensureIndex({
		fieldName: 'name',
		unique: true
	});

	return db
}