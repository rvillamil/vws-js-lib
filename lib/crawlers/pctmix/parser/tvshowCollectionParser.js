/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
//
// TVShowcollection functions/utilities for parsing
//
exports.parseUrlWithShowCollectionName = function (strURLWithCollection) {
  // Collection Name
  let collectionName = ''
  const urlSplittedStr = strURLWithCollection.split('/')
  // console.log(`parseUrlWithShowCollectionName: ${urlSplittedStr}`)

  if (urlSplittedStr.length > 1) {
    collectionName = `${urlSplittedStr[urlSplittedStr.length - 2]}/${urlSplittedStr[urlSplittedStr.length - 1]}`
  }
  return collectionName
}
