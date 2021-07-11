//
// TVShowcollection functions/utilities for parsing
//
exports.parseUrlWithShowCollectionName = function (strURLWithCollection) {
  // Collection Name
  var collectionName = ''
  var urlSplittedStr = strURLWithCollection.split('/')
  //console.log(`parseUrlWithShowCollectionName: ${urlSplittedStr}`)

  if (urlSplittedStr.length > 1) {
    collectionName = `${urlSplittedStr[urlSplittedStr.length - 2]}/${urlSplittedStr[urlSplittedStr.length - 1]}`
  }
  return collectionName
}