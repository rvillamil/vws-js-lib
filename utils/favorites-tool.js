/* eslint-disable no-console */
var ShowCollection = require('../lib/model/showCollection')
var FavoriteRepository = require('../lib/repositories/favoriteRepository')

function processArgsNumber() {
  if (process.argv.length > 5) {
    console.log('ERROR! Number of arguments error. 2 parameters are requiered')
    help()
    process.exit(1)
  }
}

// mandatory
function processOptionArgument() {
  var option = process.argv[2]
  if (!option) {
    console.log('ERROR! wrong parameters')
    help()
    process.exit(1)
  }
  if ((option != '-d') &&
        (option != '-s') &&
        (option != '-l')) {

    console.log('ERROR! wrong parameters')
    help()
    process.exit(1)
  }
  return option
}

// mandatory
function processUserDataPath() {
  var userDataPath = process.argv[3]
  if (!userDataPath) {
    console.log('ERROR! wrong parameters')
    help()
    process.exit(1)
  }

  return userDataPath
}

// optional
function processParamTitle() {
  var titleToSearch = process.argv[4]
  var option = process.argv[2]

  if (!titleToSearch) {
    console.log('ERROR! wrong parameters')
    help()
    process.exit(1)
  }
  if ((!titleToSearch) && (option == '-l')) {
    console.log('ERROR! wrong parameters')
    help()
    process.exit(1)
  }
  return titleToSearch
}

function help() {
  console.log(`Usage: ${process.argv[1]} [-s|-d|-l] 'database path' [show collection name]`)
  console.log('-s: save show collection (Only works on pctmix.org)')
  console.log('-d: delete show collection')
  console.log('-l: list show collection')
  console.log('     e.g.: ./dbutils -l \'/Users/Rodrigo/Library/Application Support/Video Website Scraper/vws-db\'')
  console.log('     e.g.: ./dbutils -s \'/Users/Rodrigo/Library/Application Support/Video Website Scraper/vws-db\' \'pp/ll\'')
}

function saveFavoriteShowCollection(showCollectionName) {

  var showCollection = new ShowCollection()

  showCollection.name = showCollectionName
  showCollection.url = 'https://pctmix.org/series-hd/' + showCollectionName
  showCollection.domain = 'pctmix.org'

  return favoriteRepository.save(showCollection).then(
    newShowCollection => {
      console.log(`Show collection saved!: ${JSON.stringify(newShowCollection)}\n`)
    }
  ).catch(err => {
    console.error(err)
  })
}

function deleteFavoriteShowCollection(showCollectionName) {

  var showCollection = new ShowCollection()
  showCollection.name = showCollectionName

  return favoriteRepository.delete(showCollectionName).then(
    numRemoved => {
      console.log(`Show collection name '${showCollectionName}' deleted!. ${numRemoved} items removed`)
    }
  ).catch(err => {
    console.error(err)
  })
}


function listAllFavoritesShowCollection() {
  return favoriteRepository.findAll().then(
    showCollectionList => {
      showCollectionList.forEach(function (showCollection) {
        console.log(`Show collection saved!: ${JSON.stringify(showCollection)}\n`)
      })
    }
  ).catch(err => {
    console.error(err)
  })
}
//
// Global var
//
processArgsNumber()
var option = processOptionArgument()
var favoriteRepository = new FavoriteRepository(processUserDataPath())
if (option == '-d') {
  deleteFavoriteShowCollection(processParamTitle())
} else if (option == '-s') {
  saveFavoriteShowCollection(processParamTitle())
} else if (option == '-l') {
  listAllFavoritesShowCollection()
}