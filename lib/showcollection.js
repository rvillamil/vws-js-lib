// NPM modules
const Show = require('./show');

/**
 * Collection of shows. e.g. TVshow session 
 */
class ShowCollection {

  constructor() {
    this.name = null; // e.g: 'erase-una-vez/1490'
    this.url = null; // url to page with list of links to other tvshows
    this.shows = []; // Array with collection shows
  }

  getShows() {
    return this.shows
  }

  push(show) {
    this.shows.push(show)
  }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = ShowCollection;