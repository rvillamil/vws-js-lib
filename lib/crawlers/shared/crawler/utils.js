/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
exports.removeDuplicatedShowsByName = function (shows) {
  const uniq = {}
  // eslint-disable-next-line max-len
  return shows.filter((/** @type {{ title: string | number; }} */ obj) => !uniq[obj.title] && (uniq[obj.title] = true)) // Filtramos repetidos
}
