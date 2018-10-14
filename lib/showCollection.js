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

  toStringSimple() {
    var str = `ShowCollection: '${this.name}'\n`
    this.shows.forEach(show => {
      str += `   Show -> Name:'${show.title}', Session:'${show.currentSession}', Episode:'${show.currentEpisode}', Downloaded?:'${show.allreadyDownloaded}', urltodownload:'${show.urltodownload}'\n`
    })
    return str
  }
}

//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = ShowCollection;

