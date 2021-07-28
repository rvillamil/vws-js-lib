// @ts-ignore
exports.removeDuplicatedShowsByName = function (/** @type {Show[]} */ shows) {    
  var uniq = {}
  return shows.filter(obj => !uniq[obj.title] && (uniq[obj.title] = true)) // Filtramos repetidos   
}