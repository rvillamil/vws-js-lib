/* eslint-disable no-console */
//
// npm modules required
//
var Datastore = require('nedb') // https://github.com/louischatriot/nedb

/**
 * Load database name from 'dbFilePath' directory. Create new database if not exist
 * 
 * @param {*} dbFilePath Path in file system 
 */
exports.createDB = function (dbFilePath) {
    console.log(`database - Loading database from '${dbFilePath}'`)
    var db = new Datastore({
        filename: dbFilePath,
        autoload: true
    })
    return db
}